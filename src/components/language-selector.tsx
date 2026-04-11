'use client'

import { useLanguage } from '@/components/language-provider'
import { LOCALES } from '@/lib/i18n'

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          className={`text-sm px-2 py-1 rounded-full transition-all ${
            locale === l.id
              ? 'brand-grad brand-shadow-sm'
              : 'text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f1f26]'
          }`}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
