import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { getUserPlan, PLAN_LIMITS } from '@/lib/plans'
import { validateString, validateNumber, validateLang } from '@/lib/validate'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const usage = await checkAndIncrementUsage(userId, 'calendar')
    if (!usage.allowed) {
      const msg = usage.limit === 0
        ? 'Content calendar is not available on this plan. Upgrade your plan.'
        : `You've reached your monthly limit of ${usage.limit} calendars. Upgrade your plan.`
      return NextResponse.json({ error: msg, limitReached: true }, { status: 429 })
    }

    const { topic: rawTopic, days: rawDays, lang: rawLang } = await req.json()
    const lang = validateLang(rawLang) ? rawLang : 'tr'

    const topicCheck = validateString(rawTopic, 200)
    if (!topicCheck.valid) {
      return NextResponse.json({ error: lang === 'en' ? 'Topic is required (max 200 chars)' : 'Konu gerekli (max 200 karakter)' }, { status: 400 })
    }
    const topic = topicCheck.value

    // Validate days if provided (1-30 range, defaults handled below by plan limits)
    let days = rawDays
    if (rawDays !== undefined) {
      const daysCheck = validateNumber(rawDays, 1, 30)
      if (!daysCheck.valid) {
        return NextResponse.json({ error: 'Days must be a number between 1 and 30.' }, { status: 400 })
      }
      days = daysCheck.value
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const plan = getUserPlan(user.publicMetadata as Record<string, unknown>)
    const maxDays = PLAN_LIMITS[plan].maxCalendarDays
    const dayCount = Math.min(days || 7, maxDays)

    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}
    const brandContext = brand.name
      ? `\nBrand: ${brand.name}, Industry: ${brand.sector || '-'}, Tone: ${brand.tone || 'Professional'}, Audience: ${brand.audience || '-'}`
      : ''

    const today = new Date()
    const startDate = today.toISOString().split('T')[0]

    const systemPrompt = lang === 'en'
      ? `You are a professional social media planner.${brandContext}

Topic: ${topic}

Create a ${dayCount}-day content calendar starting from ${startDate}.

For each day:
- Date (YYYY-MM-DD)
- Platform (twitter, instagram, linkedin, tiktok — distribute evenly)
- Topic title (short)
- Content text (platform-appropriate, ready to publish)

Return JSON array:
[{"date":"YYYY-MM-DD","platform":"instagram","title":"Title","content":"Content"}]

Return ONLY JSON. Total ${dayCount} items.`
      : `Sen profesyonel bir sosyal medya planlayıcısısın.${brandContext}

Konu: ${topic}

${startDate} tarihinden başlayarak ${dayCount} günlük içerik takvimi oluştur.

Her gün için:
- Tarih (YYYY-MM-DD)
- Platform (twitter, instagram, linkedin, tiktok — dengeli dağıt)
- Konu başlığı (kısa)
- İçerik metni (platform kurallarına uygun, hazır paylaşılabilir)

JSON array döndür:
[{"date":"YYYY-MM-DD","platform":"instagram","title":"Başlık","content":"İçerik"}]

SADECE JSON döndür. Toplam ${dayCount} öğe.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Calendar generation failed, please try again.' }, { status: 500 })
    }

    return NextResponse.json({
      calendar: parsed,
      usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Calendar Error:', error)
    const message = error instanceof Error ? error.message : 'Calendar generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
