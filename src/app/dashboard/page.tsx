'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useToast } from '@/components/toast'
import { saveToHistory } from '@/lib/history'
import { addFavorite, isFavorite } from '@/lib/favorites'
import { useLanguage } from '@/components/language-provider'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', color: 'bg-black', icon: 'X' },
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'IG' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-gray-900', icon: 'TT' },
]

type ContentResult = { text: string; score: number; tip: string | null }

export default function DashboardPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const { t, locale } = useLanguage()
  const [topic, setTopic] = useState('')
  const [results, setResults] = useState<Record<string, ContentResult[]> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number; plan: string } | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const hasBrand = !!publicMeta.brand
  const canMulti = limits.multiPlatformPerMonth > 0

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('vs_onboarded')) {
      setShowOnboarding(true)
    }
  }, [])

  // Fetch usage on mount so the warning banner can show immediately
  useEffect(() => {
    fetch('/api/usage')
      .then((res) => res.json())
      .then((data) => {
        if (data.used !== undefined) {
          setUsageInfo({ used: data.used, limit: data.limit, plan: data.plan })
        }
      })
      .catch(() => {})
  }, [])

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('vs_onboarded', '1')
  }

  const togglePlatform = (id: string) => {
    if (!canMulti) {
      setSelectedPlatforms([id])
      return
    }
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!topic || selectedPlatforms.length === 0) return
    setIsLoading(true)
    setResults(null)
    setLimitReached(false)
    setErrorMsg('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, platforms: selectedPlatforms, variations: plan !== 'free' ? 3 : 1, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.result) {
        const normalized: Record<string, ContentResult[]> = {}
        for (const [key, val] of Object.entries(data.result)) {
          if (Array.isArray(val)) {
            normalized[key] = val as ContentResult[]
          } else {
            normalized[key] = [val as ContentResult]
          }
        }
        setResults(normalized)
        if (data.usage) setUsageInfo(data.usage)

        const historyResults: Record<string, ContentResult> = {}
        for (const [key, val] of Object.entries(normalized)) {
          historyResults[key] = val[0]
        }
        saveToHistory({ prompt: topic, platforms: selectedPlatforms, results: historyResults })
        toast(t('common.generated'))
      } else {
        setErrorMsg(data.error || t('common.error'))
      }
    } catch {
      setErrorMsg(t('common.error'))
    }
    setIsLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast(t('common.copied'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFavorite = (id: string, text: string, platform: string, score?: number) => {
    if (favoritedIds.has(id)) return
    addFavorite({ content: text, platform, topic, score })
    setFavoritedIds((prev) => new Set(prev).add(id))
    toast(t('favorites.added'))
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#13131a] rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{t('onboard.title')}</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-[#a1a1aa] mb-6">
              <div className="flex gap-3 items-start">
                <span className="brand-grad w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p>{t('onboard.step1')}</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="brand-grad w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p>{t('onboard.step2')}</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="brand-grad w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p>{t('onboard.step3')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={dismissOnboarding} className="flex-1 brand-grad brand-shadow-sm py-3 rounded-2xl font-semibold">
                {t('onboard.start')}
              </button>
              <a href="/dashboard/brand" onClick={dismissOnboarding} className="flex-1 bg-gray-100 dark:bg-[#1f1f26] text-center py-3 rounded-2xl font-medium hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors">
                {t('onboard.brand')}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Usage Warning Banner */}
      {!bannerDismissed && usageInfo && usageInfo.limit !== Infinity && usageInfo.limit > 0 && (() => {
        const pct = usageInfo.used / usageInfo.limit
        if (pct < 0.7) return null
        const isMaxed = pct >= 1
        return (
          <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 ${
            isMaxed
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {isMaxed
                  ? (locale === 'en'
                    ? "You've reached your monthly limit. Upgrade to continue."
                    : 'Aylik limitinize ulastiniz. Devam etmek icin planininizi yukseltin.')
                  : (locale === 'en'
                    ? `You've used ${usageInfo.used}/${usageInfo.limit} generations this month. Upgrade for unlimited.`
                    : `Bu ay ${usageInfo.used}/${usageInfo.limit} icerik urettiniz. Sinirsiz icin planininizi yukseltin.`)}
              </span>
              <a href="/#pricing" className={`font-semibold underline whitespace-nowrap ${isMaxed ? 'text-red-900' : 'text-amber-900'}`}>
                {locale === 'en' ? 'Upgrade' : 'Planini Yukselt'}
              </a>
            </div>
            <button onClick={() => setBannerDismissed(true)} className="shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })()}

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('gen.title')}</h1>
        {usageInfo && usageInfo.limit !== Infinity && (
          <span className="text-sm text-gray-500 dark:text-[#a1a1aa] bg-white dark:bg-[#13131a] px-3 py-1 rounded-full border border-gray-200 dark:border-[#27272a]">
            {usageInfo.used}/{usageInfo.limit} {t('dash.usage')}
          </span>
        )}
      </div>

      {!hasBrand && limits.brandProfiles > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          {t('gen.brand.hint')}{' '}
          <a href="/dashboard/brand" className="font-semibold underline">{t('gen.brand.link')}</a>
        </div>
      )}

      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">
        {canMulti ? t('gen.desc.multi') : t('gen.desc.single')}
      </p>

      {/* Platform Selection */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedPlatforms.includes(p.id)
                ? 'brand-grad brand-shadow-sm border-transparent'
                : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
            }`}
          >
            <span className="text-xs font-bold">{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
        {!canMulti && (
          <span className="flex items-center text-xs text-gray-400 dark:text-[#71717a] ml-2">
            {t('gen.upgrade')}{' '}
            <a href="/#pricing" className="underline ml-1">{t('common.upgrade')}</a>
          </span>
        )}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        <textarea
          className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={3}
          placeholder={t('gen.placeholder')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic || selectedPlatforms.length === 0}
          className="w-full mt-4 brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('gen.loading') : selectedPlatforms.length > 1 ? `${selectedPlatforms.length} ${t('gen.button.multi')}` : t('gen.button')}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {selectedPlatforms.map((p) => (
            <div key={p} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm">
              <div className="skeleton h-12" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error / Limit */}
      {limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 mb-3">{errorMsg}</p>
          <a href="/#pricing" className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm">
            {t('gen.upgrade.button')}
          </a>
        </div>
      )}

      {errorMsg && !limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {results && !isLoading && (
        <div className={`mt-8 grid gap-6 ${Object.keys(results).length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {PLATFORMS.filter((p) => results[p.id]).map((p) => {
            const variations = results[p.id]
            return (
              <div key={p.id} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${p.color} text-white px-4 md:px-5 py-3 flex items-center justify-between`}>
                  <span className="font-semibold text-sm">{p.label}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {variations.map((item, idx) => (
                    <div key={idx} className="p-4 md:p-5">
                      {variations.length > 1 && (
                        <span className="text-xs text-gray-400 dark:text-[#71717a] font-medium mb-2 block">{t('gen.variation')} {idx + 1}</span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(item.score)}`}>
                          {item.score}/100
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            onClick={() => handleFavorite(`${p.id}-${idx}`, item.text, p.id, item.score)}
                            className={`p-1.5 rounded-full transition-colors ${
                              favoritedIds.has(`${p.id}-${idx}`) || isFavorite(item.text)
                                ? 'text-red-500'
                                : 'text-gray-300 hover:text-red-400'
                            }`}
                            title={t('favorites.add')}
                          >
                            <svg className="w-4 h-4" fill={favoritedIds.has(`${p.id}-${idx}`) || isFavorite(item.text) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCopy(`${p.id}-${idx}`, item.text)}
                            className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1 rounded-full transition-colors"
                          >
                            {copiedId === `${p.id}-${idx}` ? t('gen.copied') : t('gen.copy')}
                          </button>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{item.text}</p>
                      {item.tip && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs text-amber-700"><span className="font-semibold">{t('gen.improve')}</span> {item.tip}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
