'use client'

import { BLOG_POSTS } from '@/lib/blog-data'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function BlogPage() {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const posts = BLOG_POSTS.filter((p) => p.locale === locale)

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a]">
      <nav className="border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <a href="/sign-up" className="text-sm font-semibold brand-grad brand-shadow-sm px-5 py-2 rounded-full">
              {isEn ? 'Get Started Free' : 'Ucretsiz Basla'}
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-gray-500 dark:text-[#a1a1aa] mb-12">
          {isEn
            ? 'Social media strategies, viral content tips, and more.'
            : 'Sosyal medya stratejileri, viral icerik ipuclari ve daha fazlasi.'}
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white dark:bg-[#13131a] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-[#27272a] hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-gray-100 dark:bg-[#1f1f26] px-3 py-1 rounded-full">{post.category}</span>
                <span className="text-xs text-gray-400 dark:text-[#71717a]">{post.readTime}</span>
                <span className="text-xs text-gray-400 dark:text-[#71717a]">
                  {new Date(post.date).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">{post.title}</h2>
              <p className="text-gray-500 dark:text-[#a1a1aa] text-sm leading-relaxed">{post.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
