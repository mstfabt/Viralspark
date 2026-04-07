import { NextResponse } from 'next/server'

// Clerk webhook for user events (welcome email, etc.)
// Set up webhook in Clerk Dashboard -> Webhooks -> user.created event
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address
      const firstName = data.first_name || 'there'

      if (email) {
        console.log(`Welcome email should be sent to: ${email} (${firstName})`)
        // TODO: Connect email service (Resend, Nodemailer, etc.)
        // await sendWelcomeEmail(email, firstName)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
