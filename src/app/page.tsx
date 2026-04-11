'use client'

import { Show, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const PLAN_KEYS = {
  starter: {
    nameKey: 'pricing.starter',
    descKey: 'pricing.starter.desc',
    featureKeys: [
      'pricing.starter.f1', 'pricing.starter.f2', 'pricing.starter.f3',
      'pricing.starter.f4', 'pricing.starter.f5', 'pricing.starter.f6',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_STARTER_URL || process.env.NEXT_PUBLIC_GUMROAD_STARTER_URL || '#',
  },
  pro: {
    nameKey: 'pricing.pro',
    descKey: 'pricing.pro.desc',
    featureKeys: [
      'pricing.pro.f1', 'pricing.pro.f2', 'pricing.pro.f3', 'pricing.pro.f4',
      'pricing.pro.f5', 'pricing.pro.f6', 'pricing.pro.f7',
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_LS_PRO_URL || process.env.NEXT_PUBLIC_GUMROAD_PRO_URL || '#',
    recommended: true,
  },
}

const FEATURE_KEYS = [
  { titleKey: 'feature.multiplatform', descKey: 'feature.multiplatform.desc', href: '/dashboard', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  { titleKey: 'feature.score', descKey: 'feature.score.desc', href: '/dashboard', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { titleKey: 'feature.ab', descKey: 'feature.ab.desc', href: '/dashboard', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { titleKey: 'feature.hooks', descKey: 'feature.hooks.desc', href: '/dashboard/hooks', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { titleKey: 'feature.hashtags', descKey: 'feature.hashtags.desc', href: '/dashboard/hashtags', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { titleKey: 'feature.competitor', descKey: 'feature.competitor.desc', href: '/dashboard/competitor', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { titleKey: 'feature.thread', descKey: 'feature.thread.desc', href: '/dashboard/thread', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { titleKey: 'feature.urltopost', descKey: 'feature.urltopost.desc', href: '/dashboard/url-to-post', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { titleKey: 'feature.bio', descKey: 'feature.bio.desc', href: '/dashboard/bio', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { titleKey: 'feature.reply', descKey: 'feature.reply.desc', href: '/dashboard/reply', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  { titleKey: 'feature.rewrite', descKey: 'feature.rewrite.desc', href: '/dashboard/rewrite', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { titleKey: 'feature.bulk', descKey: 'feature.bulk.desc', href: '/dashboard/bulk', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { titleKey: 'feature.favorites', descKey: 'feature.favorites.desc', href: '/dashboard/favorites', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { titleKey: 'feature.improver', descKey: 'feature.improver.desc', href: '/dashboard/improve', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
]

const FAQ_TR = [
  {
    q: 'ViralSpark nedir ve nasıl çalışır?',
    a: 'ViralSpark, yapay zeka destekli bir sosyal medya içerik üreticisidir. Twitter, Instagram, LinkedIn ve TikTok için saniyeler içinde viral potansiyeli yüksek gönderiler, başlıklar, hashtag\'ler ve hook cümleleri üretir. Bir konu yazın, platform seçin — AI sizin için içeriği hazırlasın.',
  },
  {
    q: 'ViralSpark ücretsiz mi?',
    a: 'Evet, ücretsiz planımız mevcuttur. Her ay 5 içerik üretebilirsiniz. Daha fazla içerik, A/B varyasyonlar, içerik takvimi ve markalama özellikleri için Starter (₺30/ay) veya Pro (₺100/ay) planlarına geçebilirsiniz.',
  },
  {
    q: 'Hangi sosyal medya platformlarını destekliyor?',
    a: 'Twitter/X, Instagram, LinkedIn ve TikTok desteklenen ana platformlardır. Her platforma özel karakter limiti, ton ve format optimizasyonu yapılır.',
  },
  {
    q: 'Yapay zeka ile üretilen içerikler özgün mü?',
    a: 'Evet. ViralSpark, her içeriği sizin konunuza ve marka sesinize göre sıfırdan üretir. Marka Profilinizi oluşturduğunuzda tüm içerikler sizin tarzınıza uygun olur. Üretilen içeriklerin telif hakkı size aittir.',
  },
  {
    q: 'Viral skoru nedir ve nasıl hesaplanır?',
    a: 'Viral skor, her içeriğin viral olma potansiyelini 1-100 arasında puanlayan bir metriktir. Hook gücü, etkileşim potansiyeli, hashtag kalitesi, platform uyumu ve içerik uzunluğu gibi faktörler analiz edilir. Yüksek skor, içeriğin daha çok etkileşim alma ihtimalinin yüksek olduğunu gösterir.',
  },
  {
    q: 'Türkçe ve İngilizce içerik üretebilir miyim?',
    a: 'Evet, ViralSpark Türkçe ve İngilizce dillerinde tam destek sunar. Dil seçicisinden dili değiştirebilir, her iki dilde de yüksek kaliteli içerikler üretebilirsiniz.',
  },
  {
    q: 'Hangi AI araçlarını içeriyor?',
    a: 'ViralSpark 14 farklı AI aracı sunar: İçerik Üretici, Viral Skorlama, A/B Varyasyonlar, Hook Kütüphanesi, Hashtag Araştırma, Rakip Analizi, İçerik Takvimi, Thread/Carousel Üretici, URL→Post, Bio Üretici, Yanıt Üretici, İçerik Yeniden Yazma, Toplu Üretim, Favori Yönetimi.',
  },
  {
    q: 'Aboneliğimi nasıl iptal edebilirim?',
    a: 'Aboneliğinizi istediğiniz zaman Dashboard → Fatura sayfasından veya ödeme sağlayıcınızın müşteri portalından iptal edebilirsiniz. İptal ettiğinizde mevcut fatura dönemi sonuna kadar planınızdan yararlanmaya devam edersiniz.',
  },
  {
    q: 'ViralSpark hangi yapay zeka modelini kullanıyor?',
    a: 'ViralSpark, Google\'ın en yeni ve en hızlı modeli olan Gemini 2.5 Flash ile çalışır. Bu sayede içerik üretimi hem hızlı hem de yüksek kalitelidir.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: 'Kredi kartı, banka kartı ve Apple Pay / Google Pay desteği mevcuttur. Tüm ödemeler Lemon Squeezy üzerinden güvenli bir şekilde işlenir. Türkiye için TRY, uluslararası için USD fiyatlandırma yapılır.',
  },
]

const FAQ_EN = [
  {
    q: 'What is ViralSpark and how does it work?',
    a: 'ViralSpark is an AI-powered social media content generator. It creates high-viral-potential posts, captions, hashtags, and hook sentences for Twitter, Instagram, LinkedIn, and TikTok in seconds. Just type a topic, pick a platform — AI handles the rest.',
  },
  {
    q: 'Is ViralSpark free?',
    a: 'Yes, we have a free plan. You can generate 5 posts per month. For more content, A/B variations, content calendar, and branding features, you can upgrade to Starter ($3/mo) or Pro ($10/mo).',
  },
  {
    q: 'Which social media platforms are supported?',
    a: 'Twitter/X, Instagram, LinkedIn, and TikTok are the main supported platforms. Each platform gets optimized character limits, tone, and format.',
  },
  {
    q: 'Is AI-generated content original?',
    a: 'Yes. ViralSpark generates every piece of content from scratch based on your topic and brand voice. When you set up your Brand Profile, all content matches your style. The copyright of generated content belongs to you.',
  },
  {
    q: 'What is the Viral Score and how is it calculated?',
    a: 'The Viral Score is a metric that rates each piece of content\'s viral potential on a 1-100 scale. Factors like hook strength, engagement potential, hashtag quality, platform fit, and content length are analyzed. Higher scores indicate a better chance of high engagement.',
  },
  {
    q: 'Can I generate content in Turkish and English?',
    a: 'Yes, ViralSpark fully supports both Turkish and English. You can switch languages from the selector and generate high-quality content in either language.',
  },
  {
    q: 'What AI tools are included?',
    a: 'ViralSpark offers 14 AI tools: Content Generator, Viral Scoring, A/B Variations, Hook Library, Hashtag Research, Competitor Analysis, Content Calendar, Thread/Carousel Builder, URL→Post, Bio Generator, Reply Composer, Content Rewriter, Bulk Generation, Favorites Management.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel your subscription anytime from Dashboard → Billing or your payment provider\'s customer portal. Upon cancellation, you\'ll keep using your plan until the end of the current billing period.',
  },
  {
    q: 'Which AI model does ViralSpark use?',
    a: 'ViralSpark is powered by Google\'s latest and fastest model, Gemini 2.5 Flash. This ensures content generation is both fast and high-quality.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We support credit cards, debit cards, and Apple Pay / Google Pay. All payments are securely processed through Lemon Squeezy. TRY pricing for Turkey, USD for international.',
  },
]

const TESTIMONIALS_DATA = {
  tr: [
    { name: 'Elif K.', role: 'Instagram Icerik Ureticisi', text: 'Gunluk 2 saat harcadigim icerik uretimini 5 dakikaya dusurdum. Viral skorlar gercekten ise yariyor!', avatar: 'EK' },
    { name: 'Ahmet Y.', role: 'Dijital Pazarlama Uzmani', text: 'Musterilerim icin coklu platform ozelligini cok sevdim. Tek konu, 4 farkli icerik. Muhtesem.', avatar: 'AY' },
    { name: 'Selin D.', role: 'E-Ticaret Girisimcisi', text: 'Hashtag arastirma araci sayesinde erisimim %300 artti. Kesinlikle Pro plana gecmenizi oneririm.', avatar: 'SD' },
  ],
  en: [
    { name: 'Sarah M.', role: 'Instagram Content Creator', text: 'Cut my daily content creation from 2 hours to 5 minutes. Viral scores really work!', avatar: 'SM' },
    { name: 'James R.', role: 'Digital Marketing Specialist', text: 'Love the multi-platform feature for my clients. One topic, 4 different posts. Amazing.', avatar: 'JR' },
    { name: 'Emily D.', role: 'E-Commerce Entrepreneur', text: 'My reach grew 300% thanks to the hashtag research tool. Definitely recommend the Pro plan.', avatar: 'ED' },
  ],
}

function getCheckoutUrl(baseUrl: string, userId: string | undefined) {
  if (!userId || baseUrl === '#') return baseUrl
  // Gumroad uses ?user_id= , LemonSqueezy uses ?checkout[custom][user_id]=
  if (baseUrl.includes('gumroad.com')) {
    return `${baseUrl}?user_id=${userId}`
  }
  return `${baseUrl}?checkout[custom][user_id]=${userId}`
}

export default function Home() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const [topic, setTopic] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const faqs = isEn ? FAQ_EN : FAQ_TR
  // FAQPage JSON-LD — Google uses this for featured snippets.
  // We emit the Turkish version (site default) since SSR renders TR.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_TR.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  const STATS = [
    { value: '10,000+', label: t('stats.content') },
    { value: '14', label: isEn ? 'AI Tools' : 'AI Araç' },
    { value: '4', label: t('stats.platforms') },
    { value: '%85', label: t('stats.score') },
  ]

  const testimonials = TESTIMONIALS_DATA[locale]

  const starterFeatures = locale === 'en'
    ? ['50 Single Platform / Month', '20 Multi-Platform / Month', '2 Content Calendar (7 days) / Month', '1 Brand Profile', 'Hook Library', 'Hashtag Research', 'Bio Generator', 'Reply Generator']
    : ['50 Tek Platform Uretim / Ay', '20 Coklu Platform Uretim / Ay', '2 Icerik Takvimi (7 gun) / Ay', '1 Marka Profili', 'Hook Kutuphanesi', 'Hashtag Arastirma', 'Bio Olusturucu', 'Yanit Olusturucu']

  const proFeatures = locale === 'en'
    ? ['All 14 AI Tools Included', 'Unlimited Content Generation', 'Unlimited Multi-Platform', 'A/B Variations (3 versions)', 'Unlimited Content Calendar (30 days)', '3 Brand Profiles', 'Competitor Analysis', 'Thread/Carousel Generator', 'URL to Post', 'Tone Rewriter & Bulk Generator', 'Content Improver & Favorites', 'CSV Export']
    : ['14 AI Araci Dahil', 'Sinirsiz Icerik Uretimi', 'Sinirsiz Coklu Platform', 'A/B Varyasyonlari (3 versiyon)', 'Sinirsiz Icerik Takvimi (30 gun)', '3 Marka Profili', 'Rakip Analizi', 'Thread/Carousel Olusturucu', 'URL\u2192Post', 'Ton Degistirici & Toplu Uretim', 'Icerik Iyilestirici & Favoriler', 'CSV Export']

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
        body: JSON.stringify({ prompt: topic, lang: locale }),
      })
      const data = await res.json()
      if (data.limitReached) {
        setGeneratedText(data.error)
      } else if (data.result) {
        const first = Object.values(data.result)[0] as { text: string } | { text: string }[]
        setGeneratedText(Array.isArray(first) ? first[0].text : first.text)
      } else {
        setGeneratedText(data.error || t('common.error'))
      }
    } catch {
      setGeneratedText(t('common.error'))
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a] text-black dark:text-white font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#13131a]/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500 dark:text-[#a1a1aa]">
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.features')}</a>
            <a href="#demo" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.ai')}</a>
            <a href="#testimonials" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.reviews')}</a>
            <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.pricing')}</a>
            <a href="#faq" className="hover:text-black dark:hover:text-white transition-colors">{isEn ? 'FAQ' : 'SSS'}</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle surface="adaptive" />
            <LanguageSelector />
            <Show when="signed-out">
              <a href="/sign-in" className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors hidden sm:block">
                {t('nav.signin')}
              </a>
              <a href="/sign-up" className="text-sm font-semibold brand-grad brand-shadow-sm px-5 py-2 rounded-full">
                {t('nav.start')}
              </a>
            </Show>
            <Show when="signed-in">
              <a href="/dashboard" className="text-sm font-semibold brand-grad brand-shadow-sm px-5 py-2 rounded-full">
                {t('nav.dashboard')}
              </a>
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 md:pt-40 pb-16 px-4 md:px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block bg-white/70 backdrop-blur-md border border-pink-100 text-[#d62976] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
          {t('hero.badge')}
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-black dark:text-white">
          {t('hero.title1')} <br className="hidden md:block" />
          <span className="brand-text">{t('hero.title2')}</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-500 dark:text-[#a1a1aa] mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          {t('hero.desc')}
        </p>
      </main>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-[#a1a1aa] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="max-w-4xl mx-auto px-4 md:px-6 pb-24 z-10 relative">
        <div className="bg-white dark:bg-[#13131a] p-6 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
          <h2 className="text-2xl font-semibold mb-8 text-center tracking-tight">{t('demo.title')}</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <textarea
              className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
              rows={3}
              placeholder={t('demo.placeholder')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('demo.loading') : t('demo.button')}
            </button>

            {generatedText && (
              <>
                <div className="mt-8 p-6 md:p-8 bg-gray-50 dark:bg-[#1a1a22] rounded-2xl border border-gray-100 dark:border-[#27272a]">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-[#71717a] mb-4 uppercase tracking-widest">{t('demo.result')}</h3>
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-[#e5e5e5] leading-relaxed text-base md:text-lg">{generatedText}</p>
                </div>
                <Show when="signed-out">
                  <div className="mt-4 text-center">
                    <a
                      href="/sign-up"
                      className="inline-block brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm"
                    >
                      {isEn ? 'Sign up free to generate unlimited content' : 'Sinirsiz icerik uretmek icin ucretsiz kaydolun'}
                    </a>
                  </div>
                </Show>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-[#1a1a22] border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('features.title')}</h2>
            <p className="text-lg text-gray-500 dark:text-[#a1a1aa] font-light">{t('features.desc')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_KEYS.map((f) => (
              <a key={f.titleKey} href={f.href} className="block bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] hover:shadow-md hover:border-gray-200 dark:hover:border-[#3f3f46] transition-all">
                <div className="w-10 h-10 brand-grad brand-shadow-sm rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-gray-500 dark:text-[#a1a1aa] leading-relaxed">{t(f.descKey)}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('testimonials.title')}</h2>
            <p className="text-lg text-gray-500 dark:text-[#a1a1aa] font-light">{t('testimonials.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 brand-grad rounded-full flex items-center justify-center text-sm font-bold">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1aa]">{item.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-[#a1a1aa] leading-relaxed">&ldquo;{item.text}&rdquo;</p>
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
      <section id="pricing" className="py-24 md:py-32 bg-gray-50 dark:bg-[#1a1a22] border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('pricing.title')}</h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-[#a1a1aa] font-light">{t('pricing.desc')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="bg-white dark:bg-[#13131a] p-8 md:p-10 rounded-[2rem] border border-gray-100 dark:border-[#27272a] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">{t('pricing.starter')}</h3>
              <p className="text-gray-500 dark:text-[#a1a1aa] mb-6 font-light">{t('pricing.starter.desc')}</p>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold tracking-tight">{locale === 'en' ? '$3' : '₺30'}</span>
                <span className="text-gray-500 dark:text-[#a1a1aa]">{t('pricing.mo')}</span>
              </div>
              <ul className="space-y-3 mb-10 text-gray-600 dark:text-[#a1a1aa] font-light text-sm">
                {starterFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-gray-100 dark:bg-[#1f1f26] font-medium hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors text-center">{t('nav.start')}</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLAN_KEYS.starter.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-gray-100 dark:bg-[#1f1f26] font-medium hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors text-center">{t('pricing.select')}</a>
              </Show>
            </div>

            {/* Pro */}
            <div className="brand-grad brand-shadow-lg p-8 md:p-10 rounded-[2rem] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#13131a] text-[#d62976] px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                {t('pricing.recommended')}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{t('pricing.pro')}</h3>
              <p className="text-white/85 mb-6 font-light">{t('pricing.pro.desc')}</p>
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold tracking-tight">{locale === 'en' ? '$10' : '₺100'}</span>
                <span className="text-white/70">{t('pricing.mo')}</span>
              </div>
              <ul className="space-y-3 mb-10 text-white/90 font-light text-sm">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block w-full py-4 rounded-full bg-white dark:bg-[#13131a] text-[#d62976] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f1f26] transition-colors text-center shadow-lg">{t('nav.start')}</a>
              </Show>
              <Show when="signed-in">
                <a href={getCheckoutUrl(PLAN_KEYS.pro.checkoutUrl, user?.id)} className="block w-full py-4 rounded-full bg-white dark:bg-[#13131a] text-[#d62976] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f1f26] transition-colors text-center shadow-lg">{t('pricing.go')}</a>
              </Show>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12 text-sm text-gray-500 dark:text-[#a1a1aa]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{isEn ? '14-day money-back guarantee' : '14 gun para iade garantisi'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{isEn ? 'Cancel anytime' : 'Istediginiz zaman iptal edin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{isEn ? 'Secure payment via Lemon Squeezy' : 'Lemon Squeezy ile guvenli odeme'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How does the AI content generation work?', acceptedAnswer: { '@type': 'Answer', text: 'ViralSpark uses advanced AI (Google Gemini) to analyze your topic, brand voice, and target platform to generate optimized social media content with hashtags, hooks, and engagement strategies.' } },
              { '@type': 'Question', name: 'Which social media platforms are supported?', acceptedAnswer: { '@type': 'Answer', text: 'We support Twitter/X, Instagram, LinkedIn, and TikTok. Each platform gets content optimized for its unique format, character limits, and audience behavior.' } },
              { '@type': 'Question', name: 'Can I try it for free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Free plan includes 5 content generations per month. No credit card required to get started.' } },
              { '@type': 'Question', name: "What's included in the Pro plan?", acceptedAnswer: { '@type': 'Answer', text: 'Pro plan gives you unlimited content generation, competitor analysis, content calendar, brand voice customization, visual content creation, and priority support.' } },
              { '@type': 'Question', name: 'Can I cancel my subscription anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. You can cancel anytime from your account settings. No long-term contracts or hidden fees.' } },
              { '@type': 'Question', name: 'Is the generated content unique?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, every piece of content is uniquely generated based on your specific inputs. The AI creates original content tailored to your brand and audience.' } },
            ],
          }),
        }}
      />

      {/* FAQ */}
      <section className="py-24 border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular'}
            </h2>
            <p className="text-lg text-gray-500 dark:text-[#a1a1aa] font-light">
              {isEn ? 'Everything you need to know about ViralSpark' : 'ViralSpark hakkında merak ettikleriniz'}
            </p>
          </div>
          <div className="space-y-4">
            {(isEn ? [
              { q: 'How does the AI content generation work?', a: 'ViralSpark uses advanced AI (Google Gemini) to analyze your topic, brand voice, and target platform to generate optimized social media content with hashtags, hooks, and engagement strategies.' },
              { q: 'Which social media platforms are supported?', a: 'We support Twitter/X, Instagram, LinkedIn, and TikTok. Each platform gets content optimized for its unique format, character limits, and audience behavior.' },
              { q: 'Can I try it for free?', a: 'Yes! Free plan includes 5 content generations per month. No credit card required to get started.' },
              { q: 'What\'s included in the Pro plan?', a: 'Pro plan gives you unlimited content generation, competitor analysis, content calendar, brand voice customization, visual content creation, and priority support.' },
              { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. You can cancel anytime from your account settings. No long-term contracts or hidden fees.' },
              { q: 'Is the generated content unique?', a: 'Yes, every piece of content is uniquely generated based on your specific inputs. The AI creates original content tailored to your brand and audience.' },
            ] : [
              { q: 'Yapay zeka içerik üretimi nasıl çalışıyor?', a: 'ViralSpark, konunuzu, marka sesinizi ve hedef platformunuzu analiz ederek optimize edilmiş sosyal medya içerikleri üretmek için gelişmiş yapay zeka (Google Gemini) kullanır.' },
              { q: 'Hangi sosyal medya platformları destekleniyor?', a: 'Twitter/X, Instagram, LinkedIn ve TikTok desteklenmektedir. Her platform için benzersiz format, karakter limiti ve kitle davranışına göre optimize edilmiş içerik üretilir.' },
              { q: 'Ücretsiz deneyebilir miyim?', a: 'Evet! Ücretsiz plan aylık 5 içerik üretimi içerir. Başlamak için kredi kartı gerekmez.' },
              { q: 'Pro planda neler var?', a: 'Pro plan sınırsız içerik üretimi, rakip analizi, içerik takvimi, marka sesi özelleştirme, görsel içerik oluşturma ve öncelikli destek sunar.' },
              { q: 'Aboneliğimi istediğim zaman iptal edebilir miyim?', a: 'Kesinlikle. Hesap ayarlarınızdan istediğiniz zaman iptal edebilirsiniz. Uzun vadeli sözleşme veya gizli ücret yoktur.' },
              { q: 'Üretilen içerikler özgün mü?', a: 'Evet, her içerik sizin girdilerinize göre benzersiz olarak üretilir. Yapay zeka, markanıza ve kitlenize özel orijinal içerikler oluşturur.' },
            ]).map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-[#13131a] border border-gray-100 dark:border-[#27272a] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-medium hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-400 dark:text-[#71717a] group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-500 dark:text-[#a1a1aa] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{t('cta.title')}</h2>
          <p className="text-lg text-gray-500 dark:text-[#a1a1aa] mb-8 font-light">{t('cta.desc')}</p>
          <Show when="signed-out">
            <a href="/sign-up" className="inline-block brand-grad brand-shadow px-8 py-4 rounded-full font-semibold text-lg">
              {t('nav.start')}
            </a>
          </Show>
          <Show when="signed-in">
            <a href="/dashboard" className="inline-block brand-grad brand-shadow px-8 py-4 rounded-full font-semibold text-lg">
              {t('nav.dashboard')}
            </a>
          </Show>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-t border-gray-100 dark:border-[#27272a]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular'}
            </h2>
            <p className="text-gray-500 dark:text-[#a1a1aa] text-lg">
              {isEn
                ? 'Everything you need to know about ViralSpark.'
                : 'ViralSpark hakkında bilmeniz gereken her şey.'}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-[#27272a] rounded-2xl overflow-hidden bg-white dark:bg-[#13131a] transition-all hover:border-gray-300 dark:hover:border-[#3f3f46]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.q}
                    </h3>
                    <svg
                      className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-gray-600 dark:text-[#a1a1aa] leading-relaxed text-sm md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 dark:text-[#a1a1aa]">
              {isEn ? 'Still have questions?' : 'Başka sorularınız mı var?'}{' '}
              <a href="/contact" className="brand-text font-semibold hover:underline">
                {isEn ? 'Contact us' : 'Bizimle iletişime geçin'}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="py-20 bg-gray-50 dark:bg-[#1a1a22] border-t border-gray-100 dark:border-[#27272a]">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{t('lead.title')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('lead.desc')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const email = (form.elements.namedItem('email') as HTMLInputElement).value
              if (email) {
                fetch('/api/lead', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                })
                form.reset()
                alert(t('lead.thanks'))
              }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              name="email"
              type="email"
              required
              placeholder={t('lead.placeholder')}
              className="flex-1 px-5 py-3 rounded-full border border-gray-200 dark:border-[#27272a] focus:outline-none focus:ring-2 focus:ring-[#d62976] text-sm"
            />
            <button type="submit" className="brand-grad brand-shadow-sm px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap">
              {t('lead.button')}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-[#27272a] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size={28} showText={false} />
              <p className="text-gray-500 dark:text-[#a1a1aa] text-sm">&copy; {t('footer.rights')}</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 dark:text-[#71717a] flex-wrap justify-center">
              <a href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="/terms" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="/refund" className="hover:text-black dark:hover:text-white transition-colors">{isEn ? 'Refund' : 'Iade'}</a>
              <a href="/blog" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.blog')}</a>
              <a href="/contact" className="hover:text-black dark:hover:text-white transition-colors">{isEn ? 'Contact' : 'İletişim'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
