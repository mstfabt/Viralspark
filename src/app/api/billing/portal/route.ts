import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Paddle } from '@paddle/paddle-node-sdk'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const subscriptionId = user.publicMetadata?.subscriptionId as string | undefined
    const provider = user.publicMetadata?.paymentProvider as string | undefined

    if (!subscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    if (provider === 'gumroad') {
      return NextResponse.json({
        url: 'https://gumroad.com/library',
        provider: 'gumroad',
      })
    }

    if (provider === 'paddle') {
      const paddleKey = process.env.PADDLE_API_KEY
      if (!paddleKey) {
        return NextResponse.json({ error: 'Paddle billing not configured' }, { status: 500 })
      }

      const paddleCustomerId = user.publicMetadata?.paddleCustomerId as string | undefined
      if (!paddleCustomerId) {
        return NextResponse.json({ error: 'No Paddle customer ID found' }, { status: 500 })
      }

      const paddle = new Paddle(paddleKey)
      const session = await paddle.customerPortalSessions.create(paddleCustomerId, [subscriptionId])
      const portalUrl = (session as unknown as { urls?: { general?: { overview?: string } } })?.urls?.general?.overview

      if (!portalUrl) {
        return NextResponse.json({ error: 'Could not create portal session' }, { status: 500 })
      }

      return NextResponse.json({ url: portalUrl, provider: 'paddle' })
    }

    // Default: Lemon Squeezy
    const lsKey = process.env.LEMONSQUEEZY_API_KEY
    if (!lsKey) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
    }

    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lsKey}`,
      },
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('LS subscription fetch error:', res.status, errText)
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
    }

    const data = await res.json()
    const portalUrl = data?.data?.attributes?.urls?.customer_portal

    if (!portalUrl) {
      return NextResponse.json({ error: 'Portal URL not available' }, { status: 500 })
    }

    return NextResponse.json({ url: portalUrl, provider: 'lemonsqueezy' })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
