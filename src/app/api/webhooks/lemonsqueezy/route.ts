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

  if (signature.length !== digest.length ||
      !crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(signature, 'utf8'))) {
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
      const status = payload.data?.attributes?.status
      const variantId = payload.data?.attributes?.variant_id
      const subscriptionId = payload.data?.id

      const plan = getPlanFromVariant(variantId)
      if (!plan) {
        // Unknown variant — refuse to silently downgrade a Pro buyer to Starter.
        // Returns 500 so LS retries; meanwhile the variant ID env vars must be fixed.
        console.error('Unknown LS variant_id, refusing to update plan:', variantId)
        return NextResponse.json('Unknown variant_id', { status: 500 })
      }

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan,
          subscriptionStatus: status,
          subscriptionId,
          lsCustomerId: payload.data?.attributes?.customer_id,
        },
      })
      break
    }

    case 'subscription_cancelled': {
      // Don't downgrade yet - user keeps access until period ends
      // Just mark as cancelled, subscription_expired will do the actual downgrade
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'cancelled',
        },
      })
      break
    }

    case 'subscription_resumed': {
      // User cancelled then changed their mind before period end.
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'active',
        },
      })
      break
    }

    case 'subscription_expired': {
      // Period ended, now actually downgrade to free
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: 'free',
          subscriptionStatus: 'expired',
        },
      })
      break
    }

    case 'subscription_payment_failed': {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'past_due',
        },
      })
      break
    }

    case 'subscription_payment_success': {
      // LS automatically retries failed payments. When one succeeds, lift past_due.
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'active',
        },
      })
      break
    }
  }

  return NextResponse.json('OK', { status: 200 })
}

// Variant IDs differ between test mode and live mode — keep them in env so the
// switch to live only requires updating Vercel, never editing code.
function getPlanFromVariant(variantId: number): 'starter' | 'pro' | null {
  const starterId = Number(process.env.LS_STARTER_VARIANT_ID)
  const proId = Number(process.env.LS_PRO_VARIANT_ID)
  if (variantId === starterId) return 'starter'
  if (variantId === proId) return 'pro'
  return null
}
