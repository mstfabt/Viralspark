import { NextRequest, NextResponse } from 'next/server'
import { Paddle, EventName } from '@paddle/paddle-node-sdk'
import { clerkClient } from '@clerk/nextjs/server'

function getPaddleClient() {
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) throw new Error('PADDLE_API_KEY not set')
  return new Paddle(apiKey)
}

function getPlanFromPrice(priceId: string): 'starter' | 'pro' | null {
  const starterId = process.env.PADDLE_STARTER_PRICE_ID
  const proId = process.env.PADDLE_PRO_PRICE_ID
  if (priceId === starterId) return 'starter'
  if (priceId === proId) return 'pro'
  return null
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json('Webhook secret not set', { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('paddle-signature') || ''

  if (!signature || !rawBody) {
    return NextResponse.json('Missing signature or body', { status: 400 })
  }

  let eventData: { eventType: string; data: Record<string, unknown> }

  try {
    const paddle = getPaddleClient()
    eventData = (await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature,
    )) as unknown as { eventType: string; data: Record<string, unknown> }
  } catch (err) {
    console.error('Paddle webhook signature verification failed:', err)
    return NextResponse.json('Invalid signature', { status: 401 })
  }

  const data = eventData.data as Record<string, unknown>
  const customData = data.customData as Record<string, string> | undefined
  const userId = customData?.user_id

  if (!userId) {
    console.warn('Paddle webhook: no user_id in customData', eventData.eventType)
    return NextResponse.json('OK', { status: 200 })
  }

  const client = await clerkClient()

  switch (eventData.eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated: {
      const status = data.status as string
      const subscriptionId = data.id as string
      const customerId = data.customerId as string
      const items = data.items as { price?: { id?: string } }[] | undefined
      const priceId = items?.[0]?.price?.id || ''

      const plan = getPlanFromPrice(priceId)
      if (!plan) {
        console.error('Unknown Paddle priceId, refusing to update plan:', priceId)
        return NextResponse.json('Unknown priceId', { status: 500 })
      }

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan,
          subscriptionStatus: status,
          subscriptionId,
          paddleCustomerId: customerId,
          paymentProvider: 'paddle',
        },
      })
      break
    }

    case EventName.SubscriptionCanceled: {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'cancelled',
        },
      })
      break
    }

    case EventName.SubscriptionResumed: {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'active',
        },
      })
      break
    }

    case EventName.SubscriptionPaused: {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'paused',
        },
      })
      break
    }

    case EventName.TransactionPaymentFailed: {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscriptionStatus: 'past_due',
        },
      })
      break
    }

    case EventName.TransactionCompleted: {
      const subStatus = data.subscriptionId ? 'active' : undefined
      if (subStatus) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            subscriptionStatus: 'active',
          },
        })
      }
      break
    }
  }

  return NextResponse.json('OK', { status: 200 })
}
