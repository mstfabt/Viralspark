'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useMemo } from 'react'
import { HOOKS_TR, HOOKS_EN, HOOK_CATEGORIES_TR, HOOK_CATEGORIES_EN, type Hook } from '@/lib/hooks-data'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'

const PLATFORM_FILTERS = [
  { id: 'all', labelKey: 'hooks.all' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

const ENGAGEMENT_COLORS = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 dark:bg-[#1f1f26] text-gray-500 dark:text-[#a1a1aa]',
}

export default function HooksPage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const { open: openUpgrade } = useUpgradeModal()

  const hooks = locale === 'en' ? HOOKS_EN : HOOKS_TR
  const categories = locale === 'en' ? HOOK_CATEGORIES_EN : HOOK_CATEGORIES_TR
  const allLabel = locale === 'en' ? 'All' : 'Tümü'

  const [category, setCategory] = useState(allLabel)
  const [platform, setPlatform] = useState('all')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const filtered = useMemo(() => {
    return hooks.filter((h) => {
      if (category !== allLabel && h.category !== category) return false
      if (platform !== 'all' && h.platform !== platform) return false
      return true
    })
  }, [category, platform, hooks, allLabel])

  const handleCopy = (hook: Hook) => {
    navigator.clipboard.writeText(hook.text)
    setCopiedId(hook.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const engagementLabel = (e: string) => {
    if (e === 'high') return t('hooks.high')
    if (e === 'medium') return t('hooks.medium')
    return t('hooks.low')
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t('hooks.title')}</h1>
        <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">{t('common.locked')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('common.locked.desc')}</p>
          <button type="button" onClick={openUpgrade} className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold">
            {t('common.upgrade')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('hooks.title')}</h1>
        <p className="text-gray-500 dark:text-[#a1a1aa] mt-1">{t('hooks.desc')}</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              category === cat
                ? 'brand-grad brand-shadow-sm border-transparent'
                : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PLATFORM_FILTERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              platform === p.id
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
            }`}
          >
            {p.labelKey ? t(p.labelKey) : p.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-400 dark:text-[#71717a] mb-4">{filtered.length} {t('hooks.found')}</p>

      {/* Hook Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((hook) => (
          <div
            key={hook.id}
            className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <p className="text-gray-800 dark:text-[#e5e5e5] text-base leading-relaxed mb-4">&ldquo;{hook.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-[#71717a] bg-gray-50 dark:bg-[#1a1a22] px-2 py-1 rounded-full border border-gray-100 dark:border-[#27272a]">
                  {hook.category}
                </span>
                <span className="text-xs text-gray-400 dark:text-[#71717a] bg-gray-50 dark:bg-[#1a1a22] px-2 py-1 rounded-full border border-gray-100 dark:border-[#27272a]">
                  {hook.platform}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ENGAGEMENT_COLORS[hook.engagement]}`}>
                  {engagementLabel(hook.engagement)}
                </span>
              </div>
              <button
                onClick={() => handleCopy(hook)}
                className="text-xs brand-grad brand-shadow-sm px-3 py-1.5 rounded-full font-semibold opacity-0 group-hover:opacity-100"
              >
                {copiedId === hook.id ? t('common.copied') : t('common.copy')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
