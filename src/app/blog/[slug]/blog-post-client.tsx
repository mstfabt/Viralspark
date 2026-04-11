'use client'

import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/blog-data'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function BlogPostClient({ slug }: { slug: string }) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a]">
      <nav className="border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <a href="/blog" className="text-sm font-medium text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors">
              {isEn ? 'All Posts' : 'Tum Yazilar'}
            </a>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium bg-gray-100 dark:bg-[#1f1f26] px-3 py-1 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400 dark:text-[#71717a]">{post.readTime}</span>
          <span className="text-xs text-gray-400 dark:text-[#71717a]">
            {new Date(post.date).toLocaleDateString(post.locale === 'en' ? 'en-US' : 'tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{post.title}</h1>

        <div className="prose prose-gray max-w-none text-gray-600 dark:text-[#a1a1aa] leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        <div className="mt-12 p-8 bg-gray-50 dark:bg-[#1a1a22] rounded-2xl border border-gray-100 dark:border-[#27272a] text-center">
          <h3 className="text-xl font-semibold mb-2">
            {isEn ? 'Start creating viral content' : 'Viral icerikler uretmeye baslayin'}
          </h3>
          <p className="text-gray-500 dark:text-[#a1a1aa] text-sm mb-4">
            {isEn ? 'Generate viral content in seconds with ViralSpark.' : 'ViralSpark ile saniyeler icinde viral icerikler uretin.'}
          </p>
          <a href="/sign-up" className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm">
            {isEn ? 'Get Started Free' : 'Ucretsiz Basla'}
          </a>
        </div>
      </article>
    </div>
  )
}
