import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Gumroad webhook — "ping" events on sale, subscription, cancellation, etc.
 * Gumroad sends POST with form-encoded body.
 * Docs: https://app.gumroad.com/ping
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract fields from Gumroad ping
    const sellerEmail = formData.get('seller_id') as string | null
    const productId = formData.get('product_id') as string | null
    const productPermalink = formData.get('product_permalink') as string | null
    const saleId = formData.get('sale_id') as string | null
    const email = formData.get('email') as string | null
    const subscriptionId = formData.get('subscription_id') as string | null
    const resourceName = formData.get('resource_name') as string | null
    const isRecurringCharge = formData.get('is_recurring_charge') === 'true'
    const cancelled = formData.get('cancelled') === 'true'
    const ended = formData.get('ended_at') as string | null
    const restartedAt = formData.get('restarted_at') as string | null

    // Custom field: user_id (passed via checkout URL)
    const customFields = formData.get('custom_fields') as string | null
    let userId: string | null = null

    if (customFields) {
      try {
        const parsed = JSON.parse(customFields)
        userId = parsed.user_id || null
      } catch {
        // Try URL-encoded format
      }
    }

    // Also check url_params for user_id
    if (!userId) {
      const urlParams = formData.get('url_params') as string | null
      if (urlParams) {
        try {
          const parsed = JSON.parse(urlParams)
          userId = parsed.user_id || null
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      console.error('Gumroad webhook: no user_id found', { email, productId })
      return NextResponse.json({ error: 'No user_id' }, { status: 400 })
    }

    const plan = getPlanFromProduct(productId, productPermalink)
    const client = await clerkClient()

    // Determine event type
    if (resourceName === 'cancellation' || cancelled) {
      // Subscription cancelled — keep access until period ends
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'cancelled',
        },
      })
      console.log(`Gumroad: subscription cancelled for user ${userId}`)
    } else if (ended && !restartedAt) {
      // Subscription ended — downgrade to free
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: 'free',
          subscriptionStatus: 'expired',
        },
      })
      console.log(`Gumroad: subscription expired for user ${userId}`)
    } else if (resourceName === 'sale' || resourceName === 'subscription_updated') {
      // New sale or recurring charge — activate plan
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan,
          subscriptionStatus: 'active',
          subscriptionId: subscriptionId || saleId,
          gumroadEmail: email,
          paymentProvider: 'gumroad',
        },
      })
      console.log(`Gumroad: plan ${plan} activated for user ${userId}`)
    } else if (resourceName === 'refund' || resourceName === 'dispute') {
      // Refund or dispute — downgrade
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: 'free',
          subscriptionStatus: 'refunded',
        },
      })
      console.log(`Gumroad: refund/dispute for user ${userId}`)
    } else {
      // Default: treat as new purchase
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan,
          subscriptionStatus: 'active',
          subscriptionId: subscriptionId || saleId,
          gumroadEmail: email,
          paymentProvider: 'gumroad',
        },
      })
      console.log(`Gumroad: default activation plan ${plan} for user ${userId}`, { resourceName })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gumroad webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

function getPlanFromProduct(productId: string | null, permalink: string | null): string {
  const starterProductId = process.env.GUMROAD_STARTER_PRODUCT_ID
  const proProductId = process.env.GUMROAD_PRO_PRODUCT_ID
  const starterPermalink = process.env.GUMROAD_STARTER_PERMALINK
  const proPermalink = process.env.GUMROAD_PRO_PERMALINK

  if (productId === proProductId || permalink === proPermalink) return 'pro'
  if (productId === starterProductId || permalink === starterPermalink) return 'starter'

  // Fallback: check permalink contains keywords
  if (permalink) {
    if (permalink.toLowerCase().includes('pro')) return 'pro'
    if (permalink.toLowerCase().includes('starter')) return 'starter'
  }

  return 'starter'
}
