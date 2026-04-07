import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkAndIncrementUsage } from '@/lib/usage'
import { getUserPlan, PLAN_LIMITS } from '@/lib/plans'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 })
    }

    const usage = await checkAndIncrementUsage(userId, 'calendar')
    if (!usage.allowed) {
      const msg = usage.limit === 0
        ? 'İçerik takvimi bu planda kullanılamaz. Planınızı yükseltin.'
        : `Aylık ${usage.limit} takvim limitinize ulaştınız. Planınızı yükseltin.`
      return NextResponse.json({ error: msg, limitReached: true }, { status: 429 })
    }

    const { topic, days } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    // Enforce max calendar days per plan
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const plan = getUserPlan(user.publicMetadata as Record<string, unknown>)
    const maxDays = PLAN_LIMITS[plan].maxCalendarDays
    const dayCount = Math.min(days || 7, maxDays)

    const brand = (user.publicMetadata?.brand as Record<string, string>) || {}
    const brandContext = brand.name
      ? `\nMarka: ${brand.name}, Sektör: ${brand.sector || '-'}, Ton: ${brand.tone || 'Profesyonel'}, Hedef Kitle: ${brand.audience || '-'}`
      : ''

    const today = new Date()
    const startDate = today.toISOString().split('T')[0]

    const systemPrompt = `Sen profesyonel bir sosyal medya planlayıcısısın.${brandContext}

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
      return NextResponse.json({ error: 'Takvim oluşturulamadı, tekrar deneyin.' }, { status: 500 })
    }

    return NextResponse.json({
      calendar: parsed,
      usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
    })
  } catch (error: unknown) {
    console.error('Calendar Error:', error)
    const message = error instanceof Error ? error.message : 'Takvim oluşturulamadı'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
