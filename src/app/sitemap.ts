import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'
import { TOOLS } from '@/lib/tools-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viralspark.shop'
  const now = new Date()

  // Blog posts — each entry links its counterpart in the other language via hreflang
  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => {
    const url = `${baseUrl}/blog/${post.slug}`
    const languages: Record<string, string> = {}
    if (post.locale === 'tr') {
      languages['tr-TR'] = url
      if (post.translationSlug) languages['en-US'] = `${baseUrl}/blog/${post.translationSlug}`
    } else {
      languages['en-US'] = url
      if (post.translationSlug) languages['tr-TR'] = `${baseUrl}/blog/${post.translationSlug}`
    }
    languages['x-default'] = url

    return {
      url,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages },
    }
  })

  // Tool landing pages — high commercial-intent targets
  const toolUrls: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Static pages — all primary pages include both TR and EN as x-default
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/sign-up`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sign-in`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [...staticRoutes, ...toolUrls, ...blogUrls]
}
