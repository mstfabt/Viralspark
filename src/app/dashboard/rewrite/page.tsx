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

const TONES = [
  { id: 'professional', labelTr: 'Profesyonel', labelEn: 'Professional' },
  { id: 'casual', labelTr: 'Samimi', labelEn: 'Casual' },
  { id: 'humorous', labelTr: 'Esprili', labelEn: 'Humorous' },
  { id: 'bold', labelTr: 'Cesur', labelEn: 'Bold' },
  { id: 'inspirational', labelTr: 'Ilham Verici', labelEn: 'Inspirational' },
  { id: 'educational', labelTr: 'Egitici', labelEn: 'Educational' },
]

const LENGTHS = [
  { id: 'shorter', labelTr: 'Daha Kisa', labelEn: 'Shorter' },
  { id: 'same', labelTr: 'Ayni Uzunluk', labelEn: 'Same Length' },
  { id: 'longer', labelTr: 'Daha Uzun', labelEn: 'Longer' },
]

export default function RewritePage() {
  const { t, locale } = useLanguage()
  const { toast } = useToast()
  const { open: openUpgrade } = useUpgradeModal()
  const [content, setContent] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('same')
  const [platform, setPlatform] = useState('')
  const [result, setResult] = useState<{ rewritten: string; changes: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setResult(null)
    setErrorMsg('')
    setLimitReached(false)

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          tone,
          length,
          platform: platform || undefined,
          lang: locale,
        }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.result) {
        setResult(data.result)
        toast(t('common.generated'))
      } else {
        setErrorMsg(data.error || t('common.error'))
      }
    } catch {
      setErrorMsg(t('common.error'))
    }
    setIsLoading(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast(t('common.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        {t('rewrite.title')}
      </h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">
        {t('rewrite.desc')}
      </p>

      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        {/* Original Content */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('rewrite.content.label')}
        </label>
        <textarea
          className="w-full p-4 md:p-5 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={4}
          placeholder={t('rewrite.content.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
        />
        <p className="text-xs text-gray-400 dark:text-[#71717a] mt-1 text-right">{content.length}/2000</p>

        {/* Target Tone */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2 mt-4">
          {t('rewrite.tone')}
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {TONES.map((tn) => (
            <button
              key={tn.id}
              onClick={() => setTone(tn.id)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                tone === tn.id
                  ? 'brand-grad brand-shadow-sm border-transparent'
                  : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
              }`}
            >
              {locale === 'en' ? tn.labelEn : tn.labelTr}
            </button>
          ))}
        </div>

        {/* Target Length */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('rewrite.length')}
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {LENGTHS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLength(l.id)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                length === l.id
                  ? 'brand-grad brand-shadow-sm border-transparent'
                  : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
              }`}
            >
              {locale === 'en' ? l.labelEn : l.labelTr}
            </button>
          ))}
        </div>

        {/* Platform (optional) */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('rewrite.platform')} <span className="text-gray-400 dark:text-[#71717a] font-normal">({t('rewrite.optional')})</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setPlatform('')}
            className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              platform === ''
                ? 'brand-grad brand-shadow-sm border-transparent'
                : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
            }`}
          >
            {t('common.general')}
          </button>
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
          disabled={isLoading || !content.trim()}
          className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('rewrite.loading') : t('rewrite.button')}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-4/5 mb-2" />
              <div className="skeleton h-4 w-3/5" />
            </div>
          ))}
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

      {/* Results — Side by Side Comparison */}
      {result && !isLoading && (
        <div className="mt-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Original */}
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm">
              <div className="bg-gray-100 dark:bg-[#1f1f26] px-5 py-3">
                <span className="font-semibold text-sm text-gray-600 dark:text-[#a1a1aa]">{t('rewrite.before')}</span>
              </div>
              <div className="p-5">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{content}</p>
              </div>
            </div>

            {/* Rewritten */}
            <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="brand-grad px-5 py-3 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{t('rewrite.after')}</span>
                <button
                  onClick={() => handleCopy(result.rewritten)}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
                >
                  {copied ? t('gen.copied') : t('gen.copy')}
                </button>
              </div>
              <div className="p-5">
                <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{result.rewritten}</p>
              </div>
            </div>
          </div>

          {/* Changes Summary */}
          {result.changes && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{t('rewrite.changes')}:</span> {result.changes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
