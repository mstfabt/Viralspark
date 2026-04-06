import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-green-400">
          ViralSpark ⚡
        </div>
        <div className="space-x-4">
          <a href="#features" className="hover:text-purple-400 transition">Özellikler</a>
          <a href="#pricing" className="hover:text-purple-400 transition">Fiyatlandırma</a>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
            Giriş Yap
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Saniyeler İçinde <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 animate-pulse">
            Viral İçerikler
          </span> Üretin
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto">
          Yapay zeka ile sosyal medya gönderilerinizi otomatikleştirin, etkileşiminizi uçuşa geçirin. Sadece ne istediğinizi söyleyin, gerisini bize bırakın.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1 rounded-full group">
            <span className="block bg-slate-900 px-8 py-4 rounded-full font-bold text-lg group-hover:bg-opacity-0 transition duration-300">
              Ücretsiz Başla 🚀
            </span>
          </button>
          <button className="px-8 py-4 rounded-full font-bold text-lg bg-slate-800 hover:bg-slate-700 transition">
            Nasıl Çalışır?
          </button>
        </div>
      </main>

      {/* Pricing Demo */}
      <section id="pricing" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Hızlı Kazandıran Planlar</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Başlangıç</h3>
              <p className="text-4xl font-black mb-6">$9<span className="text-lg text-slate-400 font-normal">/ay</span></p>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li>✓ 50 AI Gönderi / Ay</li>
                <li>✓ Temel Şablonlar</li>
                <li>✓ Standart Destek</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold transition">Seç</button>
            </div>
            
            {/* Pro (Highlighted) */}
            <div className="bg-gradient-to-b from-purple-500/10 to-transparent rounded-3xl p-8 border border-purple-500 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 px-4 py-1 rounded-full text-sm font-bold">
                EN ÇOK TERCİH EDİLEN
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro İçerik Üreticisi</h3>
              <p className="text-4xl font-black mb-6">$29<span className="text-lg text-slate-400 font-normal">/ay</span></p>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li>✓ Sınırsız AI Gönderi</li>
                <li>✓ Özel Şablonlar (Twitter, LinkedIn)</li>
                <li>✓ Analitik Raporları</li>
                <li>✓ 7/24 Öncelikli Destek</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 font-bold hover:opacity-90 transition">Hemen Başla</button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Ajans</h3>
              <p className="text-4xl font-black mb-6">$99<span className="text-lg text-slate-400 font-normal">/ay</span></p>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li>✓ Sınırsız Gönderi & Video Fikirleri</li>
                <li>✓ 10 Alt Kullanıcı Ekleme</li>
                <li>✓ Özel API Erişimi</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold transition">Seç</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
