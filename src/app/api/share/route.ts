import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { validateString, validateLang } from '@/lib/validate'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const rl = rateLimit(userId, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const { topic: rawTopic, lang: rawLang } = await req.json()
    const lang = validateLang(rawLang) ? rawLang : 'tr'

    const topicCheck = validateString(rawTopic, 500)
    if (!topicCheck.valid) {
      return NextResponse.json({ error: 'Topic required (max 500 chars)' }, { status: 400 })
    }
    const topic = topicCheck.value

    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      return NextResponse.json({
        error: lang === 'en'
          ? `Monthly limit of ${usage.limit} reached. Upgrade your plan.`
          : `Aylık ${usage.limit} limitinize ulaştınız. Planınızı yükseltin.`,
        limitReached: true,
      }, { status: 429 })
    }

    const prompt = lang === 'en'
      ? `You are a social media copywriter.

Topic: ${topic}

Generate:
1. A short, punchy headline/slogan (max 10 words) to overlay on an image
2. A full Instagram caption with hashtags

Return ONLY this JSON format:
{"overlay": "short headline for image", "caption": "full caption text with hashtags"}

Return ONLY valid JSON, nothing else.`
      : `Sen sosyal medya metin yazarısın.

Konu: ${topic}

Üret:
1. Görsel üzerine yazılacak kısa, vurucu bir slogan/başlık (max 10 kelime)
2. Hashtagli tam bir Instagram caption metni

SADECE bu JSON formatında döndür:
{"overlay": "görsele yazılacak kısa slogan", "caption": "hashtagli tam paylaşım metni"}

SADECE geçerli JSON döndür, başka hiçbir şey yazma.`

    let text = await generateContent(prompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      // Fallback: use raw text
      parsed = {
        overlay: text.slice(0, 60),
        caption: text,
      }
    }

    // Increment usage after success
    if (usage.limit !== Infinity) {
      await incrementUsage(userId, 'singlePosts')
    }

    return NextResponse.json({ result: parsed })
  } catch (error: unknown) {
    console.error('Share Error:', error)
    const message = error instanceof Error ? error.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
