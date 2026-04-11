import { NextResponse } from 'next/server'
import { isValidEmail, rateLimitByIP } from '@/lib/validate'

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS || ''
const BREVO_LIST_ID = 2

export async function POST(req: Request) {
  try {
    // Rate limit by IP: max 3 per minute
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimitByIP(ip, 3, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
    }

    const { email } = await req.json()

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Gecerli e-posta gerekli' }, { status: 400 })
    }

    // Add contact to Brevo email list
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.trim(),
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    })

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text()
      console.error('Brevo API error:', brevoRes.status, errBody)
      // Brevo returns 204 for duplicate with updateEnabled, but 400 for bad email etc.
      if (brevoRes.status !== 204) {
        return NextResponse.json({ error: 'E-posta kaydedilemedi' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Bir hata olustu' }, { status: 500 })
  }
}
