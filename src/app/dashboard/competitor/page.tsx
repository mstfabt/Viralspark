'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'
import { useGenerationCache } from '@/lib/generation-cache'

type CompetitorResult = {
  topStrategies: { strategy: string; description: string; effectiveness: string }[]
  contentTypes: { type: string; frequency: string; engagement: string }[]
  bestTimes: string[]
  gaps: string[]
  hooks: string[]
  recommendations: string
}

const PLATFORMS = [
  { id: 'genel', labelKey: 'common.general' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

export default function CompetitorPage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const { open: openUpgrade } = useUpgradeModal()
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('genel')
  const [competitors, setCompetitors] = useState('')
  const [result, setResult] = useState<CompetitorResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { cachedResult, saveResult } = useGenerationCache<CompetitorResult>('competitor')

  useEffect(() => {
    if (cachedResult) setResult(cachedResult)
  }, [cachedResult])

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const handleAnalyze = async () => {
    if (!niche) return
    setIsLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform, competitors, lang: locale }),
      })
      const data = await res.json()
      if (data.limitReached) {
        setError(data.error)
      } else if (data.result) {
        setResult(data.result)
        saveResult(data.result, niche)
      } else {
        setError(data.error || t('common.error'))
      }
    } catch {
      setError(t('common.error'))
    }
    setIsLoading(false)
  }

  const effectivenessColor = (e: string) => {
    if (e === 'high') return 'bg-green-100 text-green-700'
    if (e === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 dark:bg-[#1f1f26] text-gray-500 dark:text-[#a1a1aa]'
  }

  const effectivenessLabel = (e: string) => {
    if (e === 'high') return t('hooks.high')
    if (e === 'medium') return t('hooks.medium')
    return t('hooks.low')
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t('competitor.title')}</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">{t('competitor.title')}</h1>
        <p className="text-gray-500 dark:text-[#a1a1aa] mt-1">{t('competitor.desc')}</p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-[#13131a] p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a] mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                platform === p.id
                  ? 'brand-grad brand-shadow-sm border-transparent'
                  : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
              }`}
            >
              {p.labelKey ? t(p.labelKey) : p.label}
            </button>
          ))}
        </div>
        <input
          className="w-full p-5 text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b] mb-3"
          placeholder={t('competitor.niche.placeholder')}
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
        <input
          className="w-full p-4 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          placeholder={t('competitor.competitors.placeholder')}
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !niche}
          className="w-full mt-4 brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('competitor.loading') : t('competitor.button')}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {result.topStrategies && result.topStrategies.length > 0 && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
              <h3 className="font-semibold mb-4">{t('competitor.strategies')}</h3>
              <div className="space-y-3">
                {result.topStrategies.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#1a1a22] rounded-xl">
                    <span className="text-lg font-bold text-gray-300 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{s.strategy}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${effectivenessColor(s.effectiveness)}`}>
                          {effectivenessLabel(s.effectiveness)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.contentTypes && result.contentTypes.length > 0 && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
              <h3 className="font-semibold mb-4">{t('competitor.content')}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {result.contentTypes.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-[#1a1a22] rounded-xl">
                    <p className="font-medium text-sm">{c.type}</p>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1aa] mt-1">{c.frequency} | {c.engagement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {result.bestTimes && result.bestTimes.length > 0 && (
              <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
                <h3 className="font-semibold mb-3">{t('competitor.times')}</h3>
                <div className="space-y-2">
                  {result.bestTimes.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-[#a1a1aa]">• {item}</p>
                  ))}
                </div>
              </div>
            )}

            {result.gaps && result.gaps.length > 0 && (
              <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-green-100 p-6 shadow-sm">
                <h3 className="font-semibold mb-3 text-green-700">{t('competitor.gaps')}</h3>
                <div className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <p key={i} className="text-sm text-green-600">• {g}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result.hooks && result.hooks.length > 0 && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
              <h3 className="font-semibold mb-3">{t('competitor.hooks')}</h3>
              <div className="space-y-2">
                {result.hooks.map((h, i) => (
                  <p key={i} className="text-sm text-gray-700 dark:text-[#d4d4d8] p-2 bg-gray-50 dark:bg-[#1a1a22] rounded-lg">&ldquo;{h}&rdquo;</p>
                ))}
              </div>
            </div>
          )}

          {result.recommendations && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-blue-100 p-6 shadow-sm">
              <h3 className="font-semibold mb-2 text-blue-700">{t('competitor.recommendation')}</h3>
              <p className="text-sm text-gray-600 dark:text-[#a1a1aa] leading-relaxed">{result.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
