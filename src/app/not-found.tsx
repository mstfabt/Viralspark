'use client'

import { useLanguage } from '@/components/language-provider'

export default function NotFound() {
  const { locale } = useLanguage()
  const isEn = locale === 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tighter text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">
          {isEn ? 'Page not found' : 'Sayfa bulunamadi'}
        </h2>
        <p className="text-gray-500 dark:text-[#a1a1aa] mb-8">
          {isEn ? 'The page you are looking for does not exist or has been moved.' : 'Aradiginiz sayfa mevcut degil veya tasindi.'}
        </p>
        <div className="flex gap-3 justify-center">
          <a href="/" className="brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm">
            {isEn ? 'Home' : 'Ana Sayfa'}
          </a>
          <a href="/dashboard" className="bg-gray-100 dark:bg-[#1f1f26] px-6 py-3 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors text-sm">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
