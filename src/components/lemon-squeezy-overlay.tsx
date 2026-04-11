'use client'

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

// Polls until lemon.js (loaded via <script defer> in layout head) attaches
// itself to window, then registers a Checkout.Success listener that reloads
// the page so Clerk picks up the new plan from the LS webhook.
export function LemonSqueezyOverlay() {
  useEffect(() => {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (window.LemonSqueezy) {
        clearInterval(interval)
        window.LemonSqueezy.Setup({
          eventHandler: (payload) => {
            if (payload.event === 'Checkout.Success') {
              setTimeout(() => window.location.reload(), 2500)
            }
          },
        })
      } else if (attempts > 50) {
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return null
}
