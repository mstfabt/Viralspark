import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validatePlatform, validateLang } from '@/lib/validate'

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

    const { content: rawContent, platform: rawPlatform, lang: rawLang } = await req.json()

    // Validate inputs
    const contentCheck = validateString(rawContent, 2000)
    if (!contentCheck.valid) {
      return NextResponse.json({ error: contentCheck.error }, { status: 400 })
    }
    const content = contentCheck.value

    if (!validatePlatform(rawPlatform)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }
    const platform = rawPlatform as string

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check usage (counts as 1 singlePost)
    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const msg = usage.limit === 0
        ? (lang === 'en' ? 'Content improvement is not available on this plan. Please upgrade.' : 'Icerik iyilestirme bu planda kullanilamaz. Planinizi yukseltin.')
        : (lang === 'en'
          ? `You've reached your monthly limit of ${usage.limit} generations. Please upgrade.`
          : `Aylik ${usage.limit} icerik uretim limitinize ulastiniz. Planinizi yukseltin.`)

      return NextResponse.json({
        error: msg,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    const platformLabels: Record<string, string> = {
      twitter: 'Twitter/X',
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
    }

    const systemPrompt = lang === 'en'
      ? `You are a social media expert. Analyze this ${platformLabels[platform] || platform} post and provide:
1) overall viral score (0-100)
2) category scores (hook: 0-100, engagement: 0-100, hashtags: 0-100, platformFit: 0-100)
3) improvements array (3-5 specific suggestions)
4) improved version of the content

Content to analyze:
"""
${content}
"""

REQUIRED FORMAT (JSON):
{
  "score": 75,
  "categories": {"hook": 70, "engagement": 80, "hashtags": 60, "platformFit": 75},
  "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "improved": "improved version of the content"
}

Return ONLY JSON.`
      : `Sen bir sosyal medya uzmanisin. Bu ${platformLabels[platform] || platform} paylasimini analiz et ve su bilgileri ver:
1) genel viral skor (0-100)
2) kategori skorlari (hook: 0-100, engagement: 0-100, hashtags: 0-100, platformFit: 0-100)
3) iyilestirme onerileri dizisi (3-5 spesifik oneri)
4) icerigin iyilestirilmis versiyonu

Analiz edilecek icerik:
"""
${content}
"""

ZORUNLU FORMAT (JSON):
{
  "score": 75,
  "categories": {"hook": 70, "engagement": 80, "hashtags": 60, "platformFit": 75},
  "improvements": ["oneri 1", "oneri 2", "oneri 3"],
  "improved": "icerigin iyilestirilmis versiyonu"
}

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt, { maxOutputTokens: 900, temperature: 0.6 })
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: lang === 'en' ? 'Failed to analyze content. Please try again.' : 'Icerik analiz edilemedi. Lutfen tekrar deneyin.' }, { status: 500 })
    }

    // Validate parsed structure
    if (
      typeof parsed.score !== 'number' ||
      !parsed.categories ||
      !Array.isArray(parsed.improvements) ||
      typeof parsed.improved !== 'string'
    ) {
      return NextResponse.json({ error: lang === 'en' ? 'Invalid analysis result. Please try again.' : 'Gecersiz analiz sonucu. Lutfen tekrar deneyin.' }, { status: 500 })
    }

    // Increment usage after success
    if (usage.limit !== Infinity) {
      await incrementUsage(userId, 'singlePosts')
    }

    return NextResponse.json({ result: parsed })
  } catch (error: unknown) {
    console.error('Improve Error:', error)
    const message = error instanceof Error ? error.message : 'Content could not be analyzed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
