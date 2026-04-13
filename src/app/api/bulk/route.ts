import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validatePlatform, validateLang, sanitize } from '@/lib/validate'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const rl = rateLimit(userId, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
    }

    const { topics: rawTopics, platform, lang: rawLang } = await req.json()

    // Validate platform
    if (!validatePlatform(platform)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    // Validate topics array
    if (!Array.isArray(rawTopics) || rawTopics.length === 0 || rawTopics.length > 5) {
      return NextResponse.json({ error: 'Topics must be an array of 1-5 items.' }, { status: 400 })
    }

    const topics: string[] = []
    for (const raw of rawTopics) {
      const check = validateString(raw, 200)
      if (!check.valid) {
        return NextResponse.json({ error: `Invalid topic: ${check.error}` }, { status: 400 })
      }
      topics.push(check.value)
    }

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check if user has enough remaining usage BEFORE starting
    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      return NextResponse.json({
        error: lang === 'en'
          ? `You've reached your monthly limit of ${usage.limit} generations. Upgrade your plan.`
          : `Aylik ${usage.limit} icerik uretimi limitinize ulastiniz. Planinizi yukseltin.`,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    // Check if enough remaining for all topics
    if (usage.limit !== Infinity) {
      const remaining = usage.limit - usage.used
      if (remaining < topics.length) {
        return NextResponse.json({
          error: lang === 'en'
            ? `Not enough remaining usage. You have ${remaining} generations left but need ${topics.length}. Upgrade your plan.`
            : `Yeterli kullanim hakkiniz yok. ${remaining} uretim hakkiniz kaldi ama ${topics.length} gerekiyor. Planinizi yukseltin.`,
          limitReached: true,
          used: usage.used,
          limit: usage.limit,
          plan: usage.plan,
        }, { status: 429 })
      }
    }

    // Get brand settings
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}
    const brandTone = brand.tone || ''

    const platformRules: Record<string, Record<string, string>> = {
      tr: {
        twitter: 'Twitter/X: Max 280 karakter. Kisa, vurucu. 2-3 hashtag.',
        instagram: 'Instagram: Caption formati. Emoji agirlikli. 5-10 hashtag.',
        linkedin: 'LinkedIn: Profesyonel ton. Deger odakli. 3-5 hashtag.',
        tiktok: 'TikTok: Video aciklamasi. Enerjik. 3-5 hashtag.',
      },
      en: {
        twitter: 'Twitter/X: Max 280 chars. Short, punchy. 2-3 hashtags.',
        instagram: 'Instagram: Caption format. Emoji-rich. 5-10 hashtags.',
        linkedin: 'LinkedIn: Professional tone. Value-driven. 3-5 hashtags.',
        tiktok: 'TikTok: Video description. Energetic. 3-5 hashtags.',
      },
    }

    const rule = (platformRules[lang] || platformRules.tr)[platform] || platformRules.tr.twitter
    const toneHint = brandTone ? (lang === 'en' ? `Tone: ${brandTone}.` : `Ton: ${brandTone}.`) : ''

    const topicList = topics.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')

    const systemPrompt = lang === 'en'
      ? `You are a social media expert. Generate a viral ${platform} post for EACH topic below.
${rule}
${toneHint}
Also give each a viral score from 1-100 (hook strength, engagement potential, hashtag quality, platform fit).
Write in ${language}.

Topics:
${topicList}

REQUIRED FORMAT (JSON array, one object per topic in order):
[{"text": "post content", "score": 85}, ...]

Return ONLY a JSON array with exactly ${topics.length} objects.`
      : `Sen bir sosyal medya uzmanisin. Asagidaki HER konu icin viral bir ${platform} gonderisi uret.
${rule}
${toneHint}
Ayrica her birine 1-100 arasi viral skor ver (hook gucu, etkilesim potansiyeli, hashtag kalitesi, platform uyumu).
${language} dilinde yaz.

Konular:
${topicList}

ZORUNLU FORMAT (JSON dizisi, her konu icin sirali bir nesne):
[{"text": "gonderi icerigi", "score": 85}, ...]

SADECE tam ${topics.length} nesneli JSON dizisi dondur.`

    let text = await generateContent(systemPrompt, { maxOutputTokens: 2000, temperature: 0.8 })
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsedArr: { text: string; score: number }[]
    try {
      parsedArr = JSON.parse(text)
      if (!Array.isArray(parsedArr)) throw new Error('Not an array')
    } catch {
      parsedArr = topics.map(() => ({ text: text.slice(0, 500), score: 70 }))
    }

    const results = topics.map((topic: string, i: number) => ({
      topic,
      text: parsedArr[i]?.text || '',
      score: parsedArr[i]?.score || 70,
    }))

    // Increment usage for each topic
    if (usage.limit !== Infinity) {
      for (let i = 0; i < topics.length; i++) {
        await incrementUsage(userId, 'singlePosts')
      }
    }

    const updatedUsage = await checkUsage(userId, 'singlePosts')

    return NextResponse.json({
      results,
      usage: { used: updatedUsage.used, limit: updatedUsage.limit, plan: updatedUsage.plan },
    })
  } catch (error: unknown) {
    console.error('Bulk Generate Error:', error)
    const message = error instanceof Error ? error.message : 'Could not generate content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
