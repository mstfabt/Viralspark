import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/blog-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Bulunamadi' }
  return {
    title: `${post.title} - ViralSpark Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">ViralSpark.</a>
          <a href="/blog" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Tum Yazilar
          </a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
          <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{post.title}</h1>

        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
          <h3 className="text-xl font-semibold mb-2">Viral icerikler uretmeye baslayin</h3>
          <p className="text-gray-500 text-sm mb-4">ViralSpark ile saniyeler icinde viral icerikler uretin.</p>
          <a href="/sign-up" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
            Ucretsiz Basla
          </a>
        </div>
      </article>
    </div>
  )
}
