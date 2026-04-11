'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useToast } from '@/components/toast'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: 'X' },
  { id: 'instagram', label: 'Instagram', icon: 'IG' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'tiktok', label: 'TikTok', icon: 'TT' },
]

const TONES = [
  { id: 'witty', labelTr: 'Esprili', labelEn: 'Witty' },
  { id: 'supportive', labelTr: 'Destekleyici', labelEn: 'Supportive' },
  { id: 'expert', labelTr: 'Uzman', labelEn: 'Expert' },
  { id: 'casual', labelTr: 'Samimi', labelEn: 'Casual' },
]

const GOALS = [
  { id: 'engage', labelTr: 'Etkilesim', labelEn: 'Engage' },
  { id: 'network', labelTr: 'Ag Olustur', labelEn: 'Network' },
  { id: 'promote', labelTr: 'Tanitim', labelEn: 'Promote' },
]

export default function ReplyPage() {
  const { t, locale } = useLanguage()
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [tone, setTone] = useState('witty')
  const [goal, setGoal] = useState('engage')
  const [replies, setReplies] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setReplies(null)
    setErrorMsg('')
    setLimitReached(false)

    try {
      const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, tone, goal, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.replies) {
        setReplies(data.replies)
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
        {t('reply.title')}
      </h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 text-sm md:text-base">
        {t('reply.desc')}
      </p>

      <div className="bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        {/* Original Post */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('reply.post.label')}
        </label>
        <textarea
          className="w-full p-4 md:p-5 text-base bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          rows={4}
          placeholder={t('reply.post.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
        />
        <p className="text-xs text-gray-400 dark:text-[#71717a] mt-1 text-right">{content.length}/1000</p>

        {/* Platform */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2 mt-4">
          {t('reply.platform')}
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Tone */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('reply.tone')}
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

        {/* Goal */}
        <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
          {t('reply.goal')}
        </label>
        <div className="flex flex-wrap gap-2 mb-6">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                goal === g.id
                  ? 'brand-grad brand-shadow-sm border-transparent'
                  : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
              }`}
            >
              {locale === 'en' ? g.labelEn : g.labelTr}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !content.trim()}
          className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('reply.loading') : t('reply.button')}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm">
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-4/5" />
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
      {replies && !isLoading && (
        <div className="mt-8 space-y-4">
          {replies.map((reply, idx) => (
            <div key={idx} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 dark:text-[#71717a] font-medium">
                  {t('reply.suggestion')} {idx + 1}
                </span>
                <button
                  onClick={() => handleCopy(idx, reply)}
                  className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1 rounded-full transition-colors"
                >
                  {copiedIdx === idx ? t('gen.copied') : t('gen.copy')}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-sm">{reply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
