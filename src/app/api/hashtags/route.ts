import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'

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

    const { topic, platform } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const usage = await checkAndIncrementUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      return NextResponse.json({
        error: `Aylık ${usage.limit} kullanım limitinize ulaştınız. Planınızı yükseltin.`,
        limitReached: true,
      }, { status: 429 })
    }

    // Get brand context
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}
    const brandContext = brand.sector ? `Sektör: ${brand.sector}. ` : ''

    const prompt = `Sen bir sosyal medya hashtag uzmanısın.
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
    const message = error instanceof Error ? error.message : 'Hashtag araştırması yapılamadı'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
