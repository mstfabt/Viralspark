import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validatePlatforms, validateLang } from '@/lib/validate'

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function stripHtml(html: string): string {
  // Remove script and style blocks entirely
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '')
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, ' ')
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

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

    const { url: rawUrl, platforms, lang: rawLang } = await req.json()

    // Validate URL
    const url = typeof rawUrl === 'string' ? rawUrl.trim() : ''
    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Please provide a valid URL (http or https).' }, { status: 400 })
    }

    // Validate platforms
    if (!platforms || !validatePlatforms(platforms)) {
      return NextResponse.json({ error: 'Invalid platforms. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check usage — count as 1 singlePost per platform
    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const upgradeMsg = usage.limit === 0
        ? 'URL to Post is not available on this plan. Please upgrade.'
        : `You have reached your monthly limit of ${usage.limit} generations. Please upgrade.`
      return NextResponse.json({
        error: upgradeMsg,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    // Fetch URL content
    let articleContent: string
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10_000)
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ViralSpark Bot/1.0' },
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json({ error: `Could not fetch URL (status ${response.status}).` }, { status: 400 })
      }

      const html = await response.text()
      articleContent = stripHtml(html).slice(0, 2000)

      if (articleContent.length < 50) {
        return NextResponse.json({ error: 'Could not extract meaningful content from the URL.' }, { status: 400 })
      }
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error && fetchErr.name === 'AbortError'
        ? 'URL fetch timed out (10s limit).'
        : 'Could not fetch URL content.'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const platformRules: Record<string, Record<string, string>> = {
      en: {
        twitter: 'Twitter/X: Max 280 chars. Short, punchy. 2-3 hashtags.',
        instagram: 'Instagram: Engaging caption. Emoji-rich, storytelling. 5-10 hashtags.',
        linkedin: 'LinkedIn: Professional tone. Value-driven. Short paragraphs. 3-5 hashtags.',
        tiktok: 'TikTok: Video description. Gen-Z language, energetic. 3-5 hashtags.',
      },
      tr: {
        twitter: 'Twitter/X: Max 280 karakter. Kisa, vurucu. 2-3 hashtag.',
        instagram: 'Instagram: Etkileyici caption. Emoji agirlikli, hikaye anlatici. 5-10 hashtag.',
        linkedin: 'LinkedIn: Profesyonel ton. Deger odakli. Kisa paragraflar. 3-5 hashtag.',
        tiktok: 'TikTok: Video aciklamasi. Gen-Z dili, enerjik. 3-5 hashtag.',
      },
    }

    const rules = platformRules[lang] || platformRules.tr
    const platformInstructions = platforms.map((p: string) => `- ${rules[p] || rules.twitter}`).join('\n')

    const formatExample = platforms.map((p: string) => `"${p}": {"text": "post content", "score": 85}`).join(',\n  ')

    const isEnglish = lang === 'en'

    const systemPrompt = isEnglish
      ? `You are a professional social media expert.

Based on this article content, create social media posts for each platform.

Article content:
${articleContent}

Platform rules:
${platformInstructions}

Also give each post a viral score from 1-100.

REQUIRED FORMAT (JSON):
{
  ${formatExample}
}

Return ONLY JSON.`
      : `Sen profesyonel bir sosyal medya uzmanisin.

Bu makale icerigine dayanarak her platform icin sosyal medya gonderisi olustur.

Makale icerigi:
${articleContent}

Platform kurallari:
${platformInstructions}

Ayrica her gonderiye 1-100 arasi viral skor ver.

ZORUNLU FORMAT (JSON):
{
  ${formatExample}
}

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt, { maxOutputTokens: 1500, temperature: 0.8 })
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: Record<string, { text: string; score: number }>
    try {
      parsed = JSON.parse(text)
    } catch {
      const fallback: Record<string, { text: string; score: number }> = {}
      for (const p of platforms) {
        fallback[p] = { text, score: 70 }
      }
      parsed = fallback
    }

    // Increment usage — count as 1 singlePost per platform
    let newUsed = usage.used
    if (usage.limit !== Infinity) {
      for (let i = 0; i < platforms.length; i++) {
        newUsed = await incrementUsage(userId, 'singlePosts')
      }
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: newUsed, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('URL-to-Post Error:', error)
    const message = error instanceof Error ? error.message : 'Could not generate content from URL'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
