import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'ViralSpark - Yapay Zeka ile Viral İçerik Üretin',
  description: 'Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek sosyal medya içerikleri üretin.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
