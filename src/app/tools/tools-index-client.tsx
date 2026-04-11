'use client'

import { TOOLS } from '@/lib/tools-data'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function ToolsIndexClient() {
  const { locale } = useLanguage()
  const isEn = locale === 'en'

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

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {isEn ? 'AI Social Media Tools' : 'AI Sosyal Medya Araçları'}
        </h1>
        <p className="text-lg text-gray-500 dark:text-[#a1a1aa] mb-12">
          {isEn
            ? 'Platform-optimized AI tools for Instagram, X, LinkedIn, and TikTok.'
            : 'Instagram, X, LinkedIn ve TikTok için optimize edilmiş AI araçları.'}
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {TOOLS.map((tool) => {
            const c = isEn ? tool.en : tool.tr
            return (
              <a
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="block p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] hover:border-gray-200 dark:hover:border-[#3f3f46] hover:shadow-md transition-all bg-white dark:bg-[#13131a]"
              >
                <div className="w-10 h-10 brand-grad brand-shadow-sm rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tool.icon} />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold mb-2">{c.h1.split('—')[0].trim()}</h2>
                <p className="text-sm text-gray-500 dark:text-[#a1a1aa] leading-relaxed line-clamp-3">{c.subtitle}</p>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
