'use client'

import { useUser, UserButton, SignOutButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_ITEMS = [
  { href: '/dashboard/home', labelKey: 'nav.home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard', labelKey: 'dash.generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/dashboard/share', labelKey: 'dash.share', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/hashtags', labelKey: 'dash.hashtags', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { href: '/dashboard/hooks', labelKey: 'dash.hooks', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/dashboard/competitor', labelKey: 'dash.competitor', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/dashboard/calendar', labelKey: 'dash.calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/dashboard/thread', labelKey: 'nav.thread', icon: 'M4 6h16M4 12h16m-7 6h7' },
  { href: '/dashboard/url-to-post', labelKey: 'nav.urlToPost', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { href: '/dashboard/bio', labelKey: 'nav.bio', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { href: '/dashboard/reply', labelKey: 'nav.reply', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { href: '/dashboard/rewrite', labelKey: 'nav.rewrite', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { href: '/dashboard/bulk', labelKey: 'nav.bulk', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/dashboard/improve', labelKey: 'nav.improve', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/dashboard/favorites', labelKey: 'nav.favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { href: '/dashboard/history', labelKey: 'dash.history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/dashboard/brand', labelKey: 'dash.brand', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/dashboard/billing', labelKey: 'dash.billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useLanguage()

  const plan = (user?.publicMetadata?.plan as PlanType) || 'free'
  const subscriptionStatus = user?.publicMetadata?.subscriptionStatus as string | undefined
  const isActive = plan !== 'free' && (subscriptionStatus === 'active' || subscriptionStatus === 'on_trial')
  const currentPlan = isActive ? plan : 'free'
  const planLabel = PLAN_LIMITS[currentPlan]?.label || 'Free'

  return (
    <div className="min-h-screen brand-bg-soft flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 sidebar-surface flex flex-col fixed h-full z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Ambient gradient glow at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#d62976]/20 via-[#962fbf]/10 to-transparent" />

        <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
          <a href="/" className="inline-flex group">
            <Logo size={28} />
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item, i) => {
            const active = pathname === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{ animationDelay: `${i * 30}ms` }}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 animate-[fade-in-up_0.4s_ease-out_backwards] ${
                  active
                    ? 'brand-grad brand-shadow-sm text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-0.5'
                }`}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                )}
                <svg
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    active ? '' : 'group-hover:scale-110'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="truncate">{t(item.labelKey)}</span>
              </a>
            )
          })}
        </nav>

        <div className="relative p-4 border-t border-white/5 space-y-3">
          <LanguageSelector className="justify-center" />
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName || 'User'}</p>
              <p className="text-xs text-white/50">{planLabel} {t('dash.plan')}</p>
            </div>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all duration-200">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('nav.signout')}
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main key={pathname} className="flex-1 lg:ml-64 min-h-screen animate-[fade-in_0.4s_ease-out]">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-base)] px-4 py-3 flex items-center justify-between transition-colors">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[var(--text-base)]"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo size={26} textClassName="text-lg" />
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <UserButton />
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
