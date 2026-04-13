import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ToastProvider } from '@/components/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { LanguageProvider } from '@/components/language-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { LemonSqueezyOverlay } from '@/components/lemon-squeezy-overlay'
import { PaddleLoader } from '@/components/paddle-loader'
import './globals.css'

// Inline script — runs before React hydrates to prevent FOUC / theme flash
const themeInitScript = `(function(){try{var t=localStorage.getItem('vs-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`

export const metadata: Metadata = {
  metadataBase: new URL('https://viralspark.shop'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
      'en-US': '/',
      'x-default': '/',
    },
  },
  title: {
    default: 'ViralSpark — Yapay Zeka ile Sosyal Medya İçerik Üretici',
    template: '%s | ViralSpark',
  },
  description: 'Yapay zeka destekli sosyal medya içerik üretici. Twitter, Instagram, LinkedIn ve TikTok için viral içerikler, hashtag\'ler, hook\'lar ve daha fazlası — saniyeler içinde.',
  keywords: [
    'yapay zeka içerik üretici',
    'ai sosyal medya',
    'viral içerik üretici',
    'instagram caption oluşturucu',
    'tweet üretici',
    'linkedin post yazma',
    'tiktok açıklama',
    'hashtag önerici',
    'hook cümleleri',
    'ai content generator',
    'social media ai',
    'viral content tool',
  ],
  authors: [{ name: 'ViralSpark' }],
  creator: 'ViralSpark',
  publisher: 'ViralSpark',
  category: 'technology',
  openGraph: {
    title: 'ViralSpark — Yapay Zeka ile Sosyal Medya İçerik Üretici',
    description: 'Yapay zeka destekli sosyal medya içerik üretici. 14 AI aracı ile saniyeler içinde viral içerikler üretin.',
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    siteName: 'ViralSpark',
    url: 'https://viralspark.shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralSpark — AI Sosyal Medya İçerik Üretici',
    description: '14 AI aracı ile saniyeler içinde viral sosyal medya içerikleri üretin.',
    creator: '@viralsparkshop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ['Uc_E6jAv_bKeNl4F9ZYHZGNQTBl0sw0457XsYNacf98', '1abRVCLuO5UxIBDIud1NIKBetzkqaXFHyUbpnEZ_fhM'],
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
  },
}

// Multiple schemas emitted as JSON-LD @graph — Google parses all of them
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://viralspark.shop/#organization',
      name: 'ViralSpark',
      url: 'https://viralspark.shop',
      logo: {
        '@type': 'ImageObject',
        url: 'https://viralspark.shop/logo-512.png',
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://twitter.com/viralsparkshop',
        'https://www.instagram.com/viralsparkshop',
        'https://www.linkedin.com/company/viralspark',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@viralspark.shop',
        availableLanguage: ['Turkish', 'English'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://viralspark.shop/#website',
      url: 'https://viralspark.shop',
      name: 'ViralSpark',
      description: 'Yapay zeka ile sosyal medya içerik üretici',
      publisher: { '@id': 'https://viralspark.shop/#organization' },
      inLanguage: ['tr-TR', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://viralspark.shop/blog?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://viralspark.shop/#software',
      name: 'ViralSpark',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
      url: 'https://viralspark.shop',
      description: 'AI-powered social media content generator for Twitter, Instagram, LinkedIn & TikTok with 14 specialized tools.',
      featureList: [
        'AI content generation',
        'Viral scoring',
        'Hashtag research',
        'Hook library',
        'Competitor analysis',
        'Content calendar',
        'A/B variations',
        'Brand profiles',
        'Multi-platform support',
      ],
      offers: [
        { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
        { '@type': 'Offer', price: '3', priceCurrency: 'USD', name: 'Starter' },
        { '@type': 'Offer', price: '10', priceCurrency: 'USD', name: 'Pro' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1',
      },
      publisher: { '@id': 'https://viralspark.shop/#organization' },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Preconnect to third-party origins to shave LCP */}
        <link rel="preconnect" href="https://clerk.viralspark.shop" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://clerk.viralspark.shop" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="manifest" href="/manifest.json" />
        {/* Lemon Squeezy overlay checkout — must load before any .lemonsqueezy-button is clicked */}
        <script src="https://assets.lemonsqueezy.com/lemon.js" defer />
        <meta name="theme-color" content="#0a0a0f" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <ThemeProvider>
          <ClerkProvider>
            <ErrorBoundary>
              <LanguageProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </LanguageProvider>
            </ErrorBoundary>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <LemonSqueezyOverlay />
        <PaddleLoader />
      </body>
    </html>
  )
}
