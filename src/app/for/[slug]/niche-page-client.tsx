'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { NICHES } from '@/lib/niche-data'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function NichePageClient({ slug }: { slug: string }) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const niche = NICHES.find((n) => n.slug === slug)
  if (!niche) notFound()

  const c = isEn ? niche.en : niche.tr
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a]">
      <nav className="border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <a href="/blog" className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors">
              Blog
            </a>
            <a href="/sign-up" className="text-sm font-semibold brand-grad brand-shadow-sm px-5 py-2 rounded-full">
              {isEn ? 'Get Started Free' : 'Ücretsiz Başla'}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <nav className="text-xs text-gray-400 dark:text-[#71717a] mb-6 flex items-center gap-2">
          <a href="/" className="hover:text-gray-600">{isEn ? 'Home' : 'Ana Sayfa'}</a>
          <span>/</span>
          <span className="text-gray-500">{c.h1.split('İçin')[0]?.trim() || c.h1}</span>
        </nav>
        <div className="text-5xl mb-6">{niche.icon}</div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{c.h1}</h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-[#a1a1aa] font-light mb-8 leading-relaxed">{c.subtitle}</p>
        <a
          href="/sign-up"
          className="inline-block brand-grad brand-shadow-sm px-8 py-4 rounded-full font-semibold text-base"
        >
          {c.cta}
        </a>
        <p className="text-xs text-gray-400 dark:text-[#71717a] mt-3">
          {isEn ? 'Free plan · No credit card · 5 generations/day' : 'Ücretsiz plan · Kredi kartı gerekmez · Günde 5 üretim'}
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <p className="text-base md:text-lg text-gray-600 dark:text-[#a1a1aa] leading-relaxed">{c.intro}</p>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 text-center">
          {isEn ? 'Why ViralSpark' : 'Neden ViralSpark'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {c.benefits.map((b) => (
            <div key={b.title} className="p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] bg-gray-50 dark:bg-[#1a1a22]">
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 dark:text-[#a1a1aa] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 text-center">
          {isEn ? 'Use cases' : 'Kullanım senaryoları'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {c.useCases.map((u, i) => (
            <div key={u.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 dark:border-[#27272a]">
              <div className="flex-shrink-0 w-10 h-10 brand-grad brand-shadow-sm rounded-full flex items-center justify-center font-bold text-white">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{u.title}</h3>
                <p className="text-sm text-gray-500 dark:text-[#a1a1aa] leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-8 text-center">
          {isEn ? 'Simple pricing' : 'Basit fiyatlandırma'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] text-center">
            <h3 className="font-semibold mb-1">{isEn ? 'Free' : 'Ücretsiz'}</h3>
            <p className="text-3xl font-bold mb-2">$0</p>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{isEn ? '5 generations/day' : 'Günde 5 üretim'}</p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-purple-500 text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-0.5 rounded-full font-semibold">
              {isEn ? 'Popular' : 'Popüler'}
            </span>
            <h3 className="font-semibold mb-1">{isEn ? 'Starter' : 'Başlangıç'}</h3>
            <p className="text-3xl font-bold mb-2">$3<span className="text-sm font-normal text-gray-400">/{isEn ? 'mo' : 'ay'}</span></p>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{isEn ? '50 posts/month' : 'Ayda 50 gönderi'}</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] text-center">
            <h3 className="font-semibold mb-1">Pro</h3>
            <p className="text-3xl font-bold mb-2">$10<span className="text-sm font-normal text-gray-400">/{isEn ? 'mo' : 'ay'}</span></p>
            <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{isEn ? 'Unlimited' : 'Sınırsız'}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-8 text-center">
          {isEn ? 'FAQ' : 'Sıkça Sorulanlar'}
        </h2>
        <div className="space-y-3">
          {c.faq.map((f, i) => (
            <div key={f.q} className="border border-gray-100 dark:border-[#27272a] rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-[#1a1a22] transition-colors"
                aria-expanded={openFaq === i}
              >
                <span className="font-semibold">{f.q}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-[#a1a1aa] leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Other niches */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-xl font-bold tracking-tight mb-6 text-center">
          {isEn ? 'Also for' : 'Ayrıca şunlar için'}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {NICHES.filter((n) => n.slug !== slug).map((n) => (
            <a
              key={n.slug}
              href={`/for/${n.slug}`}
              className="text-sm px-4 py-2 rounded-full border border-gray-200 dark:border-[#27272a] hover:bg-gray-50 dark:hover:bg-[#1a1a22] transition-colors"
            >
              {n.icon} {isEn ? n.en.h1.split('for ')[1]?.split(' —')[0] || n.keywordEn : n.tr.h1.split('İçin')[0]?.trim() || n.keyword}
            </a>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {isEn ? 'Ready to try?' : 'Denemeye hazır mısın?'}
        </h2>
        <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">
          {isEn ? 'Start free, upgrade anytime.' : 'Ücretsiz başla, istediğin zaman yükselt.'}
        </p>
        <a
          href="/sign-up"
          className="inline-block brand-grad brand-shadow-sm px-8 py-4 rounded-full font-semibold text-base"
        >
          {c.cta}
        </a>
      </section>
    </div>
  )
}
