'use client'

import { useState } from 'react'
import { useToast } from '@/components/toast'
import { useLanguage } from '@/components/language-provider'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: 'X', maxChars: 160 },
  { id: 'instagram', label: 'Instagram', icon: 'IG', maxChars: 150 },
  { id: 'linkedin', label: 'LinkedIn', icon: 'in', maxChars: 300 },
  { id: 'tiktok', label: 'TikTok', icon: 'TT', maxChars: 80 },
]

const TONES = [
  { id: 'professional', labelKey: 'bio.tone.professional' },
  { id: 'casual', labelKey: 'bio.tone.casual' },
  { id: 'creative', labelKey: 'bio.tone.creative' },
  { id: 'bold', labelKey: 'bio.tone.bold' },
]

export default function BioPage() {
  const { toast } = useToast()
  const { t, locale } = useLanguage()
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [achievements, setAchievements] = useState('')
  const [tone, setTone] = useState('professional')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'instagram'])
  const [results, setResults] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!name || !profession || !achievements || selectedPlatforms.length === 0) return
    setIsLoading(true)
    setResults(null)
    setLimitReached(false)
    setErrorMsg('')
    try {
      const res = await fetch('/api/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profession, achievements, tone, platforms: selectedPlatforms, lang: locale }),
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

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{t('bio.title')}</h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">{t('bio.desc')}</p>

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
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a] space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-1">{t('bio.name')}</label>
          <input
            type="text"
            className="w-full p-4 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
            placeholder={t('bio.name.placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-1">{t('bio.profession')}</label>
          <input
            type="text"
            className="w-full p-4 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
            placeholder={t('bio.profession.placeholder')}
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-1">{t('bio.achievements')}</label>
          <textarea
            className="w-full p-4 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
            rows={3}
            placeholder={t('bio.achievements.placeholder')}
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('bio.toneLabel')}</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((tn) => (
              <button
                key={tn.id}
                onClick={() => setTone(tn.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tone === tn.id
                    ? 'brand-grad brand-shadow-sm'
                    : 'bg-gray-100 dark:bg-[#1f1f26] text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-200 dark:hover:bg-[#27272a]'
                }`}
              >
                {t(tn.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !name || !profession || !achievements || selectedPlatforms.length === 0}
          className="w-full mt-2 brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('bio.loading') : t('bio.button')}
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
                <div className="skeleton h-4 w-3/4" />
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
            const bio = results[p.id]
            const charCount = bio.length
            const isOverLimit = charCount > p.maxChars
            return (
              <div key={p.id} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="brand-grad px-4 md:px-5 py-3 flex items-center justify-between">
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isOverLimit ? 'bg-red-500/20 text-red-200' : 'bg-white/20 text-white/80'
                  }`}>
                    {charCount}/{p.maxChars}
                  </span>
                </div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-end mb-3">
                    <button
                      onClick={() => handleCopy(p.id, bio)}
                      className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1 rounded-full transition-colors"
                    >
                      {copiedId === p.id ? t('gen.copied') : t('gen.copy')}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{bio}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
