'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'

const PLATFORM_STYLES: Record<string, { color: string; icon: string; label: string }> = {
  twitter: { color: 'bg-black', icon: '𝕏', label: 'Twitter/X' },
  instagram: { color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'IG', label: 'Instagram' },
  linkedin: { color: 'bg-blue-700', icon: 'in', label: 'LinkedIn' },
  tiktok: { color: 'bg-gray-900', icon: 'TT', label: 'TikTok' },
}

type CalendarItem = {
  date: string
  platform: string
  title: string
  content: string
}

export default function CalendarPage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]

  const DAY_OPTIONS = [
    { value: 7, label: t('calendar.week1') },
    { value: 14, label: t('calendar.week2') },
    { value: 30, label: t('calendar.month1') },
  ]

  const [topic, setTopic] = useState('')
  const [days, setDays] = useState(Math.min(7, limits.maxCalendarDays || 7))
  const [calendar, setCalendar] = useState<CalendarItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!topic) return
    setIsLoading(true)
    setCalendar([])
    setError('')
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, days, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setError(data.error)
      } else if (data.calendar) {
        setCalendar(data.calendar)
      } else {
        setError(data.error || t('common.error'))
      }
    } catch {
      setError(t('common.error'))
    }
    setIsLoading(false)
  }

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleExport = () => {
    if (calendar.length === 0) return
    const header = locale === 'en' ? 'Date,Platform,Topic,Content' : 'Tarih,Platform,Konu,Icerik'
    const csv = [
      header,
      ...calendar.map((item) =>
        `${item.date},${item.platform},"${item.title.replace(/"/g, '""')}","${item.content.replace(/"/g, '""')}"`
      ),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `viralspark-calendar-${days}d.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  if (limits.calendarPerMonth === 0) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t('calendar.title')}</h1>
        <div className="bg-white dark:bg-[#13131a] p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">{t('calendar.locked')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('calendar.locked.desc')}</p>
          <a href="/#pricing" className="inline-block brand-grad brand-shadow px-8 py-4 rounded-full font-semibold">
            {t('common.upgrade')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t('calendar.title')}</h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-8">{t('calendar.desc')}</p>

      <div className="bg-white dark:bg-[#13131a] p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
        <div className="space-y-4">
          <textarea
            className="w-full p-5 text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
            rows={2}
            placeholder={t('calendar.placeholder')}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa]">{t('calendar.duration')}</span>
            {DAY_OPTIONS.map((opt) => {
              const locked = opt.value > limits.maxCalendarDays
              return (
                <button
                  key={opt.value}
                  onClick={() => !locked && setDays(opt.value)}
                  disabled={locked}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    days === opt.value
                      ? 'brand-grad brand-shadow-sm border-transparent'
                      : locked
                        ? 'bg-gray-50 dark:bg-[#1a1a22] text-gray-300 border-gray-100 dark:border-[#27272a] cursor-not-allowed'
                        : 'bg-white dark:bg-[#13131a] text-gray-500 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                  }`}
                >
                  {opt.label}{locked ? ' 🔒' : ''}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? `${days} ${t('calendar.generating')}` : `${days} ${t('calendar.generate')}`}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {calendar.length > 0 && (
        <>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{calendar.length} {t('calendar.plan')}</h2>
            {limits.csvExport ? (
              <button
                onClick={handleExport}
                className="text-sm font-medium bg-white dark:bg-[#13131a] border border-gray-200 dark:border-[#27272a] px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                {t('calendar.export')}
              </button>
            ) : (
              <span className="text-xs text-gray-400 dark:text-[#71717a]">{t('calendar.export.locked')}</span>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {calendar.map((item, idx) => {
              const pStyle = PLATFORM_STYLES[item.platform] || PLATFORM_STYLES.twitter
              return (
                <div key={idx} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm">
                  <div className="flex items-center gap-4 p-5">
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs text-gray-400 dark:text-[#71717a] uppercase">{formatDate(item.date)}</p>
                      <p className="text-2xl font-bold">{new Date(item.date).getDate()}</p>
                    </div>
                    <div className={`${pStyle.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {pStyle.label}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(idx, item.content)}
                      className="text-sm text-gray-400 dark:text-[#71717a] hover:text-black dark:hover:text-white transition-colors"
                    >
                      {copiedIdx === idx ? t('common.copied') : t('common.copy')}
                    </button>
                  </div>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm text-gray-600 dark:text-[#a1a1aa] whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-[#1a1a22] p-4 rounded-xl">{item.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
