'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { t as translate, type Locale } from '@/lib/i18n'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'tr',
  setLocale: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr')

  useEffect(() => {
    const saved = localStorage.getItem('vs_locale') as Locale | null
    if (saved === 'tr' || saved === 'en') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('vs_locale', newLocale)
  }, [])

  const t = useCallback((key: string) => translate(locale, key), [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
