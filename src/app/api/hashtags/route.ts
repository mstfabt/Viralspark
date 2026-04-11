import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
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

    const { topic: rawTopic, platform, lang: rawLang } = await req.json()
    const lang = validateLang(rawLang) ? rawLang : 'tr'

    const topicCheck = validateString(rawTopic, 200)
    if (!topicCheck.valid) {
      return NextResponse.json({ error: lang === 'en' ? 'Topic is required (max 200 chars)' : 'Konu gerekli (max 200 karakter)' }, { status: 400 })
    }
    const topic = topicCheck.value

    if (platform && !validatePlatform(platform)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    const usage = await checkAndIncrementUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const msg = lang === 'en'
        ? `You've reached your monthly limit of ${usage.limit}. Upgrade your plan.`
        : `Aylık ${usage.limit} kullanım limitinize ulaştınız. Planınızı yükseltin.`
      return NextResponse.json({ error: msg, limitReached: true }, { status: 429 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}
    const brandContext = brand.sector ? (lang === 'en' ? `Industry: ${brand.sector}. ` : `Sektör: ${brand.sector}. `) : ''

    const prompt = lang === 'en'
      ? `You are a social media hashtag expert.
${brandContext}
Topic: ${topic}
Platform: ${platform || 'general'}

Create the most effective hashtag strategy for this topic.

REQUIRED FORMAT (JSON):
{
  "primary": ["5 most relevant hashtags - high volume"],
  "secondary": ["5 medium competition hashtags - niche audience"],
  "trending": ["3-5 currently trending related hashtags"],
  "niche": ["3-5 low competition but targeted hashtags"],
  "avoid": ["2-3 hashtags to avoid and why"],
  "strategy": "Short strategy note on how to combine these hashtags"
}

Return ONLY JSON.`
      : `Sen bir sosyal medya hashtag uzmanısın.
${brandContext}
Konu: ${topic}
Platform: ${platform || 'genel'}

Bu konu için en etkili hashtag stratejisini oluştur.

ZORUNLU FORMAT (JSON):
{
  "primary": ["en ilişkili 5 hashtag - yüksek hacim"],
  "secondary": ["orta rekabet 5 hashtag - niş kitle"],
  "trending": ["şu an trend olan 3-5 ilişkili hashtag"],
  "niche": ["düşük rekabet ama hedefli 3-5 hashtag"],
  "avoid": ["kullanılmaması gereken 2-3 hashtag ve nedeni"],
  "strategy": "Bu hashtagleri nasıl kombine etmeli kısa strateji notu"
}

SADECE JSON döndür.`

    let text = await generateContent(prompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = {
        primary: ['#' + topic.replace(/\s+/g, '')],
        secondary: [],
        trending: [],
        niche: [],
        avoid: [],
        strategy: text,
      }
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Hashtag Error:', error)
    const message = error instanceof Error ? error.message : 'Hashtag research failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
