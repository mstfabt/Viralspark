import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 })
    }

    const { niche, platform, competitors } = await req.json()
    if (!niche) {
      return NextResponse.json({ error: 'Sektör/niş gerekli' }, { status: 400 })
    }

    const usage = await checkAndIncrementUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      return NextResponse.json({
        error: `Aylık ${usage.limit} kullanım limitinize ulaştınız. Planınızı yükseltin.`,
        limitReached: true,
      }, { status: 429 })
    }

    const competitorList = competitors ? `\nRakipler: ${competitors}` : ''

    const prompt = `Sen bir sosyal medya strateji uzmanısın.

Sektör/Niş: ${niche}
Platform: ${platform || 'genel'}${competitorList}

Bu sektördeki sosyal medya rakip analizini yap.

ZORUNLU FORMAT (JSON):
{
  "topStrategies": [
    {"strategy": "strateji adı", "description": "açıklama", "effectiveness": "high/medium/low"}
  ],
  "contentTypes": [
    {"type": "içerik türü", "frequency": "haftalık tavsiye sayısı", "engagement": "yüksek/orta/düşük"}
  ],
  "bestTimes": ["en iyi paylaşım zamanları"],
  "gaps": ["rakiplerin kaçırdığı fırsatlar - senin avantajın"],
  "hooks": ["bu sektörde en çok işe yarayan 5 hook cümlesi"],
  "recommendations": "genel strateji önerisi paragrafı"
}

SADECE JSON döndür.`

    let text = await generateContent(prompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { recommendations: text, topStrategies: [], contentTypes: [], bestTimes: [], gaps: [], hooks: [] }
    }

    return NextResponse.json({
      result: parsed,
      usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Competitor Error:', error)
    const message = error instanceof Error ? error.message : 'Rakip analizi yapılamadı'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
