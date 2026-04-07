import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 })
    }

    const { prompt, platforms } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const isMulti = platforms && platforms.length > 1
    const feature = isMulti ? 'multiPlatform' as const : 'singlePosts' as const

    const usage = await checkAndIncrementUsage(userId, feature)
    if (!usage.allowed) {
      const featureLabel = isMulti ? 'Çoklu platform üretimi' : 'İçerik üretimi'
      const upgradeMsg = usage.limit === 0
        ? `${featureLabel} bu planda kullanılamaz. Planınızı yükseltin.`
        : `Aylık ${usage.limit} ${featureLabel.toLowerCase()} limitinize ulaştınız. Planınızı yükseltin.`

      return NextResponse.json({
        error: upgradeMsg,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    // Get brand settings
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}

    const brandContext = brand.name
      ? `\n\nMARKA BİLGİLERİ:
- Marka Adı: ${brand.name}
- Sektör: ${brand.sector || 'Belirtilmemiş'}
- Hedef Kitle: ${brand.audience || 'Belirtilmemiş'}
- Marka Tonu: ${brand.tone || 'Profesyonel ve samimi'}
- Ek Notlar: ${brand.notes || 'Yok'}

İçerikleri bu marka kimliğine uygun oluştur.`
      : ''

    const selectedPlatforms = platforms || ['twitter']

    let systemPrompt: string

    const rules: Record<string, string> = {
      twitter: 'Twitter/X: Max 280 karakter. Kısa, vurucu, tartışma başlatıcı. 2-3 hashtag.',
      instagram: 'Instagram: Caption formatı. Emoji ağırlıklı, hikaye anlatıcı. İlk cümle hook. 5-10 hashtag.',
      linkedin: 'LinkedIn: Profesyonel ton. Değer odaklı, öğretici. Kısa paragraflar. 3-5 hashtag.',
      tiktok: 'TikTok: Video açıklaması. Gen-Z dili, enerjik. "POV:" veya hook ile başla. 3-5 hashtag.',
    }

    const platformRules = selectedPlatforms.map((p: string) => `- ${rules[p] || rules.twitter}`).join('\n')

    systemPrompt = `Sen profesyonel bir sosyal medya uzmanısın.${brandContext}

Konu: ${prompt}

Platform kuralları:
${platformRules}

Her platform için içerik üret. Ayrıca her içeriğe 1-100 arası viral skor ver.
Viral skor kriterleri: hook gücü, etkileşim potansiyeli, hashtag kalitesi, platform uyumu, duygusal tetikleyici.
Düşük skor aldıysa (60 altı) kısa iyileştirme önerisi ekle.

ZORUNLU FORMAT (JSON):
{
  ${selectedPlatforms.map((p: string) => `"${p}": {"text": "içerik metni", "score": 85, "tip": "iyileştirme önerisi veya null"}`).join(',\n  ')}
}

SADECE JSON döndür.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      // Fallback
      const fallback: Record<string, { text: string; score: number; tip: string | null }> = {}
      for (const p of selectedPlatforms) {
        fallback[p] = { text: text, score: 70, tip: null }
      }
      parsed = fallback
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Generate Error:', error)
    const message = error instanceof Error ? error.message : 'İçerik üretilemedi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
