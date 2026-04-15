import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NICHES } from '@/lib/niche-data'
import NichePageClient from './niche-page-client'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return NICHES.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const niche = NICHES.find((n) => n.slug === slug)
  if (!niche) return { title: 'Not Found' }

  const baseUrl = 'https://viralspark.shop'
  const canonical = `${baseUrl}/for/${niche.slug}`

  return {
    title: `${niche.tr.h1} — ViralSpark`,
    description: niche.tr.subtitle,
    keywords: [niche.keyword, niche.keywordEn],
    alternates: {
      canonical,
      languages: {
        'tr-TR': canonical,
        'en-US': canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: niche.tr.h1,
      description: niche.tr.subtitle,
      type: 'website',
      url: canonical,
      locale: 'tr_TR',
      alternateLocale: ['en_US'],
    },
    twitter: {
      card: 'summary_large_image',
      title: niche.tr.h1,
      description: niche.tr.subtitle,
    },
  }
}

export default async function NichePage({ params }: Props) {
  const { slug } = await params
  const niche = NICHES.find((n) => n.slug === slug)
  if (!niche) notFound()

  const baseUrl = 'https://viralspark.shop'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/for/${niche.slug}#page`,
        name: niche.tr.h1,
        description: niche.tr.subtitle,
        url: `${baseUrl}/for/${niche.slug}`,
        isPartOf: { '@id': `${baseUrl}/#website` },
        publisher: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/for/${niche.slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: niche.tr.h1, item: `${baseUrl}/for/${niche.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/for/${niche.slug}#faq`,
        mainEntity: niche.tr.faq.map((f) => ({
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
      <NichePageClient slug={slug} />
    </>
  )
}
