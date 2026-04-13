'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'

type UsageFeature = { used: number; limit: number | null }

type UsageResponse = {
  plan: PlanType
  singlePosts: UsageFeature
  multiPlatform: UsageFeature
  calendar: UsageFeature
}

export default function BillingPage() {
  const { user, isLoaded } = useUser()
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const { open: openUpgrade } = useUpgradeModal()
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [portalUrl, setPortalUrl] = useState<string | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const subscriptionStatus = publicMeta.subscriptionStatus as string | undefined
  const provider = publicMeta.paymentProvider as string | undefined
  const isPaddle = provider === 'paddle'
  const isOldProvider = !isPaddle && (publicMeta.subscriptionId || provider === 'gumroad')
  const isActiveStatus =
    subscriptionStatus === 'active' ||
    subscriptionStatus === 'on_trial' ||
    subscriptionStatus === 'cancelled'
  const plan = (isActiveStatus && isPaddle) ? (publicMeta.plan as PlanType || 'free') : 'free'
  const planLabel = PLAN_LIMITS[plan]?.label || 'Free'
  const hasSubscription = plan !== 'free' && publicMeta.subscriptionId && isPaddle

  useEffect(() => {
    fetch('/api/usage')
      .then((r) => r.json())
      .then((data) => setUsage(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!portalUrl) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPortalUrl(null) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [portalUrl])

  const openBillingPortal = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/portal')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to open billing portal')
        return
      }
      setPortalUrl(data.url)
    } catch {
      setError(isEn ? 'Failed to open portal' : 'Portal acilamadi')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="p-6 md:p-10">
        <div className="h-8 w-48 bg-gray-200 dark:bg-[#27272a] rounded animate-pulse mb-4" />
        <div className="h-32 bg-gray-200 dark:bg-[#27272a] rounded animate-pulse" />
      </div>
    )
  }

  // Infinity is serialized to null in JSON, so treat null/undefined as unlimited.
  const fmt = (n: number | null | undefined) =>
    n === null || n === undefined || n === Infinity ? '∞' : n.toString()

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {isEn ? 'Billing & Subscription' : 'Faturalandirma & Abonelik'}
        </h1>
        <p className="text-gray-500 dark:text-[#a1a1aa]">
          {isEn
            ? 'Manage your plan, payment method, and invoices.'
            : 'Planinizi, odeme yonteminizi ve faturalarinizi yonetin.'}
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-[#a1a1aa] mb-1">
              {isEn ? 'Current Plan' : 'Mevcut Plan'}
            </p>
            <h2 className="text-2xl font-bold">{planLabel}</h2>
            {subscriptionStatus && plan !== 'free' && (
              <p className="text-xs mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                    subscriptionStatus === 'active' || subscriptionStatus === 'on_trial'
                      ? 'bg-green-50 text-green-700'
                      : subscriptionStatus === 'cancelled'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {subscriptionStatus === 'active' && (isEn ? 'Active' : 'Aktif')}
                  {subscriptionStatus === 'on_trial' && (isEn ? 'Trial' : 'Deneme')}
                  {subscriptionStatus === 'cancelled' &&
                    (isEn ? 'Cancelled (active until period end)' : 'Iptal edildi (donem sonuna kadar aktif)')}
                  {subscriptionStatus === 'past_due' && (isEn ? 'Past due' : 'Gecikmis')}
                  {subscriptionStatus === 'expired' && (isEn ? 'Expired' : 'Suresi dolmus')}
                </span>
              </p>
            )}
          </div>

          {isOldProvider ? (
            <button
              type="button"
              onClick={openUpgrade}
              className="px-6 py-3 brand-grad brand-shadow-sm rounded-full text-sm font-semibold"
            >
              {isEn ? 'Switch to new plan' : 'Yeni plana gec'}
            </button>
          ) : plan === 'free' ? (
            <button
              type="button"
              onClick={openUpgrade}
              className="px-6 py-3 brand-grad brand-shadow-sm rounded-full text-sm font-semibold"
            >
              {isEn ? 'Upgrade plan' : 'Plani yukselt'}
            </button>
          ) : (
            <button
              onClick={openBillingPortal}
              disabled={loading || !hasSubscription}
              className="px-6 py-3 brand-grad brand-shadow-sm rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEn
                  ? 'Opening...'
                  : 'Aciliyor...'
                : isEn
                ? 'Manage subscription'
                : 'Aboneligi yonet'}
            </button>
          )}
        </div>

        {isOldProvider && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-semibold mb-1">
              {isEn ? 'Payment system updated' : 'Odeme sistemi guncellendi'}
            </p>
            <p>
              {isEn
                ? 'We\'ve switched to a new payment provider for a better experience. Please subscribe again to continue using premium features. Your previous subscription will not be charged.'
                : 'Daha iyi bir deneyim icin yeni odeme sistemine gectik. Premium ozellikleri kullanmaya devam etmek icin lutfen yeniden abone olun. Eski aboneliginizden ucret alinmayacaktir.'}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Plan limits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-[#27272a]">
          <div>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">{isEn ? 'Single posts' : 'Tekli postlar'}</p>
            <p className="text-lg font-semibold">
              {usage ? `${usage.singlePosts.used} / ${fmt(usage.singlePosts.limit)}` : '-'}
              <span className="text-xs text-gray-400 dark:text-[#71717a] font-normal ml-1">
                {isEn ? '/ month' : '/ ay'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">
              {isEn ? 'Multi-platform' : 'Coklu platform'}
            </p>
            <p className="text-lg font-semibold">
              {usage ? `${usage.multiPlatform.used} / ${fmt(usage.multiPlatform.limit)}` : '-'}
              <span className="text-xs text-gray-400 dark:text-[#71717a] font-normal ml-1">
                {isEn ? '/ month' : '/ ay'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa] mb-1">{isEn ? 'Calendar' : 'Takvim'}</p>
            <p className="text-lg font-semibold">
              {usage ? `${usage.calendar.used} / ${fmt(usage.calendar.limit)}` : '-'}
              <span className="text-xs text-gray-400 dark:text-[#71717a] font-normal ml-1">
                {isEn ? '/ month' : '/ ay'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Info card */}
      {plan !== 'free' && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-2 text-blue-900">
            {isEn ? 'What you can do in the portal' : 'Portalda neler yapabilirsiniz'}
          </h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li>• {isEn ? 'Update your payment method' : 'Odeme yonteminizi guncelleyin'}</li>
            <li>• {isEn ? 'Download invoices' : 'Faturalari indirin'}</li>
            <li>• {isEn ? 'Change your plan' : 'Planinizi degistirin'}</li>
            <li>• {isEn ? 'Cancel your subscription' : 'Aboneliginizi iptal edin'}</li>
          </ul>
        </div>
      )}

      {/* Refund info */}
      <div className="bg-gray-50 dark:bg-[#1a1a22] rounded-2xl p-6">
        <h3 className="font-semibold mb-2">
          {isEn ? 'Need help?' : 'Yardima mi ihtiyaciniz var?'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-[#a1a1aa] mb-3">
          {isEn
            ? 'We offer a 14-day money-back guarantee. Contact us if you have any billing questions.'
            : '14 gun para iade garantisi sunuyoruz. Faturalandirma sorulariniz icin bize ulasin.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/refund"
            className="text-sm px-4 py-2 bg-white dark:bg-[#13131a] border border-gray-200 dark:border-[#27272a] rounded-full hover:bg-gray-50 transition-colors"
          >
            {isEn ? 'Refund policy' : 'Iade politikasi'}
          </a>
          <a
            href="/contact"
            className="text-sm px-4 py-2 bg-white dark:bg-[#13131a] border border-gray-200 dark:border-[#27272a] rounded-full hover:bg-gray-50 transition-colors"
          >
            {isEn ? 'Contact support' : 'Destege ulas'}
          </a>
        </div>
      </div>

      {portalUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fade-in_0.2s_ease-out]"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPortalUrl(null)} />
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[fade-in-up_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0a0a0f]">
              <span className="text-sm font-semibold text-white/80">
                {isEn ? 'Manage subscription' : 'Aboneligi yonet'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1"
                  title={isEn ? 'Open in new tab' : 'Yeni sekmede ac'}
                >
                  ↗
                </a>
                <button
                  onClick={() => setPortalUrl(null)}
                  aria-label={isEn ? 'Close' : 'Kapat'}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <iframe
              src={portalUrl}
              title={isEn ? 'Manage subscription' : 'Aboneligi yonet'}
              className="w-full h-[calc(85vh-49px)] bg-white"
            />
          </div>
        </div>
      )}
    </div>
  )
}
