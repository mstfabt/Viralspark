'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useLanguage } from '@/components/language-provider'

const STARTER_URL = process.env.NEXT_PUBLIC_LS_STARTER_URL || '#'
const PRO_URL = process.env.NEXT_PUBLIC_LS_PRO_URL || '#'
const PADDLE_STARTER_PRICE = process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || ''
const PADDLE_PRO_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || ''
const USE_PADDLE = !!PADDLE_STARTER_PRICE

function withCheckoutParams(baseUrl: string, userId: string | undefined) {
  if (!userId || baseUrl === '#') return baseUrl
  return `${baseUrl}?embed=1&checkout[custom][user_id]=${userId}`
}

function openPaddleCheckout(priceId: string, userId: string | undefined) {
  if (!window.Paddle || !priceId) return
  window.Paddle.Checkout.open({
    settings: { displayMode: 'overlay', theme: 'dark' },
    customData: userId ? { user_id: userId } : {},
    items: [{ priceId, quantity: 1 }],
  })
}

type Ctx = { open: () => void; close: () => void }
const UpgradeModalContext = createContext<Ctx | null>(null)

export function useUpgradeModal() {
  const ctx = useContext(UpgradeModalContext)
  if (!ctx) throw new Error('useUpgradeModal must be used inside <UpgradeModalProvider>')
  return ctx
}

export function UpgradeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const { locale } = useLanguage()
  const isEn = locale === 'en'

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Re-scan DOM so lemon.js binds click handlers to freshly mounted modal buttons.
  useEffect(() => {
    if (!isOpen || !user?.id) return
    const t = setTimeout(() => {
      window.LemonSqueezy?.Refresh?.()
    }, 80)
    return () => clearTimeout(t)
  }, [isOpen, user?.id])

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, close])

  const starterFeatures = isEn
    ? ['50 single platform / month', '20 multi-platform / month', '2 content calendars / month', '1 brand profile', 'Hook library', 'Hashtag research']
    : ['Aylık 50 tek platform üretim', 'Aylık 20 çoklu platform üretim', 'Aylık 2 içerik takvimi', '1 marka profili', 'Hook kütüphanesi', 'Hashtag araştırma']

  const proFeatures = isEn
    ? ['All 14 AI tools', 'Unlimited generation', 'A/B variations', '30-day content calendar', '3 brand profiles', 'Competitor analysis', 'CSV export']
    : ['14 AI aracın tamamı', 'Sınırsız üretim', 'A/B varyasyonlar', '30 günlük içerik takvimi', '3 marka profili', 'Rakip analizi', 'CSV dışa aktarma']

  return (
    <UpgradeModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fade-in_0.2s_ease-out]"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0f] text-[#f5f5f7] border border-white/10 rounded-3xl shadow-2xl animate-[fade-in-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <button
              onClick={close}
              aria-label={isEn ? 'Close' : 'Kapat'}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                  {isEn ? 'Upgrade your plan' : 'Planını yükselt'}
                </h2>
                <p className="text-sm md:text-base text-white/50 font-light">
                  {isEn ? 'Pick the plan that matches your output.' : 'Üretim hızına uygun planı seç.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Starter */}
                <div className="relative bg-white/[0.04] rounded-3xl p-8 flex flex-col overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(#0a0a0f,#0a0a0f) padding-box, linear-gradient(135deg,#ff006e,#8338ec,#3a86ff) border-box',
                      border: '2px solid transparent',
                    }}
                  />
                  <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#ff006e] to-[#3a86ff] rounded-bl-xl">
                    {isEn ? 'Most Popular' : 'En Popüler'}
                  </div>
                  <div className="relative">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-pink-400 mb-3">Starter</div>
                    <div className="text-4xl font-black mb-1">
                      {isEn ? '$3' : '₺30'}
                      <span className="text-sm text-white/40 font-medium">{isEn ? '/mo' : '/ay'}</span>
                    </div>
                    <p className="text-xs text-white/60 font-light mb-6">
                      {isEn ? 'For small businesses.' : 'Küçük işletmeler için.'}
                    </p>
                    <ul className="space-y-2.5 mb-8 text-sm text-white/80 font-light">
                      {starterFeatures.map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {USE_PADDLE ? (
                      <button
                        type="button"
                        onClick={() => openPaddleCheckout(PADDLE_STARTER_PRICE, user?.id)}
                        className="w-full block text-center py-3.5 rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.3)]"
                      >
                        {isEn ? 'Choose Starter' : 'Starter Seç'}
                      </button>
                    ) : (
                      <a
                        href={withCheckoutParams(STARTER_URL, user?.id)}
                        className="lemonsqueezy-button block text-center py-3.5 rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.3)]"
                      >
                        {isEn ? 'Choose Starter' : 'Starter Seç'}
                      </a>
                    )}
                  </div>
                </div>

                {/* Pro */}
                <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 flex flex-col">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">Pro</div>
                  <div className="text-4xl font-black mb-1">
                    {isEn ? '$10' : '₺100'}
                    <span className="text-sm text-white/40 font-medium">{isEn ? '/mo' : '/ay'}</span>
                  </div>
                  <p className="text-xs text-white/50 font-light mb-6">
                    {isEn ? 'For professional creators.' : 'Profesyonel üreticiler için.'}
                  </p>
                  <ul className="space-y-2.5 mb-8 text-sm text-white/70 font-light">
                    {proFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {USE_PADDLE ? (
                    <button
                      type="button"
                      onClick={() => openPaddleCheckout(PADDLE_PRO_PRICE, user?.id)}
                      className="w-full block text-center py-3.5 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors"
                    >
                      {isEn ? 'Choose Pro' : 'Pro Seç'}
                    </button>
                  ) : (
                    <a
                      href={withCheckoutParams(PRO_URL, user?.id)}
                      className="lemonsqueezy-button block text-center py-3.5 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors"
                    >
                      {isEn ? 'Choose Pro' : 'Pro Seç'}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[11px] text-white/40 font-medium">
                <span>{isEn ? '✓ 14-day money-back' : '✓ 14 gün para iade'}</span>
                <span>{isEn ? '✓ Cancel anytime' : '✓ İstediğin zaman iptal'}</span>
                <span>{USE_PADDLE
                  ? (isEn ? '✓ Secure via Paddle' : '✓ Paddle ile güvenli')
                  : (isEn ? '✓ Secure via Lemon Squeezy' : '✓ Lemon Squeezy ile güvenli')
                }</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </UpgradeModalContext.Provider>
  )
}
