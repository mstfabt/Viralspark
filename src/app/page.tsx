'use client'

import { Show, useUser } from '@clerk/nextjs'
import { useState } from 'react'

const PLANS = {
  starter: {
    name: 'Başlangıç',
    price: '₺30',
    description: 'Küçük işletmeler için.',
    features: [
      '50 Tek Platform Üretim / Ay',
      '20 Çoklu Platform Üretim / Ay',
      '2 İçerik Takvimi (7 gün) / Ay',
      '1 Marka Profili',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_STARTER_URL || '#',
  },
  pro: {
    name: 'Pro',
    price: '₺100',
    description: 'Profesyonel üreticiler için.',
    features: [
      'Sınırsız İçerik Üretimi',
      'Sınırsız Çoklu Platform',
      'Sınırsız İçerik Takvimi (30 gün)',
      '3 Marka Profili',
      'CSV Export',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_PRO_URL || '#',
    recommended: true,
  },
}

function getCheckoutUrl(baseUrl: string, userId: string | undefined) {
  if (!userId || baseUrl === '#') return baseUrl
  return `${baseUrl}?checkout[custom][user_id]=${userId}`
}

export default function Home() {
  const { user } = useUser()
  const [topic, setTopic] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!topic) return
    if (!user) {
      window.location.href = '/sign-up'
      return
    }
    setIsLoading(true)
    setGeneratedText('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic }),
      })
      const data = await res.json()
      if (data.limitReached) {
        setGeneratedText(data.error)
      } else {
        setGeneratedText(data.result || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch {
      setGeneratedText('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">ViralSpark.</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-black transition-colors">Özellikler</a>
            <a href="#demo" className="hover:text-black transition-colors">Yapay Zeka</a>
            <a href="#pricing" className="hover:text-black transition-colors">Fiyatlandırma</a>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <a href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Giriş Yap
              </a>
              <a href="/sign-up" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Ücretsiz Başla
              </a>
            </Show>
            <Show when="signed-in">
              <a href="/dashboard" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Dashboard
              </a>
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-16 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-black">
          Fikirlerinizi <br className="hidden md:block" />
          <span className="text-gray-400">virale dönüştürün.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek içerikler üretin. Sosyal medyada büyümek artık çok daha kolay, çok daha zarif.
        </p>
      </main>

      {/* Generator Tool Section */}
      <section id="demo" className="max-w-4xl mx-auto px-6 pb-24 z-10 relative">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <h2 className="text-2xl font-semibold mb-8 text-center tracking-tight">Hemen Ücretsiz Deneyin</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <textarea
              className="w-full p-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
              rows={3}
              placeholder="Örn: Yeni açtığım butik kahveci için Instagram postu yaz..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? 'Yapay Zeka Üretiyor...' : 'Viral Gönderi Üret'}
            </button>

            {generatedText && (
              <div className="mt-8 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Sonuç:</h3>
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">{generatedText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Sade ve şeffaf fiyatlandırma.</h2>
            <p className="text-xl text-gray-500 font-light">İhtiyacınıza uygun planı seçin, hemen başlayın.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">{PLANS.starter.name}</h3>
              <p className="text-gray-500 mb-6 font-light">{PLANS.starter.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">{PLANS.starter.price}</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-600 font-light">
                {PLANS.starter.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors text-center">Ücretsiz Başla</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLANS.starter.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors text-center">Seç</a>
              </Show>
            </div>

            {/* Pro */}
            <div className="bg-black text-white p-10 rounded-[2rem] shadow-xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Önerilen
              </div>
              <h3 className="text-2xl font-semibold mb-2">{PLANS.pro.name}</h3>
              <p className="text-gray-400 mb-6 font-light">{PLANS.pro.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">{PLANS.pro.price}</span>
                <span className="text-gray-400">/ay</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-300 font-light">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors text-center">Ücretsiz Başla</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLANS.pro.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors text-center">Hemen Başla</a>
              </Show>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 ViralSpark. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
