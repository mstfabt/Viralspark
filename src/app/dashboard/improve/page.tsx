'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/toast'
import { useLanguage } from '@/components/language-provider'
import { useGenerationCache } from '@/lib/generation-cache'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

type AnalysisResult = {
  score: number
  categories: {
    hook: number
    engagement: number
    hashtags: number
    platformFit: number
  }
  improvements: string[]
  improved: string
}

export default function ImprovePage() {
  const { user } = useUser()
  const { toast } = useToast()
  const { t, locale } = useLanguage()
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [showComparison, setShowComparison] = useState(false)
  const [copiedImproved, setCopiedImproved] = useState(false)
  const { cachedResult, saveResult } = useGenerationCache<AnalysisResult>('improve')

  useEffect(() => {
    if (cachedResult) setResult(cachedResult)
  }, [cachedResult])

  const handleAnalyze = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setResult(null)
    setErrorMsg('')
    setShowComparison(false)

    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), platform, lang: locale }),
      })
      const data = await res.json()

      if (data.error) {
        setErrorMsg(data.error)
        if (data.limitReached) {
          setErrorMsg(data.error)
        }
      } else if (data.result) {
        setResult(data.result)
        saveResult(data.result, content)
      }
    } catch {
      setErrorMsg(t('common.error'))
    }
    setIsLoading(false)
  }

  const handleCopyImproved = () => {
    if (!result) return
    navigator.clipboard.writeText(result.improved)
    setCopiedImproved(true)
    toast(t('common.copied'))
    setTimeout(() => setCopiedImproved(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'stroke-green-500'
    if (score >= 60) return 'stroke-amber-500'
    return 'stroke-red-500'
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('nav.improve')}</h1>
        <p className="text-gray-500 dark:text-[#a1a1aa] mt-1 text-sm md:text-base">{t('improve.desc')}</p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a] mb-6">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2 block">{t('improve.platform')}</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  platform === p.id
                    ? 'brand-grad brand-shadow-sm border-transparent'
                    : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full p-4 md:p-5 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={5}
          maxLength={2000}
          placeholder={t('improve.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-xs text-gray-400 dark:text-[#71717a]">{content.length}/2000</span>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !content.trim()}
          className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('improve.loading') : t('improve.button')}
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-[#1f1f26] animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse w-2/3" />
                <div className="h-3 bg-gray-100 dark:bg-[#1f1f26] rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Overall Score + Category Scores */}
          <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Main Score Gauge */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    className={getScoreStroke(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 263.9} 263.9`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                  <span className="text-xs text-gray-400 dark:text-[#71717a]">/100</span>
                </div>
              </div>

              {/* Category Scores */}
              <div className="flex-1 w-full space-y-3">
                {[
                  { key: 'hook', label: t('improve.cat.hook'), value: result.categories.hook },
                  { key: 'engagement', label: t('improve.cat.engagement'), value: result.categories.engagement },
                  { key: 'hashtags', label: t('improve.cat.hashtags'), value: result.categories.hashtags },
                  { key: 'platformFit', label: t('improve.cat.platformFit'), value: result.categories.platformFit },
                ].map((cat) => (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-[#a1a1aa]">{cat.label}</span>
                      <span className={`text-sm font-bold ${getScoreColor(cat.value)}`}>{cat.value}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-[#1f1f26] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreBarColor(cat.value)}`}
                        style={{ width: `${cat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wide mb-4">{t('improve.suggestions')}</h3>
            <ul className="space-y-3">
              {result.improvements.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-[#d4d4d8] leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Auto-Improved Version */}
          <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wide">{t('improve.improved')}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1.5 rounded-full transition-colors"
                >
                  {showComparison ? t('improve.hideCompare') : t('improve.showCompare')}
                </button>
                <button
                  onClick={handleCopyImproved}
                  className="text-xs brand-grad brand-shadow-sm px-3 py-1.5 rounded-full font-semibold"
                >
                  {copiedImproved ? t('common.copied') : t('common.copy')}
                </button>
              </div>
            </div>

            {showComparison ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-xs font-medium text-red-500 block mb-2">{t('improve.before')}</span>
                  <p className="text-sm text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap leading-relaxed">{content}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <span className="text-xs font-medium text-green-600 block mb-2">{t('improve.after')}</span>
                  <p className="text-sm text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap leading-relaxed">{result.improved}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap leading-relaxed">{result.improved}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
