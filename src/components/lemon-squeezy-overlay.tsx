'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    LemonSqueezy?: {
      Setup: (config: {
        eventHandler?: (payload: { event: string; data?: unknown }) => void
      }) => void
      Url: { Open: (url: string) => void; Close: () => void }
      Refresh: () => void
    }
  }
}

let setupDone = false

function initLemonSqueezy() {
  if (setupDone || typeof window === 'undefined' || !window.LemonSqueezy) return
  setupDone = true
  window.LemonSqueezy.Setup({
    eventHandler: (payload) => {
      if (payload.event === 'Checkout.Success') {
        // Webhook flips Clerk plan async — give it a beat then full reload.
        setTimeout(() => window.location.reload(), 2500)
      }
    },
  })
}

export function LemonSqueezyOverlay() {
  useEffect(() => {
    initLemonSqueezy()
  }, [])

  return (
    <Script
      src="https://assets.lemonsqueezy.com/lemon.js"
      strategy="afterInteractive"
      onLoad={initLemonSqueezy}
    />
  )
}
