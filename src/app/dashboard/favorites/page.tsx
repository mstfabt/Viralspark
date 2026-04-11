'use client'

import { useState, useEffect } from 'react'
import { getFavorites, removeFavorite, type FavoriteItem } from '@/lib/favorites'
import { useToast } from '@/components/toast'
import { useLanguage } from '@/components/language-provider'

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'bg-black text-white',
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
  linkedin: 'bg-blue-700 text-white',
  tiktok: 'bg-gray-900 text-white',
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { toast } = useToast()
  const { t, locale } = useLanguage()

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleDelete = (id: string) => {
    removeFavorite(id)
    setFavorites(getFavorites())
    toast(t('common.deleted'), 'info')
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast(t('common.copied'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (favorites.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{t('nav.favorites')}</h1>
        <div className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 dark:bg-[#1f1f26] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('favorites.empty')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('favorites.empty.desc')}</p>
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('nav.favorites')}</h1>
          <p className="text-gray-500 dark:text-[#a1a1aa] mt-1 text-sm">{favorites.length} {t('favorites.count')}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {favorites.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#13131a] rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PLATFORM_COLORS[item.platform] || 'bg-gray-200 dark:bg-[#27272a] text-gray-700 dark:text-[#d4d4d8]'}`}>
                    {PLATFORM_LABELS[item.platform] || item.platform}
                  </span>
                  {item.score !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.score}/100
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-[#71717a]">
                  {new Date(item.savedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {item.topic && (
                <p className="text-xs text-gray-400 dark:text-[#71717a] mb-2 truncate">{item.topic}</p>
              )}

              <p className="text-sm text-gray-800 dark:text-[#e5e5e5] whitespace-pre-wrap leading-relaxed mb-4 line-clamp-6">{item.content}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.content)}
                  className="text-xs bg-gray-100 dark:bg-[#1f1f26] hover:bg-gray-200 dark:hover:bg-[#27272a] px-3 py-1.5 rounded-full transition-colors"
                >
                  {copiedId === item.id ? t('common.copied') : t('common.copy')}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-full transition-colors hover:bg-red-50"
                >
                  {t('favorites.remove')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
