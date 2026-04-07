import type { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog - ViralSpark',
  description: 'Sosyal medya stratejileri, viral icerik ipuclari ve dijital pazarlama rehberleri.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">ViralSpark.</a>
          <a href="/sign-up" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
            Ucretsiz Basla
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-gray-500 mb-12">Sosyal medya stratejileri, viral icerik ipuclari ve daha fazlasi.</p>

        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
                <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">{post.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
