'use client'

import { useTheme } from './theme-provider'
import { useEffect, useState } from 'react'

type Props = {
  className?: string
  variant?: 'icon' | 'pill'
  /** 'dark' = for dark surfaces (sidebar), 'adaptive' = auto theme-aware */
  surface?: 'dark' | 'adaptive'
}

export function ThemeToggle({ className = '', variant = 'icon', surface = 'dark' }: Props) {
  const { resolvedTheme, toggleTheme } = useTheme()
  // Intentional: must match SSR render (false) then flip on client to avoid
  // hydration mismatch on sun/moon icons. Lazy init would mismatch SSR.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  if (variant === 'pill') {
    return (
      <button
        type="button"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
        className={`relative inline-flex h-9 w-16 items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 ${className}`}
      >
        <span
          className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 116.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
    )
  }

  const surfaceClass =
    surface === 'dark'
      ? 'border-white/10 bg-white/5 text-white hover:bg-white/15'
      : 'border-gray-200 bg-white/60 text-gray-700 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/15'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${surfaceClass} ${className}`}
    >
      <span className="relative block h-5 w-5">
        {/* Sun icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 text-amber-400 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon icon */}
        <svg
          className={`absolute inset-0 h-5 w-5 text-indigo-300 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </span>
    </button>
  )
}
