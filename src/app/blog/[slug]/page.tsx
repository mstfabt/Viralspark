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

  const baseUrl = 'https://viralspark.shop'
  const canonical = `${baseUrl}/blog/${post.slug}`

  // Build hreflang alternates if this post has a counterpart in the other language
  const languages: Record<string, string> = {}
  if (post.locale === 'tr') {
    languages['tr-TR'] = canonical
    if (post.translationSlug) {
      languages['en-US'] = `${baseUrl}/blog/${post.translationSlug}`
    }
  } else {
    languages['en-US'] = canonical
    if (post.translationSlug) {
      languages['tr-TR'] = `${baseUrl}/blog/${post.translationSlug}`
    }
  }
  languages['x-default'] = canonical

  return {
    title: `${post.title} - ViralSpark Blog`,
    description: post.excerpt,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: canonical,
      locale: post.locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: post.translationSlug ? (post.locale === 'tr' ? 'en_US' : 'tr_TR') : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  const baseUrl = 'https://viralspark.shop'

  // Emit Article + BreadcrumbList as a single JSON-LD @graph
  const combinedJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            '@id': `${baseUrl}/blog/${slug}#article`,
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: post.locale === 'tr' ? 'tr-TR' : 'en-US',
            articleSection: post.category,
            author: {
              '@type': 'Organization',
              '@id': `${baseUrl}/#organization`,
              name: 'ViralSpark Team',
              url: baseUrl,
            },
            publisher: { '@id': `${baseUrl}/#organization` },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/blog/${slug}`,
            },
            image: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo-512.png`,
              width: 512,
              height: 512,
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${baseUrl}/blog/${slug}#breadcrumb`,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: post.locale === 'tr' ? 'Ana Sayfa' : 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${baseUrl}/blog`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `${baseUrl}/blog/${slug}`,
              },
            ],
          },
        ],
      }
    : null

  return (
    <>
      {combinedJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  )
}
