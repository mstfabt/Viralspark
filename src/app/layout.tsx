import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '@/components/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
  description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin. Twitter, Instagram, LinkedIn ve TikTok için viral içerikler.',
  keywords: ['sosyal medya', 'viral içerik', 'yapay zeka', 'içerik üretici', 'AI', 'twitter', 'instagram', 'linkedin', 'tiktok', 'hashtag', 'hook'],
  openGraph: {
    title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
    description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'ViralSpark',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
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
        <ClerkProvider>
          <ErrorBoundary>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  )
}
