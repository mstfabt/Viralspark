import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TOOLS } from '@/lib/tools-data'
import ToolPageClient from './tool-page-client'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = TOOLS.find((t) => t.slug === slug)
  if (!tool) return { title: 'Not Found' }

  const baseUrl = 'https://viralspark.shop'
  const canonical = `${baseUrl}/tools/${tool.slug}`

  return {
    title: `${tool.tr.h1} - ViralSpark`,
    description: tool.tr.subtitle,
    keywords: [tool.keyword, tool.keywordEn],
    alternates: {
      canonical,
      languages: {
        'tr-TR': canonical,
        'en-US': canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: tool.tr.h1,
      description: tool.tr.subtitle,
      type: 'website',
      url: canonical,
      locale: 'tr_TR',
      alternateLocale: ['en_US'],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.tr.h1,
      description: tool.tr.subtitle,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = TOOLS.find((t) => t.slug === slug)
  if (!tool) notFound()

  const baseUrl = 'https://viralspark.shop'

  // Combined JSON-LD: SoftwareApplication, BreadcrumbList, FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/tools/${tool.slug}#app`,
        name: tool.tr.h1,
        description: tool.tr.subtitle,
        url: `${baseUrl}/tools/${tool.slug}`,
        applicationCategory: 'SocialMediaApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/tools/${tool.slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Araçlar', item: `${baseUrl}/tools` },
          { '@type': 'ListItem', position: 3, name: tool.tr.h1, item: `${baseUrl}/tools/${tool.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/tools/${tool.slug}#faq`,
        mainEntity: tool.tr.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageClient slug={slug} />
    </>
  )
}
