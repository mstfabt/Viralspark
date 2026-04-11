import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ToastProvider } from '@/components/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { LanguageProvider } from '@/components/language-provider'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Inline script — runs before React hydrates to prevent FOUC / theme flash
const themeInitScript = `(function(){try{var t=localStorage.getItem('vs-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`

export const metadata: Metadata = {
  metadataBase: new URL('https://viralspark.shop'),
  alternates: {
    canonical: '/',
  },
  title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
  description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin. Twitter, Instagram, LinkedIn ve TikTok için viral içerikler.',
  keywords: ['sosyal medya', 'viral içerik', 'yapay zeka', 'içerik üretici', 'AI', 'twitter', 'instagram', 'linkedin', 'tiktok', 'hashtag', 'hook'],
  openGraph: {
    title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
    description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'ViralSpark',
    url: 'https://viralspark.shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
    description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: ['Uc_E6jAv_bKeNl4F9ZYHZGNQTBl0sw0457XsYNacf98', '1abRVCLuO5UxIBDIud1NIKBetzkqaXFHyUbpnEZ_fhM'],
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ViralSpark',
  applicationCategory: 'SocialMediaApplication',
  operatingSystem: 'Web',
  url: 'https://viralspark.shop',
  description: 'AI-powered social media content generator for Twitter, Instagram, LinkedIn & TikTok',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
    { '@type': 'Offer', price: '3', priceCurrency: 'USD', name: 'Starter' },
    { '@type': 'Offer', price: '10', priceCurrency: 'USD', name: 'Pro' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="manifest" href="/manifest.json" />
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
      </body>
    </html>
  )
}
