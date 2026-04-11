import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - ViralSpark',
  description: 'Get in touch with the ViralSpark team. We\'d love to hear from you.',
  openGraph: {
    title: 'Contact - ViralSpark',
    description: 'Get in touch with the ViralSpark team.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
