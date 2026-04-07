import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json('Webhook secret not set', { status: 500 })
  }

  // Verify signature
  const rawBody = await request.text()
  const signature = request.headers.get('X-Signature') || ''

  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(rawBody).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(signature, 'utf8'))) {
    return NextResponse.json('Invalid signature', { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta?.event_name
  const customData = payload.meta?.custom_data
  const userId = customData?.user_id

  if (!userId) {
    return NextResponse.json('No user_id in custom_data', { status: 400 })
  }

  const client = await clerkClient()

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      const status = payload.data?.attributes?.status // active, past_due, cancelled, expired
      const variantId = payload.data?.attributes?.variant_id
      const subscriptionId = payload.data?.id

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: getPlanFromVariant(variantId),
          subscriptionStatus: status,
          subscriptionId,
          lsCustomerId: payload.data?.attributes?.customer_id,
        },
      })
      break
    }

    case 'subscription_expired':
    case 'subscription_cancelled': {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: 'free',
          subscriptionStatus: 'cancelled',
        },
      })
      break
    }
  }

  return NextResponse.json('OK', { status: 200 })
}

function getPlanFromVariant(variantId: number): string {
  const variantMap: Record<number, string> = {
    1498792: 'starter',
    1498787: 'pro',
  }
  return variantMap[variantId] || 'starter'
}
