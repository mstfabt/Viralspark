import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Sosyal Medya Stratejileri ve Viral İçerik İpuçları',
  description: 'Yapay zeka ile sosyal medya içerik üretimi, viral olma taktikleri, hashtag stratejileri ve platform bazlı rehberler. ViralSpark Blog.',
  alternates: {
    canonical: '/blog',
    languages: {
      'tr-TR': '/blog',
      'en-US': '/blog',
      'x-default': '/blog',
    },
  },
  openGraph: {
    title: 'ViralSpark Blog — Sosyal Medya Stratejileri',
    description: 'Sosyal medyada viral olmanın sırları, AI araçları ve kanıtlanmış stratejiler.',
    type: 'website',
    url: 'https://viralspark.shop/blog',
  },
}

const blogListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: 'https://viralspark.shop',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://viralspark.shop/blog',
    },
  ],
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />
      {children}
    </>
  )
}
