'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect, useMemo } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { getHistory, type HistoryItem } from '@/lib/history'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

const TIPS_EN = [
  'Use a strong hook in the first sentence to grab attention instantly.',
  'Post consistently at peak hours for your audience to maximize reach.',
  'Add 3-5 relevant hashtags — not too many, not too few.',
  'Use the A/B variation feature to test different angles on the same topic.',
  'Set up your Brand Profile so every generated post matches your voice.',
]

const TIPS_TR = [
  'Dikkat cekmek icin ilk cumlede guclu bir hook kullanin.',
  'Erisimi artirmak icin hedef kitlenizin aktif oldugu saatlerde paylasim yapin.',
  'Cok fazla degil, cok az degil — 3-5 ilgili hashtag ekleyin.',
  'Ayni konuda farkli acilari test etmek icin A/B varyasyon ozelligini kullanin.',
  'Uretilen her icerigin sesinize uygun olmasi icin Marka Profilinizi ayarlayin.',
]

const QUICK_ACTIONS = [
  { href: '/dashboard', labelKey: 'home.action.generate', descKey: 'home.action.generate.desc', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/dashboard/hashtags', labelKey: 'home.action.hashtags', descKey: 'home.action.hashtags.desc', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { href: '/dashboard/hooks', labelKey: 'home.action.hooks', descKey: 'home.action.hooks.desc', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/dashboard/brand', labelKey: 'home.action.brand', descKey: 'home.action.brand.desc', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function HomePage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const { open: openUpgrade } = useUpgradeModal()
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number; plan: string } | null>(null)
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([])
  const [tipIndex, setTipIndex] = useState(0)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const planLabel = PLAN_LIMITS[plan]?.label || 'Free'

  useEffect(() => {
    fetch('/api/usage')
      .then((res) => res.json())
      .then((data) => {
        if (data.used !== undefined) setUsageInfo(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setRecentHistory(getHistory().slice(0, 3))
    setTipIndex(Math.floor(Math.random() * 5))
  }, [])

  const tips = locale === 'en' ? TIPS_EN : TIPS_TR
  const currentTip = tips[tipIndex]

  const usagePct = usageInfo && usageInfo.limit !== Infinity && usageInfo.limit > 0
    ? Math.min((usageInfo.used / usageInfo.limit) * 100, 100)
    : null

  const usageColor = usagePct !== null
    ? usagePct >= 100 ? 'text-red-500' : usagePct >= 70 ? 'text-amber-500' : 'text-green-500'
    : 'text-green-500'

  const usageBgColor = usagePct !== null
    ? usagePct >= 100 ? 'stroke-red-500' : usagePct >= 70 ? 'stroke-amber-500' : 'stroke-green-500'
    : 'stroke-green-500'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 md:p-8 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('home.welcome')}{user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-500 dark:text-[#a1a1aa] mt-1 text-sm">{t('home.welcome.desc')}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 brand-grad brand-shadow-sm text-xs font-semibold rounded-full">
            {planLabel} {t('dash.plan')}
          </span>
        </div>
      </div>

      {/* Usage Stats + Tip — side by side on desktop */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Usage Stats */}
        <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wide mb-4">{t('home.usage.title')}</h2>
          {usageInfo ? (
            <div className="flex items-center gap-6">
              {/* Circular progress */}
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  {usagePct !== null && (
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      className={usageBgColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(usagePct / 100) * 263.9} 263.9`}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${usageColor}`}>
                    {usageInfo.limit === Infinity ? '∞' : `${Math.round(usagePct || 0)}%`}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {usageInfo.used}<span className="text-gray-400 dark:text-[#71717a] text-lg font-normal">/{usageInfo.limit === Infinity ? '∞' : usageInfo.limit}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-[#a1a1aa]">{t('home.usage.generations')}</p>
                {usagePct !== null && usagePct >= 70 && (
                  <button type="button" onClick={openUpgrade} className="inline-block mt-2 text-xs font-semibold brand-grad brand-shadow-sm px-3 py-1.5 rounded-full">
                    {t('common.upgrade')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[#1f1f26] animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-20 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Tip Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-1">{t('home.tip.title')}</h3>
              <p className="text-sm text-amber-700 leading-relaxed">{currentTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wide mb-3">{t('home.quickactions')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {QUICK_ACTIONS.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#1f1f26] rounded-xl flex items-center justify-center mb-3 group-hover:brand-grad group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
              </svg>
            </div>
            <h3 className="text-sm font-semibold mb-0.5">{t(action.labelKey)}</h3>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{t(action.descKey)}</p>
          </a>
        ))}
      </div>

      {/* Recent Generations */}
      <h2 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wide mb-3">{t('home.recent')}</h2>
      {recentHistory.length > 0 ? (
        <div className="space-y-3 mb-6">
          {recentHistory.map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-[#e5e5e5] truncate">{item.prompt}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.platforms.map((p) => (
                    <span key={p} className="text-xs bg-gray-100 dark:bg-[#1f1f26] text-gray-600 dark:text-[#a1a1aa] px-2 py-0.5 rounded-full">
                      {PLATFORM_LABELS[p] || p}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 dark:text-[#71717a]">
                    {new Date(item.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
              <a href="/dashboard/history" className="text-gray-400 dark:text-[#71717a] hover:text-black dark:hover:text-white transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
          <a href="/dashboard/history" className="block text-center text-sm text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors py-2">
            {t('home.recent.viewall')} →
          </a>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-8 text-center shadow-sm mb-6">
          <p className="text-gray-500 dark:text-[#a1a1aa] text-sm mb-3">{t('home.recent.empty')}</p>
          <a href="/dashboard" className="inline-block brand-grad brand-shadow-sm px-5 py-2.5 rounded-full text-sm font-semibold">
            {t('home.action.generate')}
          </a>
        </div>
      )}
    </div>
  )
}
