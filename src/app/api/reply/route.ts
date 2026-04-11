import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validateLang } from '@/lib/validate'

const VALID_PLATFORMS = ['twitter', 'instagram', 'linkedin', 'tiktok'] as const
const VALID_TONES = ['witty', 'supportive', 'expert', 'casual'] as const
const VALID_GOALS = ['engage', 'network', 'promote'] as const

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

    const { content: rawContent, platform, tone, goal, lang: rawLang } = await req.json()

    // Validate inputs
    const contentCheck = validateString(rawContent, 1000)
    if (!contentCheck.valid) {
      return NextResponse.json({ error: contentCheck.error }, { status: 400 })
    }
    const content = contentCheck.value

    if (!validateEnum(platform, VALID_PLATFORMS)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    if (!validateEnum(tone, VALID_TONES)) {
      return NextResponse.json({ error: 'Invalid tone. Allowed: witty, supportive, expert, casual' }, { status: 400 })
    }

    if (!validateEnum(goal, VALID_GOALS)) {
      return NextResponse.json({ error: 'Invalid goal. Allowed: engage, network, promote' }, { status: 400 })
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

    const systemPrompt = lang === 'en'
      ? `Generate 3 reply/comment suggestions for this ${platform} post. Tone: ${tone}. Goal: ${goal}. Write in ${language}.
Original post: ${content}

Each reply should feel natural and encourage engagement. Keep replies appropriate for ${platform}.

REQUIRED FORMAT (JSON):
["reply 1", "reply 2", "reply 3"]

Return ONLY JSON.`
      : `Bu ${platform} gonderisi icin 3 yanit/yorum onerisi uret. Ton: ${tone}. Hedef: ${goal}. ${language} dilinde yaz.
Orijinal gonderi: ${content}

Her yanit dogal hissettirmeli ve etkilesimi tesvik etmeli. Yanitlar ${platform} platformuna uygun olmali.

ZORUNLU FORMAT (JSON):
["yanit 1", "yanit 2", "yanit 3"]

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: string[]
    try {
      parsed = JSON.parse(text)
      if (!Array.isArray(parsed) || parsed.length < 3) {
        parsed = [text, text, text]
      }
    } catch {
      parsed = [text, text, text]
    }

    // Increment usage after successful generation
    let newUsed = usage.used
    if (usage.limit !== Infinity) {
      newUsed = await incrementUsage(userId, 'singlePosts')
    }

    return NextResponse.json({
      replies: parsed.slice(0, 3),
      usage: { used: newUsed, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Reply Generate Error:', error)
    const message = error instanceof Error ? error.message : 'Could not generate replies'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
