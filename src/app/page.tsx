'use client'

import { Show, useUser } from '@clerk/nextjs'
import { useState } from 'react'

const PLANS = {
  starter: {
    name: 'Baslangic',
    price: '₺30',
    description: 'Kucuk isletmeler icin.',
    features: [
      '50 Tek Platform Uretim / Ay',
      '20 Coklu Platform Uretim / Ay',
      '2 Icerik Takvimi (7 gun) / Ay',
      '1 Marka Profili',
      'Hook Kutuphanesi',
      'Hashtag Arastirma',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_STARTER_URL || '#',
  },
  pro: {
    name: 'Pro',
    price: '₺100',
    description: 'Profesyonel ureticiler icin.',
    features: [
      'Sinirsiz Icerik Uretimi',
      'Sinirsiz Coklu Platform',
      'A/B Varyasyonlari (3 versiyon)',
      'Sinirsiz Icerik Takvimi (30 gun)',
      '3 Marka Profili',
      'Rakip Analizi',
      'CSV Export',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_PRO_URL || '#',
    recommended: true,
  },
}

const FEATURES = [
  { title: 'Coklu Platform', desc: 'Tek konu, 4 platforma ozel icerik. Twitter, Instagram, LinkedIn, TikTok.', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  { title: 'Viral Skor', desc: 'Her icerigin viral potansiyelini 1-100 arasi puanla gorun.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { title: 'A/B Varyasyonlari', desc: 'Ayni konu icin 3 farkli versiyon uretin, en iyisini secin.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Hook Kutuphanesi', desc: '50+ kanitlanmis viral hook cumlesi. Kopyala ve kullan.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'Hashtag Arastirma', desc: 'AI destekli hashtag stratejisi. Trend, nis ve ana hashtagler.', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { title: 'Rakip Analizi', desc: 'Sektorunuzdeki stratejileri analiz edin, firsatlari kesfedin.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]

const TESTIMONIALS = [
  { name: 'Elif K.', role: 'Instagram Icerik Ureticisi', text: 'Gunluk 2 saat harcadigim icerik uretimini 5 dakikaya dusurdum. Viral skorlar gercekten ise yariyor!', avatar: 'EK' },
  { name: 'Ahmet Y.', role: 'Dijital Pazarlama Uzmani', text: 'Musterilerim icin coklu platform ozelligini cok sevdim. Tek konu, 4 farkli icerik. Muhtesem.', avatar: 'AY' },
  { name: 'Selin D.', role: 'E-Ticaret Girisimcisi', text: 'Hashtag arastirma araci sayesinde erisimim %300 artti. Kesinlikle Pro plana gecmenizi oneririm.', avatar: 'SD' },
]

const STATS = [
  { value: '10,000+', label: 'Uretilen Icerik' },
  { value: '2,500+', label: 'Mutlu Kullanici' },
  { value: '4', label: 'Platform Destegi' },
  { value: '%85', label: 'Ort. Viral Skor' },
]

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
      } else if (data.result) {
        const first = Object.values(data.result)[0] as { text: string } | { text: string }[]
        setGeneratedText(Array.isArray(first) ? first[0].text : first.text)
      } else {
        setGeneratedText(data.error || 'Bir hata olustu.')
      }
    } catch {
      setGeneratedText('Sunucuya baglanilamadi.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">ViralSpark.</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-black transition-colors">Ozellikler</a>
            <a href="#demo" className="hover:text-black transition-colors">Yapay Zeka</a>
            <a href="#testimonials" className="hover:text-black transition-colors">Yorumlar</a>
            <a href="#pricing" className="hover:text-black transition-colors">Fiyatlandirma</a>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <a href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-black transition-colors hidden sm:block">
                Giris Yap
              </a>
              <a href="/sign-up" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Ucretsiz Basla
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

      {/* Hero */}
      <main className="pt-32 md:pt-40 pb-16 px-4 md:px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          2,500+ icerik ureticisi ViralSpark kullaniyor
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-black">
          Fikirlerinizi <br className="hidden md:block" />
          <span className="text-gray-400">virale donusturun.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Yapay zeka gucuyle saniyeler icinde etkilesimi yuksek icerikler uretin. Sosyal medyada buyumek artik cok daha kolay.
        </p>
      </main>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="max-w-4xl mx-auto px-4 md:px-6 pb-24 z-10 relative">
        <div className="bg-white p-6 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <h2 className="text-2xl font-semibold mb-8 text-center tracking-tight">Hemen Ucretsiz Deneyin</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <textarea
              className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
              rows={3}
              placeholder="Orn: Yeni actigim butik kahveci icin Instagram postu yaz..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? 'Yapay Zeka Uretiyor...' : 'Viral Gonderi Uret'}
            </button>

            {generatedText && (
              <div className="mt-8 p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Sonuc:</h3>
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base md:text-lg">{generatedText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Tek platformda her sey.</h2>
            <p className="text-lg text-gray-500 font-light">Sosyal medya icin ihtiyaciniz olan tum araclar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Kullanicilar ne diyor?</h2>
            <p className="text-lg text-gray-500 font-light">Binlerce icerik ureticisi ViralSpark'a gueveniyor.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex gap-1 mt-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Sade ve seffaf fiyatlandirma.</h2>
            <p className="text-lg md:text-xl text-gray-500 font-light">Ihtiyaciniza uygun plani secin, hemen baslayin.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">{PLANS.starter.name}</h3>
              <p className="text-gray-500 mb-6 font-light">{PLANS.starter.description}</p>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold tracking-tight">{PLANS.starter.price}</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-3 mb-10 text-gray-600 font-light text-sm">
                {PLANS.starter.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors text-center">Ucretsiz Basla</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLANS.starter.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors text-center">Sec</a>
              </Show>
            </div>

            {/* Pro */}
            <div className="bg-black text-white p-8 md:p-10 rounded-[2rem] shadow-xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Onerilen
              </div>
              <h3 className="text-2xl font-semibold mb-2">{PLANS.pro.name}</h3>
              <p className="text-gray-400 mb-6 font-light">{PLANS.pro.description}</p>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold tracking-tight">{PLANS.pro.price}</span>
                <span className="text-gray-400">/ay</span>
              </div>
              <ul className="space-y-3 mb-10 text-gray-300 font-light text-sm">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors text-center">Ucretsiz Basla</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLANS.pro.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors text-center">Hemen Basla</a>
              </Show>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Viral iceriklere baslayin.</h2>
          <p className="text-lg text-gray-500 mb-8 font-light">Ucretsiz plan ile hemen deneyin. Kredi karti gerekmez.</p>
          <Show when="signed-out">
            <a href="/sign-up" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
              Ucretsiz Basla
            </a>
          </Show>
          <Show when="signed-in">
            <a href="/dashboard" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
              Dashboard'a Git
            </a>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 ViralSpark. Tum haklari saklidir.</p>
      </footer>
    </div>
  )
}
