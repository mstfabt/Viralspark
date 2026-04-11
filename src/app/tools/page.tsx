import type { Metadata } from 'next'
import { TOOLS } from '@/lib/tools-data'
import ToolsIndexClient from './tools-index-client'

export const metadata: Metadata = {
  title: 'AI Sosyal Medya Araçları — ViralSpark',
  description: 'Instagram caption oluşturucu, tweet üretici, LinkedIn post yazıcı, TikTok açıklama ve daha fazlası. Yapay zeka destekli sosyal medya içerik üretim araçları.',
  alternates: {
    canonical: '/tools',
    languages: {
      'tr-TR': '/tools',
      'en-US': '/tools',
      'x-default': '/tools',
    },
  },
  openGraph: {
    title: 'AI Sosyal Medya Araçları — ViralSpark',
    description: 'Yapay zeka destekli sosyal medya içerik üretim araçları.',
    type: 'website',
    url: 'https://viralspark.shop/tools',
  },
}

export default function ToolsIndexPage() {
  const baseUrl = 'https://viralspark.shop'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${baseUrl}/tools/${tool.slug}`,
      name: tool.tr.h1,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsIndexClient />
    </>
  )
}
