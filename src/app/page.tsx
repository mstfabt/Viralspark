'use client'

import { Show, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'

const PADDLE_STARTER_PRICE = process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || ''
const PADDLE_PRO_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || ''
const USE_PADDLE = !!PADDLE_STARTER_PRICE

const PLAN_KEYS = {
  starter: {
    nameKey: 'pricing.starter',
    descKey: 'pricing.starter.desc',
    checkoutUrl: process.env.NEXT_PUBLIC_LS_STARTER_URL || process.env.NEXT_PUBLIC_GUMROAD_STARTER_URL || '#',
  },
  pro: {
    nameKey: 'pricing.pro',
    descKey: 'pricing.pro.desc',
    checkoutUrl: process.env.NEXT_PUBLIC_LS_PRO_URL || process.env.NEXT_PUBLIC_GUMROAD_PRO_URL || '#',
    recommended: true,
  },
}

function openPaddleCheckout(priceId: string, userId: string | undefined) {
  if (!window.Paddle || !priceId) return
  window.Paddle.Checkout.open({
    settings: { displayMode: 'overlay', theme: 'dark' },
    customData: userId ? { user_id: userId } : {},
    items: [{ priceId, quantity: 1 }],
  })
}

// Remaining features (the top 4 are promoted to sticky spotlights below).
const FEATURE_GRID = [
  { titleKey: 'feature.hashtags', descKey: 'feature.hashtags.desc', href: '/tools/hashtag-arac' },
  { titleKey: 'feature.competitor', descKey: 'feature.competitor.desc', href: '/blog/viral-icerik-nasil-uretilir' },
  { titleKey: 'feature.thread', descKey: 'feature.thread.desc', href: '/tools/tweet-uretici' },
  { titleKey: 'feature.urltopost', descKey: 'feature.urltopost.desc', href: '/blog/viral-icerik-nasil-uretilir' },
  { titleKey: 'feature.bio', descKey: 'feature.bio.desc', href: '/tools/linkedin-post-yazici' },
  { titleKey: 'feature.reply', descKey: 'feature.reply.desc', href: '/tools/hook-kutuphanesi' },
  { titleKey: 'feature.rewrite', descKey: 'feature.rewrite.desc', href: '/tools/instagram-caption-olusturucu' },
  { titleKey: 'feature.bulk', descKey: 'feature.bulk.desc', href: '/tools/tiktok-aciklama-olusturucu' },
  { titleKey: 'feature.favorites', descKey: 'feature.favorites.desc', href: '/blog' },
  { titleKey: 'feature.improver', descKey: 'feature.improver.desc', href: '/tools/hook-kutuphanesi' },
]

const TOOLS_GALLERY = [
  { href: '/tools/instagram-caption-olusturucu', nameKey: { tr: 'Instagram Caption', en: 'Instagram Caption' }, descKey: { tr: 'Yüksek etkileşimli caption\'lar, emoji ve hashtag önerileriyle.', en: 'High-engagement captions with emojis and trending tags.' }, color: 'text-pink-400' },
  { href: '/tools/tweet-uretici', nameKey: { tr: 'Tweet Üretici', en: 'Tweet Generator' }, descKey: { tr: 'X için kısa, vurucu tweet ve thread\'ler — viral potansiyelli.', en: 'Punchy, viral-optimized tweets and threads for X.' }, color: 'text-blue-400' },
  { href: '/tools/linkedin-post-yazici', nameKey: { tr: 'LinkedIn Post', en: 'LinkedIn Post' }, descKey: { tr: 'Profesyonel ama etkileşim çeken thought leadership postları.', en: 'Professional yet engaging thought leadership posts.' }, color: 'text-purple-400' },
  { href: '/tools/tiktok-aciklama-olusturucu', nameKey: { tr: 'TikTok Açıklama', en: 'TikTok Description' }, descKey: { tr: 'Videolarının keşfete düşmesini destekleyen açıklamalar.', en: 'Descriptions that push your videos to the For You page.' }, color: 'text-red-400' },
  { href: '/tools/hashtag-arac', nameKey: { tr: 'Hashtag Araştırma', en: 'Hashtag Research' }, descKey: { tr: 'Niş odaklı, AI önerili hashtag kümeleri.', en: 'AI-curated hashtag clusters for your niche.' }, color: 'text-green-400' },
  { href: '/tools/hook-kutuphanesi', nameKey: { tr: 'Hook Kütüphanesi', en: 'Hook Library' }, descKey: { tr: '8 kategoride 100+ elle hazırlanmış hook cümlesi (TR/EN).', en: '100+ hand-crafted hooks across 8 categories (TR/EN).' }, color: 'text-yellow-400' },
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

function getCheckoutUrl(baseUrl: string, userId: string | undefined) {
  if (!userId || baseUrl === '#') return baseUrl
  if (baseUrl.includes('gumroad.com')) {
    return `${baseUrl}?user_id=${userId}`
  }
  // embed=1 enables iframe-friendly chrome so the Lemon overlay can render it
  return `${baseUrl}?embed=1&checkout[custom][user_id]=${userId}`
}

export default function Home() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const faqs = isEn ? FAQ_EN : FAQ_TR

  // lemon.js attaches click listeners at init via querySelectorAll — Clerk's
  // <Show when="signed-in"> mounts the buttons after that scan, so we re-scan
  // once the user resolves.
  useEffect(() => {
    if (!user?.id) return
    const t = setTimeout(() => {
      window.LemonSqueezy?.Refresh?.()
    }, 100)
    return () => clearTimeout(t)
  }, [user?.id])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_TR.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const starterFeatures = isEn
    ? ['50 Single Platform / Month', '20 Multi-Platform / Month', '2 Content Calendar (7 days) / Month', '1 Brand Profile', 'Hook Library', 'Hashtag Research', 'Bio Generator', 'Reply Generator']
    : ['Aylık 50 tek platform üretim', 'Aylık 20 çoklu platform üretim', 'Aylık 2 içerik takvimi (7 gün)', '1 marka profili', 'Hook kütüphanesi', 'Hashtag araştırma', 'Bio üretici', 'Yanıt üretici']

  const proFeatures = isEn
    ? ['All 14 AI tools included', 'Unlimited content generation', 'Unlimited multi-platform', 'A/B variations (3 versions)', 'Unlimited content calendar (30 days)', '3 Brand Profiles', 'Competitor analysis', 'Thread/Carousel generator', 'URL → Post', 'Tone rewriter & bulk generator', 'Content improver & favorites', 'CSV export']
    : ['14 AI aracın tamamı dahil', 'Sınırsız içerik üretimi', 'Sınırsız çoklu platform', 'A/B varyasyonlar (3 versiyon)', 'Sınırsız içerik takvimi (30 gün)', '3 marka profili', 'Rakip analizi', 'Thread/Carousel üretici', 'URL → Post', 'Ton değiştirici & toplu üretim', 'İçerik iyileştirici & favoriler', 'CSV dışa aktarma']

  const freeFeatures = isEn
    ? ['5 posts per month', 'Hook library access', '4 platforms', 'Viral score', 'TR & EN support']
    : ['Aylık 5 içerik', 'Hook kütüphanesi erişimi', '4 platform', 'Viral skor', 'TR & EN desteği']

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-sans selection:bg-[#ff006e] selection:text-white overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[90vh] rounded-full opacity-40"
             style={{ background: 'radial-gradient(ellipse at center, rgba(131,56,236,0.18) 0%, rgba(255,0,110,0.06) 35%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
          <a href="/" className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff]">
            ViralSpark
          </a>
          <div className="hidden md:flex items-center gap-9 text-[13px] font-medium text-white/60">
            <a href="/tools" className="hover:text-white transition-colors">{isEn ? 'Tools' : 'Araçlar'}</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a>
            <a href="#faq" className="hover:text-white transition-colors">{isEn ? 'FAQ' : 'SSS'}</a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Show when="signed-out">
              <a href="/sign-in" className="hidden sm:block text-[13px] font-medium text-white/60 hover:text-white transition-colors">
                {t('nav.signin')}
              </a>
              <a href="/sign-up" className="text-[13px] font-semibold bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] text-white px-5 py-2 rounded-full hover:scale-[1.03] transition-transform shadow-[0_0_30px_rgba(255,0,110,0.25)]">
                {t('nav.start')}
              </a>
            </Show>
            <Show when="signed-in">
              <a href="/dashboard" className="text-[13px] font-semibold bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] text-white px-5 py-2 rounded-full hover:scale-[1.03] transition-transform shadow-[0_0_30px_rgba(255,0,110,0.25)]">
                {t('nav.dashboard')}
              </a>
            </Show>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 pt-36 md:pt-44 pb-24 px-6 text-center">
        <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/50 mb-8">ViralSpark AI</div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] max-w-5xl mx-auto">
          <span className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] bg-clip-text text-transparent">
            {isEn ? 'Viral' : 'Viral'}
          </span>{' '}
          {isEn ? 'content.' : 'içerik.'}<br />
          {isEn ? 'Every platform.' : 'Her platform için.'}<br />
          {isEn ? 'In seconds.' : 'Saniyeler içinde.'}
        </h1>
        <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
          {isEn
            ? 'Gemini AI generates viral-ready posts for Instagram, TikTok, X and LinkedIn — from a single prompt.'
            : 'Gemini AI ile Instagram, TikTok, X ve LinkedIn için tek prompttan viral içerik.'}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Show when="signed-out">
            <a href="/sign-up" className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] px-9 py-4 rounded-full text-base font-bold text-white hover:scale-[1.03] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.35)]">
              {isEn ? 'Start for free' : 'Ücretsiz başla'}
            </a>
          </Show>
          <Show when="signed-in">
            <a href="/dashboard" className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] px-9 py-4 rounded-full text-base font-bold text-white hover:scale-[1.03] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.35)]">
              {t('nav.dashboard')}
            </a>
          </Show>
          <a href="#pricing" className="px-9 py-4 rounded-full text-base font-semibold text-white bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
            {isEn ? 'See pricing' : 'Planları gör'}
          </a>
        </div>

        {/* Floating dashboard mockup */}
        <div className="mt-24 max-w-5xl mx-auto relative">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <div className="text-white/30 text-[11px] font-mono">viralspark.shop</div>
            </div>
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-8 flex flex-col gap-4 text-left">
                <div className="text-[11px] font-semibold text-pink-400 uppercase tracking-widest">{isEn ? 'Generated Post' : 'Üretilen İçerik'}</div>
                <div className="text-lg text-white/80 leading-relaxed font-light">
                  {isEn
                    ? '"3 months ago I was staring at a blank page. Today I ship 5 posts before coffee. Here\'s the system →"'
                    : '"3 ay önce boş ekrana bakıyordum. Bugün kahvemi içmeden 5 post atıyorum. İşte sistem →"'}
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {['#contentcreator', '#productivity', '#AItools', '#socialmedia'].map((tag) => (
                    <span key={tag} className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  {['camera', 'music_note', 'alternate_email', 'work'].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
                  ))}
                </div>
              </div>
              <div className="md:col-span-4 flex items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="88" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    <circle cx="100" cy="100" r="88" fill="transparent" stroke="url(#gr)" strokeWidth="12" strokeDasharray="552.9" strokeDashoffset="45" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gr" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff006e" />
                        <stop offset="50%" stopColor="#8338ec" />
                        <stop offset="100%" stopColor="#3a86ff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-black text-white tracking-tight">92</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mt-1">{isEn ? 'Viral Score' : 'Viral Skor'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="relative z-10 py-32 md:py-48 px-6 text-center">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.95] bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] bg-clip-text text-transparent">
          {isEn ? 'Built for virality.' : 'Viral için tasarlandı.'}
        </h2>
        <p className="mt-8 text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light">
          {isEn ? 'Every feature, engineered to stop the scroll.' : 'Her özellik, scroll\'u durdurmak için mühendislik ürünü.'}
        </p>
      </section>

      {/* FEATURE SPOTLIGHT 1: Hook Library */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-pink-400 mb-4">{isEn ? 'Hook Library' : 'Hook Kütüphanesi'}</div>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              {isEn ? '100+ hand-crafted hooks.' : '100+ elle hazırlanmış hook.'}
            </h3>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              {isEn
                ? '8 psychological categories, TR and EN. Curiosity gap, negative hook, expert flip — no more blank-page paralysis.'
                : '8 psikolojik kategoride, TR ve EN. Curiosity gap, negatif hook, expert flip — boş ekran felç olmaktan kurtul.'}
            </p>
          </div>
          <div className="relative h-[440px]">
            {[
              { label: isEn ? 'Curiosity Gap' : 'Merak Boşluğu', text: isEn ? 'I tried [X] for 30 days. Here\'s what happened...' : '[X] yöntemini 30 gün denedim. İşte olanlar...', color: 'text-blue-400', rotate: '-6deg', offset: 'top-0 left-0' },
              { label: isEn ? 'Expert Flip' : 'Uzman Çelişkisi', text: isEn ? 'Everything you know about [X] is wrong.' : '[X] hakkında bildiğin her şey yanlış.', color: 'text-purple-400', rotate: '3deg', offset: 'top-24 left-36' },
              { label: isEn ? 'Negative Hook' : 'Negatif Hook', text: isEn ? 'Stop doing [X] if you want [Y].' : '[Y] istiyorsan [X] yapmayı bırak.', color: 'text-pink-400', rotate: '-2deg', offset: 'top-56 left-8' },
            ].map((card, i) => (
              <div key={i} className={`absolute ${card.offset} w-72 p-6 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-2xl`}
                   style={{ transform: `rotate(${card.rotate})` }}>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${card.color}`}>{card.label}</div>
                <div className="text-white/80 text-sm font-medium leading-relaxed">{card.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT 2: Viral Score */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center md:order-1 order-2">
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="100" cy="100" r="88" fill="transparent" stroke="url(#gr2)" strokeWidth="10" strokeDasharray="552.9" strokeDashoffset="70" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gr2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff006e" />
                    <stop offset="100%" stopColor="#3a86ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-8xl font-black text-white tracking-tight">87</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">1 – 100</div>
              </div>
            </div>
          </div>
          <div className="md:order-2 order-1">
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-400 mb-4">{isEn ? 'Viral Score' : 'Viral Skor'}</div>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              {isEn ? 'Know before you post.' : 'Post etmeden önce bil.'}
            </h3>
            <p className="text-lg text-white/60 leading-relaxed font-light">
              {isEn
                ? 'Every generation gets a 1–100 score from Gemini AI. Hook strength, readability, platform fit, engagement potential — all factored.'
                : 'Her üretim, Gemini AI\'dan 1–100 arası skor alır. Hook gücü, okunabilirlik, platform uyumu, etkileşim potansiyeli — hepsi değerlendirilir.'}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT 3: Multi-platform */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-blue-400 mb-4">{isEn ? 'Multi-Platform' : 'Çok Platformlu'}</div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            {isEn ? 'One prompt. Four platforms.' : 'Tek prompt. Dört platform.'}
          </h3>
          <p className="text-lg text-white/60 leading-relaxed font-light max-w-2xl mx-auto mb-16">
            {isEn
              ? 'Write once. Tone, format and hashtag strategy auto-optimized for Instagram, TikTok, X and LinkedIn.'
              : 'Bir kez yaz. Ton, format ve hashtag stratejisi Instagram, TikTok, X ve LinkedIn için otomatik optimize edilir.'}
          </p>
          <div className="relative max-w-xl mx-auto h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff006e] via-[#8338ec] to-[#3a86ff] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_60px_rgba(131,56,236,0.4)]">V</div>
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center text-xs font-bold text-pink-400">IG</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center text-xs font-bold text-red-400">TT</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center text-xs font-bold text-purple-400">in</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center text-xs font-bold text-blue-400">X</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT 4: A/B Variants */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-pink-400 mb-4">{isEn ? 'A/B Variants' : 'A/B Varyantlar'}</div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            {isEn ? 'Three versions. One prompt.' : 'Üç versiyon. Tek prompt.'}
          </h3>
          <p className="text-lg text-white/60 leading-relaxed font-light max-w-2xl mx-auto">
            {isEn ? 'Generate agressive, curiosity-driven and educational variants side by side. Pick what fits.' : 'Agresif, merak tetikleyici ve eğitici varyantları yan yana üret. Uyanı seç.'}
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { label: isEn ? 'Aggressive' : 'Agresif', letter: 'A', color: 'bg-pink-500' },
            { label: isEn ? 'Curiosity' : 'Merak Tetikleyici', letter: 'B', color: 'bg-gradient-to-br from-[#ff006e] to-[#3a86ff]', highlight: true },
            { label: isEn ? 'Educational' : 'Eğitici', letter: 'C', color: 'bg-blue-500' },
          ].map((v, i) => (
            <div key={i} className={`p-8 rounded-2xl backdrop-blur-xl border ${v.highlight ? 'bg-white/[0.08] border-pink-500/40 scale-[1.04] shadow-[0_0_50px_rgba(255,0,110,0.15)]' : 'bg-white/[0.04] border-white/10'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full ${v.color} flex items-center justify-center text-xs font-bold`}>{v.letter}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{v.label}</div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-3/4 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS STRIP */}
      <section className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { num: '14', label: isEn ? 'AI Tools' : 'AI Araç', gradient: true },
            { num: '100+', label: isEn ? 'Hooks' : 'Hook Şablonu' },
            { num: '4', label: isEn ? 'Platforms' : 'Platform' },
            { num: 'TR/EN', label: isEn ? 'Bilingual' : 'Çift Dil' },
          ].map((s, i) => (
            <div key={i}>
              <div className={`text-5xl md:text-7xl font-black tracking-tighter mb-3 ${s.gradient ? 'bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] bg-clip-text text-transparent' : 'text-white'}`}>{s.num}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOL GALLERY */}
      <section className="relative z-10 py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{isEn ? 'The toolkit.' : 'Araç kiti.'}</h2>
          <p className="text-white/50 mt-3 font-light">{isEn ? '6 commercial-intent tools — free to try.' : '6 yüksek niyetli araç — ücretsiz dene.'}</p>
        </div>
        <div className="flex gap-6 px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2))] overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none">
          {TOOLS_GALLERY.map((tool) => (
            <a key={tool.href} href={tool.href} className="group min-w-[300px] snap-start bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all">
              <div className={`text-3xl font-black mb-6 ${tool.color}`}>#</div>
              <h4 className="text-2xl font-bold mb-3">{tool.nameKey[locale]}</h4>
              <p className="text-sm text-white/50 font-light leading-relaxed mb-6">{tool.descKey[locale]}</p>
              <div className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{isEn ? 'Try it →' : 'Aracı dene →'}</div>
            </a>
          ))}
        </div>
      </section>

      {/* REMAINING FEATURES GRID */}
      <section className="relative z-10 py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{isEn ? 'Every feature you need.' : 'İhtiyacın olan her özellik.'}</h2>
          <p className="text-white/50 font-light mb-16">{isEn ? '14 tools in one workspace.' : 'Tek çalışma alanında 14 araç.'}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_GRID.map((f) => (
              <a key={f.titleKey} href={f.href} className="group bg-white/[0.04] backdrop-blur-xl border border-white/10 p-7 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all">
                <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{t(f.titleKey)}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">{t(f.descKey)}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">{isEn ? 'Choose your velocity.' : 'Hızını seç.'}</h2>
            <p className="text-lg text-white/50 font-light">{isEn ? 'Scale your output, not your workload.' : 'İş yükünü değil, üretimini ölçekle.'}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col">
              <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">{isEn ? 'Free' : 'Ücretsiz'}</div>
              <div className="text-5xl font-black mb-2">{isEn ? '$0' : '₺0'}<span className="text-base text-white/40 font-medium">{t('pricing.mo')}</span></div>
              <p className="text-sm text-white/50 font-light mb-8">{isEn ? 'Try ViralSpark with no credit card.' : 'Kredi kartı gerekmez, dene.'}</p>
              <ul className="space-y-3 mb-10 flex-grow text-sm text-white/70 font-light">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/sign-up" className="block text-center py-4 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors">{isEn ? 'Get started' : 'Ücretsiz başla'}</a>
            </div>

            {/* Starter (popular) */}
            <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl p-10 flex flex-col overflow-hidden">
              <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent" style={{ background: 'linear-gradient(#0a0a0f,#0a0a0f) padding-box, linear-gradient(135deg,#ff006e,#8338ec,#3a86ff) border-box', border: '2px solid transparent' }} />
              <div className="absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#ff006e] to-[#3a86ff] rounded-bl-xl">{isEn ? 'Most Popular' : 'En Popüler'}</div>
              <div className="relative">
                <div className="text-[11px] font-bold uppercase tracking-widest text-pink-400 mb-4">Starter</div>
                <div className="text-5xl font-black mb-2">{isEn ? '$3' : '₺30'}<span className="text-base text-white/40 font-medium">{t('pricing.mo')}</span></div>
                <p className="text-sm text-white/60 font-light mb-8">{t('pricing.starter.desc')}</p>
                <ul className="space-y-3 mb-10 flex-grow text-sm text-white/80 font-light">
                  {starterFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Show when="signed-out">
                  <a href="/sign-up" className="block text-center py-4 rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.3)]">{t('nav.start')}</a>
                </Show>
                <Show when="signed-in">
                  {USE_PADDLE ? (
                    <button
                      type="button"
                      onClick={() => openPaddleCheckout(PADDLE_STARTER_PRICE, user?.id)}
                      className="w-full block text-center py-4 rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.3)]"
                    >
                      {t('pricing.select')}
                    </button>
                  ) : (
                    <a
                      href={getCheckoutUrl(PLAN_KEYS.starter.checkoutUrl, user?.id)}
                      className="lemonsqueezy-button block text-center py-4 rounded-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bold text-sm hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,0,110,0.3)]"
                    >
                      {t('pricing.select')}
                    </a>
                  )}
                </Show>
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col">
              <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Pro</div>
              <div className="text-5xl font-black mb-2">{isEn ? '$10' : '₺100'}<span className="text-base text-white/40 font-medium">{t('pricing.mo')}</span></div>
              <p className="text-sm text-white/50 font-light mb-8">{t('pricing.pro.desc')}</p>
              <ul className="space-y-3 mb-10 flex-grow text-sm text-white/70 font-light">
                {proFeatures.slice(0, 7).map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Show when="signed-out">
                <a href="/sign-up" className="block text-center py-4 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors">{t('nav.start')}</a>
              </Show>
              <Show when="signed-in">
                {USE_PADDLE ? (
                  <button
                    type="button"
                    onClick={() => openPaddleCheckout(PADDLE_PRO_PRICE, user?.id)}
                    className="w-full block text-center py-4 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors"
                  >
                    {t('pricing.go')}
                  </button>
                ) : (
                  <a
                    href={getCheckoutUrl(PLAN_KEYS.pro.checkoutUrl, user?.id)}
                    className="lemonsqueezy-button block text-center py-4 rounded-full border border-white/20 font-semibold text-sm hover:bg-white/5 transition-colors"
                  >
                    {t('pricing.go')}
                  </a>
                )}
              </Show>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-xs text-white/40 font-medium">
            <span>{isEn ? '✓ 14-day money-back guarantee' : '✓ 14 gün para iade garantisi'}</span>
            <span>{isEn ? '✓ Cancel anytime' : '✓ İstediğin zaman iptal'}</span>
            <span>{USE_PADDLE
              ? (isEn ? '✓ Secure via Paddle' : '✓ Paddle ile güvenli ödeme')
              : (isEn ? '✓ Secure via Lemon Squeezy' : '✓ Lemon Squeezy ile güvenli ödeme')
            }</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">{isEn ? 'Frequently Asked' : 'Sıkça Sorulanlar'}</h2>
            <p className="text-lg text-white/50 font-light">{isEn ? 'Everything you need to know.' : 'Merak ettiğin her şey.'}</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/20">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base md:text-lg font-bold text-white">{faq.q}</h3>
                    <svg className={`w-5 h-5 shrink-0 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-8 pb-6 text-white/60 leading-relaxed text-sm md:text-base font-light">{faq.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-40 px-6 text-center border-t border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[60vw] h-[60vh] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(131,56,236,0.2) 0%, transparent 60%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.02] mb-6">
            {isEn ? 'Ready to go viral?' : 'Viral olmaya hazır mısın?'}
          </h2>
          <p className="text-xl md:text-2xl text-white/50 font-light mb-12">
            {isEn ? 'Start creating in seconds. Free forever plan.' : 'Saniyeler içinde üretmeye başla. Ücretsiz plan her zaman açık.'}
          </p>
          <Show when="signed-out">
            <a href="/sign-up" className="inline-block bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] px-12 py-5 rounded-full text-lg font-black text-white hover:scale-[1.03] transition-transform shadow-[0_0_60px_rgba(255,0,110,0.4)]">
              {isEn ? 'Start for free' : 'Ücretsiz başla'}
            </a>
          </Show>
          <Show when="signed-in">
            <a href="/dashboard" className="inline-block bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] px-12 py-5 rounded-full text-lg font-black text-white hover:scale-[1.03] transition-transform shadow-[0_0_60px_rgba(255,0,110,0.4)]">
              {t('nav.dashboard')}
            </a>
          </Show>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] mb-4">ViralSpark</div>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
              {isEn
                ? 'AI-powered social content generator. Viral-ready posts in seconds.'
                : 'Yapay zeka destekli içerik üreticisi. Saniyeler içinde viral potansiyelli post\'lar.'}
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-5 text-sm">{isEn ? 'Product' : 'Ürün'}</h5>
            <ul className="space-y-3 text-white/40 text-sm font-light">
              <li><a href="/tools" className="hover:text-white transition-colors">{isEn ? 'Tools' : 'Araçlar'}</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a></li>
              <li><a href="/sign-in" className="hover:text-white transition-colors">{t('nav.signin')}</a></li>
              <li><a href="/sign-up" className="hover:text-white transition-colors">{t('nav.start')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-5 text-sm">{isEn ? 'Resources' : 'Kaynaklar'}</h5>
            <ul className="space-y-3 text-white/40 text-sm font-light">
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/blog/viral-icerik-nasil-uretilir" className="hover:text-white transition-colors">{isEn ? 'Viral content guide' : 'Viral içerik rehberi'}</a></li>
              <li><a href="/blog/en-etkili-hook-cumleleri" className="hover:text-white transition-colors">{isEn ? 'Hook guide' : 'Hook rehberi'}</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-5 text-sm">{isEn ? 'Legal' : 'Yasal'}</h5>
            <ul className="space-y-3 text-white/40 text-sm font-light">
              <li><a href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
              <li><a href="/refund" className="hover:text-white transition-colors">{isEn ? 'Refund' : 'İade'}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{isEn ? 'Contact' : 'İletişim'}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-white/30 text-xs font-medium">
          © 2026 ViralSpark.
        </div>
      </footer>
    </div>
  )
}
