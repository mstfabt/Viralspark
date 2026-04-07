import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { sendUsageLimitEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Giris yapmaniz gerekiyor.' }, { status: 401 })
    }

    const rl = rateLimit(userId, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Cok fazla istek. Lutfen biraz bekleyin.' }, { status: 429 })
    }

    const { prompt, platforms, variations: reqVariations } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const isMulti = platforms && platforms.length > 1
    const feature = isMulti ? 'multiPlatform' as const : 'singlePosts' as const

    // Check limit BEFORE generation (don't increment yet)
    const usage = await checkUsage(userId, feature)
    if (!usage.allowed) {
      const featureLabel = isMulti ? 'Coklu platform uretimi' : 'Icerik uretimi'
      const upgradeMsg = usage.limit === 0
        ? `${featureLabel} bu planda kullanilamaz. Planinizi yukseltin.`
        : `Aylik ${usage.limit} ${featureLabel.toLowerCase()} limitinize ulastiniz. Planinizi yukseltin.`

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
      ? `\n\nMARKA BILGILERI:
- Marka Adi: ${brand.name}
- Sektor: ${brand.sector || 'Belirtilmemis'}
- Hedef Kitle: ${brand.audience || 'Belirtilmemis'}
- Marka Tonu: ${brand.tone || 'Profesyonel ve samimi'}
- Ek Notlar: ${brand.notes || 'Yok'}

Icerikleri bu marka kimligine uygun olustur.`
      : ''

    const selectedPlatforms = platforms || ['twitter']

    const rules: Record<string, string> = {
      twitter: 'Twitter/X: Max 280 karakter. Kisa, vurucu, tartisma baslatici. 2-3 hashtag.',
      instagram: 'Instagram: Caption formati. Emoji agirlikli, hikaye anlatici. Ilk cumle hook. 5-10 hashtag.',
      linkedin: 'LinkedIn: Profesyonel ton. Deger odakli, ogretici. Kisa paragraflar. 3-5 hashtag.',
      tiktok: 'TikTok: Video aciklamasi. Gen-Z dili, enerjik. "POV:" veya hook ile basla. 3-5 hashtag.',
    }

    const platformRules = selectedPlatforms.map((p: string) => `- ${rules[p] || rules.twitter}`).join('\n')
    const variationCount = Math.min(reqVariations || 1, 3)

    const variationInstruction = variationCount > 1
      ? `Her platform icin ${variationCount} FARKLI varyasyon uret. Her varyasyon farkli bir hook/yaklasim kullansin.`
      : 'Her platform icin 1 icerik uret.'

    const formatExample = variationCount > 1
      ? selectedPlatforms.map((p: string) => `"${p}": [{"text": "icerik 1", "score": 85, "tip": null}, {"text": "icerik 2", "score": 78, "tip": "oneri"}, {"text": "icerik 3", "score": 72, "tip": "oneri"}]`).join(',\n  ')
      : selectedPlatforms.map((p: string) => `"${p}": {"text": "icerik metni", "score": 85, "tip": "iyilestirme onerisi veya null"}`).join(',\n  ')

    const systemPrompt = `Sen profesyonel bir sosyal medya uzmanisin.${brandContext}

Konu: ${prompt}

Platform kurallari:
${platformRules}

${variationInstruction}
Ayrica her icerege 1-100 arasi viral skor ver.
Viral skor kriterleri: hook gucu, etkilesim potansiyeli, hashtag kalitesi, platform uyumu, duygusal tetikleyici.
Dusuk skor aldiysa (60 alti) kisa iyilestirme onerisi ekle.

ZORUNLU FORMAT (JSON):
{
  ${formatExample}
}

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const fallback: Record<string, { text: string; score: number; tip: string | null }> = {}
      for (const p of selectedPlatforms) {
        fallback[p] = { text: text, score: 70, tip: null }
      }
      parsed = fallback
    }

    // Only increment AFTER successful generation
    let newUsed = usage.used
    if (usage.limit !== Infinity) {
      newUsed = await incrementUsage(userId, feature)
    }

    // Send usage limit warning at 80%
    if (usage.limit > 0 && usage.limit !== Infinity && newUsed >= Math.floor(usage.limit * 0.8)) {
      const userEmail = user.emailAddresses?.[0]?.emailAddress
      if (userEmail) {
        sendUsageLimitEmail(userEmail, user.firstName || 'Kullanici', newUsed, usage.limit)
      }
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: newUsed, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Generate Error:', error)
    const message = error instanceof Error ? error.message : 'Icerik uretilemedi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
