'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'

const PLATFORMS = [
  { id: 'genel', labelKey: 'common.general' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

type HashtagResult = {
  primary: string[]
  secondary: string[]
  trending: string[]
  niche: string[]
  avoid: string[]
  strategy: string
}

export default function HashtagsPage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const { open: openUpgrade } = useUpgradeModal()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('genel')
  const [result, setResult] = useState<HashtagResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const handleResearch = async () => {
    if (!topic) return
    setIsLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, lang: locale }),
      })
      const data = await res.json()
      if (data.limitReached) {
        setError(data.error)
      } else if (data.result) {
        setResult(data.result)
      } else {
        setError(data.error || t('common.error'))
      }
    } catch {
      setError(t('common.error'))
    }
    setIsLoading(false)
  }

  const copyGroup = (label: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '))
    setCopiedGroup(label)
    setTimeout(() => setCopiedGroup(null), 2000)
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t('hashtags.title')}</h1>
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

  const TagGroup = ({ label, tags, color }: { label: string; tags: string[]; color: string }) => {
    if (!tags || tags.length === 0) return null
    return (
      <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{label}</h3>
          <button
            onClick={() => copyGroup(label, tags)}
            className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1 rounded-full transition-colors"
          >
            {copiedGroup === label ? t('common.copied') : t('hashtags.copyall')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className={`text-sm px-3 py-1.5 rounded-full font-medium ${color}`}>
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('hashtags.title')}</h1>
        <p className="text-gray-500 dark:text-[#a1a1aa] mt-1">{t('hashtags.desc')}</p>
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
        <textarea
          className="w-full p-5 text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={2}
          placeholder={t('hashtags.placeholder')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleResearch() } }}
        />
        <button
          onClick={handleResearch}
          disabled={isLoading || !topic}
          className="w-full mt-4 brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('hashtags.loading') : t('hashtags.button')}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <TagGroup label={t('hashtags.primary')} tags={result.primary} color="bg-blue-100 text-blue-700" />
          <TagGroup label={t('hashtags.secondary')} tags={result.secondary} color="bg-purple-100 text-purple-700" />
          <TagGroup label={t('hashtags.trending')} tags={result.trending} color="bg-green-100 text-green-700" />
          <TagGroup label={t('hashtags.niche')} tags={result.niche} color="bg-amber-100 text-amber-700" />

          {result.avoid && result.avoid.length > 0 && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-red-100 p-5 shadow-sm">
              <h3 className="font-semibold text-sm text-red-600 mb-3">{t('hashtags.avoid')}</h3>
              <div className="space-y-2">
                {result.avoid.map((item, i) => (
                  <p key={i} className="text-sm text-red-500">• {item}</p>
                ))}
              </div>
            </div>
          )}

          {result.strategy && (
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-2">{t('hashtags.strategy')}</h3>
              <p className="text-sm text-gray-600 dark:text-[#a1a1aa] leading-relaxed">{result.strategy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
