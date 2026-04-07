import { NextResponse } from 'next/server'

// Simple lead collection - stores in memory for now
// In production, connect to email service (Resend, Mailchimp, etc.)
const leads: { email: string; createdAt: string }[] = []

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Gecerli e-posta gerekli' }, { status: 400 })
    }

    leads.push({ email, createdAt: new Date().toISOString() })
    console.log(`New lead: ${email} (total: ${leads.length})`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Bir hata olustu' }, { status: 500 })
  }
}

export async function GET() {
  // Protected endpoint to view leads (add auth in production)
  return NextResponse.json({ count: leads.length, leads })
}
