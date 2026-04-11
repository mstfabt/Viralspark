'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { TOOLS } from '@/lib/tools-data'
import { BLOG_POSTS } from '@/lib/blog-data'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function ToolPageClient({ slug }: { slug: string }) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const tool = TOOLS.find((t) => t.slug === slug)
  if (!tool) notFound()

  const c = isEn ? tool.en : tool.tr
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Link to the related blog post, picking the locale-matching slug.
  const relatedPost = BLOG_POSTS.find(
    (p) => p.slug === c.relatedBlogSlug || p.translationSlug === c.relatedBlogSlug,
  )
  const relatedPostSlug =
    relatedPost && relatedPost.locale === locale
      ? relatedPost.slug
      : relatedPost?.translationSlug || c.relatedBlogSlug

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
          <a href="/tools" className="hover:text-gray-600">{isEn ? 'Tools' : 'Araçlar'}</a>
          <span>/</span>
          <span className="text-gray-500">{c.h1.split('—')[0].trim()}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{c.h1}</h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-[#a1a1aa] font-light mb-8 leading-relaxed">{c.subtitle}</p>
        <a
          href="/sign-up"
          className="inline-block brand-grad brand-shadow-sm px-8 py-4 rounded-full font-semibold text-base"
        >
          {c.cta}
        </a>
        <p className="text-xs text-gray-400 dark:text-[#71717a] mt-3">
          {isEn ? 'Free plan · No credit card · 3 generations/day' : 'Ücretsiz plan · Kredi kartı gerekmez · Günde 3 üretim'}
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <p className="text-base md:text-lg text-gray-600 dark:text-[#a1a1aa] leading-relaxed">{c.intro}</p>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 text-center">
          {isEn ? 'Why this tool' : 'Neden bu araç'}
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

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 text-center">
          {isEn ? 'How it works' : 'Nasıl çalışır'}
        </h2>
        <div className="space-y-4">
          {c.howItWorks.map((s, i) => (
            <div key={s.step} className="flex gap-4 p-5 rounded-2xl border border-gray-100 dark:border-[#27272a]">
              <div className="flex-shrink-0 w-10 h-10 brand-grad brand-shadow-sm rounded-full flex items-center justify-center font-bold text-white">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{s.step}</h3>
                <p className="text-sm text-gray-500 dark:text-[#a1a1aa] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-gray-100 dark:border-[#27272a]">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-8 text-center">
          {isEn ? 'Example output' : 'Örnek çıktı'}
        </h2>
        <div className="rounded-2xl border border-gray-100 dark:border-[#27272a] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-[#27272a] bg-gray-50 dark:bg-[#1a1a22]">
            <div className="text-xs text-gray-400 dark:text-[#71717a] uppercase tracking-wide mb-1">{isEn ? 'Input' : 'Girdi'}</div>
            <div className="text-sm font-medium">{c.example.input}</div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-400 dark:text-[#71717a] uppercase tracking-wide mb-2">{isEn ? 'Output' : 'Çıktı'}</div>
            <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700 dark:text-[#e4e4e7] leading-relaxed">{c.example.output}</pre>
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

      {/* Related blog CTA */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] bg-gray-50 dark:bg-[#1a1a22]">
          <div className="text-xs text-gray-400 dark:text-[#71717a] uppercase tracking-wide mb-2">
            {isEn ? 'Keep reading' : 'Okumaya devam et'}
          </div>
          <a href={`/blog/${relatedPostSlug}`} className="text-base font-semibold hover:underline">
            {relatedPost ? relatedPost.title : (isEn ? 'Related blog post' : 'İlgili blog yazısı')} →
          </a>
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
