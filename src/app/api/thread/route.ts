import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validateLang, validateNumber } from '@/lib/validate'

const VALID_THREAD_PLATFORMS = ['twitter', 'instagram'] as const

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

    const { topic: rawTopic, platform, parts: rawParts, lang: rawLang } = await req.json()

    // Validate inputs
    const topicCheck = validateString(rawTopic, 500)
    if (!topicCheck.valid) {
      return NextResponse.json({ error: topicCheck.error }, { status: 400 })
    }
    const topic = topicCheck.value

    if (!platform || !VALID_THREAD_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram' }, { status: 400 })
    }

    const partsCheck = validateNumber(rawParts, 3, 10)
    if (!partsCheck.valid) {
      return NextResponse.json({ error: partsCheck.error }, { status: 400 })
    }
    const parts = partsCheck.value

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check usage (count as 1 singlePost)
    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const upgradeMsg = usage.limit === 0
        ? 'Thread generation is not available on this plan. Please upgrade.'
        : `You have reached your monthly limit of ${usage.limit} generations. Please upgrade.`
      return NextResponse.json({
        error: upgradeMsg,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    const platformLabel = platform === 'twitter' ? 'Twitter Thread' : 'Instagram Carousel'

    const isEnglish = lang === 'en'

    const systemPrompt = isEnglish
      ? `You are a professional social media expert.

Generate a ${parts}-part ${platformLabel} about: ${topic}

Each part should be compelling and build on the previous one. Include hooks, engagement elements, and a strong call-to-action in the final part.
${platform === 'twitter' ? 'Each part should be under 280 characters.' : 'Each part should be a compelling carousel slide caption.'}

REQUIRED FORMAT (JSON array of strings):
["Part 1 text", "Part 2 text", ...]

Return ONLY a JSON array of ${parts} strings. No other text.`
      : `Sen profesyonel bir sosyal medya uzmanisin.

${topic} hakkinda ${parts} parcalik bir ${platformLabel} olustur.

Her parca ilgi cekici olmali ve bir oncekinin uzerine insa etmeli. Hook cumleleri, etkilesim artirici unsurlar ve son parcada guclu bir aksiyona cagiris ekle.
${platform === 'twitter' ? 'Her parca 280 karakterden kisa olmali.' : 'Her parca etkileyici bir carousel slide aciklamasi olmali.'}

ZORUNLU FORMAT (JSON string dizisi):
["Parca 1 metni", "Parca 2 metni", ...]

SADECE ${parts} elemanli JSON dizisi dondur. Baska bir sey yazma.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: string[]
    try {
      parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) throw new Error('Not an array')
    } catch {
      // Fallback: split by newlines
      parsed = text.split('\n').filter(Boolean).slice(0, parts)
    }

    // Increment usage after success
    let newUsed = usage.used
    if (usage.limit !== Infinity) {
      newUsed = await incrementUsage(userId, 'singlePosts')
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: newUsed, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Thread Generate Error:', error)
    const message = error instanceof Error ? error.message : 'Could not generate thread'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
