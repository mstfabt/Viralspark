import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Returns the Lemon Squeezy customer portal URL for the current user.
 * The customer can manage their subscription, update card, download invoices, and cancel.
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const subscriptionId = user.publicMetadata?.subscriptionId as string | undefined
    const provider = user.publicMetadata?.paymentProvider as string | undefined

    if (!subscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    // Gumroad: subscribers manage through Gumroad library, no portal API
    if (provider === 'gumroad') {
      return NextResponse.json({
        url: 'https://gumroad.com/library',
        provider: 'gumroad',
      })
    }

    // Lemon Squeezy: fetch subscription, get customer portal URL
    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
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
