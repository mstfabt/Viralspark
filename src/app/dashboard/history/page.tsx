'use client'

import { useState, useEffect } from 'react'
import { getHistory, deleteFromHistory, clearHistory, type HistoryItem } from '@/lib/history'
import { useToast } from '@/components/toast'
import { useLanguage } from '@/components/language-provider'

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { toast } = useToast()
  const { t, locale } = useLanguage()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleDelete = (id: string) => {
    deleteFromHistory(id)
    setHistory(getHistory())
    toast(t('common.deleted'), 'info')
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
    toast(t('common.cleared'), 'info')
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast(t('common.copied'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (history.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{t('history.title')}</h1>
        <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{t('history.empty')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('history.empty.desc')}</p>
          <a href="/dashboard" className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold">
            {t('gen.title')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('history.title')}</h1>
          <p className="text-gray-500 dark:text-[#a1a1aa] mt-1 text-sm">{history.length} {t('history.saved')}</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-full transition-colors"
        >
          {t('history.clear')}
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm">
            <div className="p-4 md:p-5 border-b border-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-[#e5e5e5]">{item.prompt}</p>
                  <p className="text-xs text-gray-400 dark:text-[#71717a] mt-1">
                    {new Date(item.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 md:p-5 grid gap-3 md:grid-cols-2">
              {Object.entries(item.results).map(([platform, data]) => (
                <div key={platform} className="p-3 bg-gray-50 dark:bg-[#1a1a22] rounded-xl group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-[#a1a1aa]">{PLATFORM_LABELS[platform] || platform}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        data.score >= 80 ? 'bg-green-100 text-green-700' : data.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {data.score}/100
                      </span>
                      <button
                        onClick={() => handleCopy(`${item.id}-${platform}`, data.text)}
                        className="text-xs text-gray-400 dark:text-[#71717a] hover:text-black dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedId === `${item.id}-${platform}` ? t('common.copied') : t('common.copy')}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap leading-relaxed">{data.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
