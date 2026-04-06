import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">ViralSpark.</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-black transition-colors">Özellikler</a>
            <a href="#pricing" className="hover:text-black transition-colors">Fiyatlandırma</a>
          </div>
          <button className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
            Giriş Yap
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-black">
          Fikirlerinizi <br className="hidden md:block" />
          <span className="text-gray-400">virale dönüştürün.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Yapay zeka gücüyle saniyeler içinde etkileşimi yüksek içerikler üretin. Sosyal medyada büyümek artık çok daha kolay, çok daha zarif.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-medium text-lg hover:scale-105 transition-transform duration-300">
            Ücretsiz Deneyin
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-black rounded-full font-medium text-lg hover:bg-gray-200 transition-colors duration-300">
            Nasıl Çalışır?
          </button>
        </div>
      </main>

      {/* Video / App Preview Mockup */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="aspect-video bg-gray-50 rounded-[2rem] border border-gray-200 shadow-2xl flex items-center justify-center">
          <span className="text-gray-400 font-medium">Uygulama Arayüzü (Yakında)</span>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Sade ve şeffaf fiyatlandırma.</h2>
            <p className="text-xl text-gray-500 font-light">İhtiyacınıza uygun planı seçin, hemen başlayın.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">Başlangıç</h3>
              <p className="text-gray-500 mb-6 font-light">Temel ihtiyaçlar için.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$9</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-600 font-light">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  50 AI Gönderi / Ay
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Temel Şablonlar
                </li>
              </ul>
              <button className="w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors">Seç</button>
            </div>

            {/* Pro */}
            <div className="bg-black text-white p-10 rounded-[2rem] shadow-xl relative scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Önerilen
              </div>
              <h3 className="text-2xl font-semibold mb-2">Pro</h3>
              <p className="text-gray-400 mb-6 font-light">Profesyonel üreticiler için.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$29</span>
                <span className="text-gray-400">/ay</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-300 font-light">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Sınırsız AI Gönderi
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Özel Şablonlar
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Analitik Raporları
                </li>
              </ul>
              <button className="w-full py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors">Hemen Başla</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold mb-2">Ajans</h3>
              <p className="text-gray-500 mb-6 font-light">Ekipler ve ajanslar için.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$99</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-10 text-gray-600 font-light">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Sınırsız Her Şey
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  10 Alt Kullanıcı
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Özel API Erişimi
                </li>
              </ul>
              <button className="w-full py-4 rounded-full bg-gray-100 font-medium hover:bg-gray-200 transition-colors">İletişime Geç</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 ViralSpark. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
