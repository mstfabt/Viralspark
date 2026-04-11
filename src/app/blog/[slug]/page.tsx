import type { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'
import BlogPostClient from './blog-post-client'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Not Found' }
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

  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: 'ViralSpark Team',
          url: 'https://viralspark.shop',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ViralSpark',
          url: 'https://viralspark.shop',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://viralspark.shop/blog/${slug}`,
        },
      }
    : null

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  )
}
