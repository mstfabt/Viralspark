'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: {
        token: string
        eventCallback?: (event: { name: string; data?: Record<string, unknown> }) => void
      }) => void
      Checkout: {
        open: (config: {
          settings?: { displayMode?: string; theme?: string; locale?: string }
          customData?: Record<string, unknown>
          items: { priceId: string; quantity: number }[]
        }) => void
      }
    }
  }
}

const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || ''
const IS_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox'

export function PaddleLoader() {
  useEffect(() => {
    if (!CLIENT_TOKEN) return
    if (document.getElementById('paddle-js')) return

    const script = document.createElement('script')
    script.id = 'paddle-js'
    script.src = IS_SANDBOX
      ? 'https://sandbox-cdn.paddle.com/paddle/v2/paddle.js'
      : 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      window.Paddle?.Initialize({
        token: CLIENT_TOKEN,
        eventCallback: (event) => {
          if (event.name === 'checkout.completed') {
            setTimeout(() => window.location.reload(), 2500)
          }
        },
      })
    }
    document.head.appendChild(script)
  }, [])

  return null
}
