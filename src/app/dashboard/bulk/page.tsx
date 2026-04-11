'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useToast } from '@/components/toast'
import { useUpgradeModal } from '@/components/upgrade-modal'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: 'X' },
  { id: 'instagram', label: 'Instagram', icon: 'IG' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'tiktok', label: 'TikTok', icon: 'TT' },
]

type BulkResult = { topic: string; text: string; score: number }

export default function BulkPage() {
  const { t, locale } = useLanguage()
  const { toast } = useToast()
  const { open: openUpgrade } = useUpgradeModal()
  const [topicsText, setTopicsText] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [results, setResults] = useState<BulkResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalTopics, setTotalTopics] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const getTopics = () => {
    return topicsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5)
  }

  const topicCount = getTopics().length

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  const handleGenerate = async () => {
    const topics = getTopics()
    if (topics.length === 0) return

    setIsLoading(true)
    setResults(null)
    setErrorMsg('')
    setLimitReached(false)
    setProgress(0)
    setTotalTopics(topics.length)

    try {
      const res = await fetch('/api/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics, platform, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.results) {
        setResults(data.results)
        setProgress(data.results.length)
        toast(t('common.generated'))
      } else {
        setErrorMsg(data.error || t('common.error'))
      }
    } catch {
      setErrorMsg(t('common.error'))
    }
    setIsLoading(false)
  }

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast(t('common.copied'))
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        {t('bulk.title')}
      </h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">
        {t('bulk.desc')}
      </p>

      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        {/* Topics */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('bulk.topics.label')}
        </label>
        <textarea
          className="w-full p-4 md:p-5 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={5}
          placeholder={t('bulk.topics.placeholder')}
          value={topicsText}
          onChange={(e) => setTopicsText(e.target.value)}
        />
        <p className="text-xs text-gray-400 dark:text-[#71717a] mt-1 text-right">
          {topicCount}/5 {t('bulk.topics.count')}
        </p>

        {/* Platform */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2 mt-4">
          {t('bulk.platform')}
        </label>
        <div className="flex flex-wrap gap-2 mb-6">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                platform === p.id
                  ? 'brand-grad brand-shadow-sm border-transparent'
                  : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
              }`}
            >
              <span className="text-xs font-bold">{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || topicCount === 0}
          className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('bulk.loading') : `${t('bulk.button')} (${topicCount})`}
        </button>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-[#a1a1aa]">{t('bulk.progress')}</span>
            <span className="text-sm font-medium text-gray-800 dark:text-[#e5e5e5]">{progress}/{totalTopics}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-[#27272a] rounded-full h-2">
            <div
              className="brand-grad h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalTopics > 0 ? (progress / totalTopics) * 100 : 0}%` }}
            />
          </div>

          {/* Loading Skeleton Grid */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: totalTopics }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm">
                <div className="skeleton h-4 w-32 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-4/5 mb-2" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error / Limit */}
      {limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 mb-3">{errorMsg}</p>
          <button type="button" onClick={openUpgrade} className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm">
            {t('gen.upgrade.button')}
          </button>
        </div>
      )}

      {errorMsg && !limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Results Grid */}
      {results && !isLoading && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {results.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-50 dark:bg-[#1a1a22] px-5 py-3 flex items-center justify-between border-b border-gray-100 dark:border-[#27272a]">
                <span className="font-medium text-sm text-gray-700 dark:text-[#d4d4d8] truncate mr-2">{item.topic}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${getScoreColor(item.score)}`}>
                  {item.score}/100
                </span>
              </div>
              <div className="p-5">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{item.text}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleCopy(idx, item.text)}
                    className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1 rounded-full transition-colors"
                  >
                    {copiedIdx === idx ? t('gen.copied') : t('gen.copy')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
