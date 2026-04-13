import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validateLang } from '@/lib/validate'

const VALID_TONES = ['professional', 'casual', 'humorous', 'bold', 'inspirational', 'educational'] as const
const VALID_LENGTHS = ['shorter', 'same', 'longer'] as const
const VALID_PLATFORMS = ['twitter', 'instagram', 'linkedin', 'tiktok'] as const

function validateEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.includes(value as T)
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

    const { content: rawContent, tone, length, platform, lang: rawLang } = await req.json()

    // Validate inputs
    const contentCheck = validateString(rawContent, 2000)
    if (!contentCheck.valid) {
      return NextResponse.json({ error: contentCheck.error }, { status: 400 })
    }
    const content = contentCheck.value

    if (!validateEnum(tone, VALID_TONES)) {
      return NextResponse.json({ error: 'Invalid tone. Allowed: professional, casual, humorous, bold, inspirational, educational' }, { status: 400 })
    }

    if (!validateEnum(length, VALID_LENGTHS)) {
      return NextResponse.json({ error: 'Invalid length. Allowed: shorter, same, longer' }, { status: 400 })
    }

    if (platform && !validateEnum(platform, VALID_PLATFORMS)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check usage
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

    const platformHint = platform ? (lang === 'en' ? `Optimize for ${platform}.` : `${platform} icin optimize et.`) : ''

    const systemPrompt = lang === 'en'
      ? `Rewrite this social media content with a ${tone} tone. Make it ${length} than the original. Keep the core message but transform the style. ${platformHint} Write in ${language}.

Original: ${content}

REQUIRED FORMAT (JSON):
{"rewritten": "the new text", "changes": "brief summary of what changed"}

Return ONLY JSON.`
      : `Bu sosyal medya icerigini ${tone} tonunda yeniden yaz. Orijinalden ${length === 'shorter' ? 'daha kisa' : length === 'longer' ? 'daha uzun' : 'ayni uzunlukta'} yap. Ana mesaji koru ama stili donustur. ${platformHint} ${language} dilinde yaz.

Orijinal: ${content}

ZORUNLU FORMAT (JSON):
{"rewritten": "yeni metin", "changes": "neyin degistigi hakkinda kisa ozet"}

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt, { maxOutputTokens: 900, temperature: 0.6 })
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: { rewritten: string; changes: string }
    try {
      parsed = JSON.parse(text)
      if (!parsed.rewritten) {
        parsed = { rewritten: text, changes: '' }
      }
    } catch {
      parsed = { rewritten: text, changes: '' }
    }

    // Increment usage after successful generation
    let newUsed = usage.used
    if (usage.limit !== Infinity) {
      newUsed = await incrementUsage(userId, 'singlePosts')
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: newUsed, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Rewrite Error:', error)
    const message = error instanceof Error ? error.message : 'Could not rewrite content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
