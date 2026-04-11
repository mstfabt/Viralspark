'use client'

import { useState } from 'react'
import { useToast } from '@/components/toast'
import { useLanguage } from '@/components/language-provider'

const THREAD_PLATFORMS = [
  { id: 'twitter', label: 'Twitter Thread', icon: 'X' },
  { id: 'instagram', label: 'Instagram Carousel', icon: 'IG' },
]

export default function ThreadPage() {
  const { toast } = useToast()
  const { t, locale } = useLanguage()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [parts, setParts] = useState(5)
  const [results, setResults] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic) return
    setIsLoading(true)
    setResults(null)
    setLimitReached(false)
    setErrorMsg('')
    try {
      const res = await fetch('/api/thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, parts, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.result) {
        setResults(data.result)
        toast(t('common.generated'))
      } else {
        setErrorMsg(data.error || t('common.error'))
      }
    } catch {
      setErrorMsg(t('common.error'))
    }
    setIsLoading(false)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast(t('common.copied'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyAll = () => {
    if (!results) return
    const allText = results.map((text, i) => `${i + 1}/${results.length}\n${text}`).join('\n\n')
    navigator.clipboard.writeText(allText)
    toast(t('common.copied'))
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{t('thread.title')}</h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">{t('thread.desc')}</p>

      {/* Platform Toggle */}
      <div className="flex gap-3 mb-6">
        {THREAD_PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              platform === p.id
                ? 'brand-grad brand-shadow-sm border-transparent'
                : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
            }`}
          >
            <span className="text-xs font-bold">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        <textarea
          className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={3}
          placeholder={t('thread.placeholder')}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Parts Selector */}
        <div className="mt-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-[#d4d4d8]">{t('thread.parts')}:</label>
          <div className="flex gap-2">
            {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setParts(n)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  parts === n
                    ? 'brand-grad brand-shadow-sm'
                    : 'bg-gray-100 dark:bg-[#1f1f26] text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-200 dark:hover:bg-[#27272a]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="w-full mt-4 brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('thread.loading') : t('thread.button')}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8 space-y-4">
          {Array.from({ length: parts }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5">
              <div className="skeleton h-4 w-1/4 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-3/4" />
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
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {platform === 'twitter' ? 'Twitter Thread' : 'Instagram Carousel'} ({results.length} {t('thread.partsLabel')})
            </h2>
            <button
              onClick={handleCopyAll}
              className="text-sm bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-4 py-2 rounded-full transition-colors font-medium"
            >
              {t('thread.copyAll')}
            </button>
          </div>
          <div className="space-y-4">
            {results.map((text, i) => (
              <div key={i} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50 dark:bg-[#1a1a22]">
                  <span className="text-sm font-semibold text-gray-700 dark:text-[#d4d4d8]">
                    {i + 1}/{results.length}
                  </span>
                  <button
                    onClick={() => handleCopy(`part-${i}`, text)}
                    className="text-xs bg-white dark:bg-[#13131a] hover:bg-gray-100 dark:hover:bg-[#1f1f26] px-3 py-1 rounded-full transition-colors border border-gray-200 dark:border-[#27272a]"
                  >
                    {copiedId === `part-${i}` ? t('gen.copied') : t('gen.copy')}
                  </button>
                </div>
                <div className="p-5">
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
