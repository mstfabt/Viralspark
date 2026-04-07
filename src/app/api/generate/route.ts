import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { sendUsageLimitEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 })
    }

    const rl = rateLimit(userId, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Çok fazla istek. Lütfen biraz bekleyin.' }, { status: 429 })
    }

    const { prompt, platforms, variations: reqVariations } = await req.json()
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

    const variationCount = Math.min(reqVariations || 1, 3)

    const variationInstruction = variationCount > 1
      ? `Her platform icin ${variationCount} FARKLI varyasyon uret. Her varyasyon farkli bir hook/yaklasim kullansın.`
      : 'Her platform icin 1 icerik uret.'

    const formatExample = variationCount > 1
      ? selectedPlatforms.map((p: string) => `"${p}": [{"text": "icerik 1", "score": 85, "tip": null}, {"text": "icerik 2", "score": 78, "tip": "oneri"}, {"text": "icerik 3", "score": 72, "tip": "oneri"}]`).join(',\n  ')
      : selectedPlatforms.map((p: string) => `"${p}": {"text": "icerik metni", "score": 85, "tip": "iyilestirme onerisi veya null"}`).join(',\n  ')

    systemPrompt = `Sen profesyonel bir sosyal medya uzmanısın.${brandContext}

Konu: ${prompt}

Platform kuralları:
${platformRules}

${variationInstruction}
Ayrıca her içeriğe 1-100 arası viral skor ver.
Viral skor kriterleri: hook gücü, etkileşim potansiyeli, hashtag kalitesi, platform uyumu, duygusal tetikleyici.
Düşük skor aldıysa (60 altı) kısa iyileştirme önerisi ekle.

ZORUNLU FORMAT (JSON):
{
  ${formatExample}
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

    // Send usage limit warning at 80%
    if (usage.limit > 0 && usage.limit !== Infinity && usage.used >= Math.floor(usage.limit * 0.8)) {
      const userEmail = user.emailAddresses?.[0]?.emailAddress
      if (userEmail) {
        sendUsageLimitEmail(userEmail, user.firstName || 'Kullanici', usage.used, usage.limit)
      }
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
