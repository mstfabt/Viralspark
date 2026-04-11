import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
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

    const { niche: rawNiche, platform, competitors: rawCompetitors, lang: rawLang } = await req.json()
    const lang = validateLang(rawLang) ? rawLang : 'tr'

    const nicheCheck = validateString(rawNiche, 200)
    if (!nicheCheck.valid) {
      return NextResponse.json({ error: lang === 'en' ? 'Industry/niche is required (max 200 chars)' : 'Sektor/nis gerekli (max 200 karakter)' }, { status: 400 })
    }
    const niche = nicheCheck.value

    if (platform && !validatePlatform(platform)) {
      return NextResponse.json({ error: 'Invalid platform. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    // Sanitize competitors input
    const competitors = rawCompetitors ? sanitize(rawCompetitors).slice(0, 500) : ''

    const usage = await checkAndIncrementUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const msg = lang === 'en'
        ? `You've reached your monthly limit of ${usage.limit}. Upgrade your plan.`
        : `Aylık ${usage.limit} kullanım limitinize ulaştınız. Planınızı yükseltin.`
      return NextResponse.json({ error: msg, limitReached: true }, { status: 429 })
    }

    const competitorList = competitors ? `\nCompetitors: ${competitors}` : ''

    const prompt = lang === 'en'
      ? `You are a social media strategy expert.

Industry/Niche: ${niche}
Platform: ${platform || 'general'}${competitorList}

Perform a social media competitor analysis for this industry.

REQUIRED FORMAT (JSON):
{
  "topStrategies": [
    {"strategy": "strategy name", "description": "description", "effectiveness": "high/medium/low"}
  ],
  "contentTypes": [
    {"type": "content type", "frequency": "weekly recommendation", "engagement": "high/medium/low"}
  ],
  "bestTimes": ["best posting times"],
  "gaps": ["opportunities competitors are missing - your advantage"],
  "hooks": ["5 most effective hook sentences in this industry"],
  "recommendations": "overall strategy recommendation paragraph"
}

Return ONLY JSON.`
      : `Sen bir sosyal medya strateji uzmanısın.

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
    const message = error instanceof Error ? error.message : 'Competitor analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
