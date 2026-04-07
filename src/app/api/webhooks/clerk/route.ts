import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const eventType = evt.type

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name } = evt.data
      const email = email_addresses?.[0]?.email_address
      const firstName = first_name || 'there'

      console.log(`New user: ${email} (${id}, ${firstName})`)

      // TODO: Connect email service (Resend, Nodemailer) for welcome email
      // await sendWelcomeEmail(email, firstName)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
