import { NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/email'
import { validateString, isValidEmail, rateLimitByIP, sanitize } from '@/lib/validate'

export async function POST(request: Request) {
  try {
    // Rate limit by IP: max 3 per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimitByIP(ip, 3, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
    }

    const { name: rawName, email, message: rawMessage } = await request.json()

    // Validate name
    const nameCheck = validateString(rawName, 100)
    if (!nameCheck.valid) {
      return NextResponse.json({ error: 'Name is required (max 100 characters).' }, { status: 400 })
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    }

    // Validate message
    const messageCheck = validateString(rawMessage, 2000)
    if (!messageCheck.valid) {
      return NextResponse.json({ error: 'Message is required (max 2000 characters).' }, { status: 400 })
    }

    await sendContactNotification(nameCheck.value, email.trim(), messageCheck.value)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
