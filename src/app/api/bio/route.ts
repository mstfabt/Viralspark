import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContent } from '@/lib/gemini'
import { checkUsage, incrementUsage } from '@/lib/usage'
import { rateLimit } from '@/lib/rate-limit'
import { getAILanguage } from '@/lib/i18n'
import { validateString, validatePlatforms, validateLang } from '@/lib/validate'

const VALID_TONES = ['professional', 'casual', 'creative', 'bold'] as const

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

    const { name: rawName, profession: rawProfession, achievements: rawAchievements, tone, platforms, lang: rawLang } = await req.json()

    // Validate inputs
    const nameCheck = validateString(rawName, 100)
    if (!nameCheck.valid) {
      return NextResponse.json({ error: 'Name: ' + nameCheck.error }, { status: 400 })
    }

    const profCheck = validateString(rawProfession, 200)
    if (!profCheck.valid) {
      return NextResponse.json({ error: 'Profession: ' + profCheck.error }, { status: 400 })
    }

    const achCheck = validateString(rawAchievements, 500)
    if (!achCheck.valid) {
      return NextResponse.json({ error: 'Achievements: ' + achCheck.error }, { status: 400 })
    }

    if (!tone || !VALID_TONES.includes(tone)) {
      return NextResponse.json({ error: 'Invalid tone. Allowed: professional, casual, creative, bold' }, { status: 400 })
    }

    if (!platforms || !validatePlatforms(platforms)) {
      return NextResponse.json({ error: 'Invalid platforms. Allowed: twitter, instagram, linkedin, tiktok' }, { status: 400 })
    }

    const lang = (validateLang(rawLang) ? rawLang : 'tr') as 'tr' | 'en'
    const language = getAILanguage(lang)

    // Check usage (count as 1 singlePost)
    const usage = await checkUsage(userId, 'singlePosts')
    if (!usage.allowed) {
      const upgradeMsg = usage.limit === 0
        ? 'Bio Generator is not available on this plan. Please upgrade.'
        : `You have reached your monthly limit of ${usage.limit} generations. Please upgrade.`
      return NextResponse.json({
        error: upgradeMsg,
        limitReached: true,
        used: usage.used,
        limit: usage.limit,
        plan: usage.plan,
      }, { status: 429 })
    }

    const charLimits: Record<string, number> = {
      twitter: 160,
      instagram: 150,
      linkedin: 300,
      tiktok: 80,
    }

    const platformLimits = platforms.map((p: string) => `- ${p}: max ${charLimits[p] || 160} characters`).join('\n')
    const formatExample = platforms.map((p: string) => `"${p}": "bio text here"`).join(',\n  ')

    const isEnglish = lang === 'en'

    const systemPrompt = isEnglish
      ? `You are a professional personal branding expert.

Generate platform-specific social media bios with a ${tone} tone.

Person details:
- Name/Title: ${nameCheck.value}
- Profession/Niche: ${profCheck.value}
- Key Achievements: ${achCheck.value}

Character limits per platform:
${platformLimits}

IMPORTANT: Each bio MUST be within the character limit for that platform. Make each bio unique and optimized for the specific platform.

REQUIRED FORMAT (JSON):
{
  ${formatExample}
}

Return ONLY JSON.`
      : `Sen profesyonel bir kisisel marka uzmanisin.

${tone === 'professional' ? 'Profesyonel' : tone === 'casual' ? 'Samimi' : tone === 'creative' ? 'Yaratici' : 'Cesur'} tonda platforma ozel sosyal medya biyografileri olustur.

Kisi bilgileri:
- Isim/Unvan: ${nameCheck.value}
- Meslek/Nis: ${profCheck.value}
- Onemli Basarilar: ${achCheck.value}

Platform karakter limitleri:
${platformLimits}

ONEMLI: Her biyografi, o platformun karakter limitini ASMAMALI. Her biyografi benzersiz ve platforma ozel optimize edilmis olmali.

ZORUNLU FORMAT (JSON):
{
  ${formatExample}
}

SADECE JSON dondur.`

    let text = await generateContent(systemPrompt)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let parsed: Record<string, string>
    try {
      parsed = JSON.parse(text)
    } catch {
      const fallback: Record<string, string> = {}
      for (const p of platforms) {
        fallback[p] = text.slice(0, charLimits[p] || 160)
      }
      parsed = fallback
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
    console.error('Bio Generate Error:', error)
    const message = error instanceof Error ? error.message : 'Could not generate bios'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
