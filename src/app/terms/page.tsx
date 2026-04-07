import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanim Sartlari - ViralSpark',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center">
          <a href="/" className="text-xl font-semibold tracking-tight">ViralSpark.</a>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Kullanim Sartlari</h1>
        <p className="text-sm text-gray-400 mb-8">Son guncelleme: 7 Nisan 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">1. Hizmet Tanimi</h2>
            <p>ViralSpark, yapay zeka destekli sosyal medya icerik uretim platformudur. Kullanicilar, cesitli sosyal medya platformlari icin icerik, hashtag stratejisi, rakip analizi ve daha fazlasini uretebilir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">2. Hesap Olusturma</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hizmeti kullanmak icin bir hesap olusturmaniz gerekmektedir.</li>
              <li>Hesap bilgilerinizin dogrulugu ve guncelliginden siz sorumlusunuz.</li>
              <li>Hesabinizin guvenligini saglamak sizin sorumlulugunuzdadir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">3. Abonelik ve Odeme</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ucretsiz plan sinirli ozellikler sunar.</li>
              <li>Ucretli planlar aylik abonelik bazlidir.</li>
              <li>Odemeler Lemon Squeezy uzerinden guvenle islenir.</li>
              <li>Aboneliginizi istediginiz zaman iptal edebilirsiniz. Iptal, mevcut donem sonunda gecerli olur.</li>
              <li>Iade politikasi: Satin alma tarihinden itibaren 14 gun icinde iade talep edebilirsiniz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">4. Kullanim Kurallari</h2>
            <p>Asagidaki davranislar yasaklanmistir:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Hizmeti yasa disi amaclarla kullanmak</li>
              <li>API'yi kotu niyetli sekilde kullanmak veya suistimal etmek</li>
              <li>Baskalarinin hesaplarina yetkisiz erisim saglamaya calismak</li>
              <li>Nefret soylemi, yanlis bilgi veya zarali icerik uretmek</li>
              <li>Hizmetin normal isleyisini bozmaya calismak</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">5. Icerik Mulkiyeti</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>ViralSpark ile urettiginiz icerikler size aittir.</li>
              <li>Uretilen icerikleri ticari amaclarla serbestce kullanabilirsiniz.</li>
              <li>ViralSpark, uretilen icerikler uzerinde hak iddia etmez.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">6. Hizmet Seviyesi</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hizmet "oldugu gibi" sunulmaktadir.</li>
              <li>Plansiz bakim veya teknik sorunlar nedeniyle kesintiler yasanabilir.</li>
              <li>AI tarafindan uretilen iceriklerin dogrulugu garanti edilmez.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">7. Sorumluluk Siniri</h2>
            <p>ViralSpark, uretilen iceriklerin kullanimindan dogan zararlardan sorumlu tutulamaz. Uretilen iceriklerin uygunlugunu kontrol etmek kullanicinin sorumlulugundadir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">8. Degisiklikler</h2>
            <p>Bu kullanim sartlari zaman zaman guncellenebilir. Degisiklikler yayinlandigi anda yururluge girer. Onemli degisiklikler e-posta ile bildirilecektir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">9. Iletisim</h2>
            <p>Sorulariniz icin: <strong>info@viralspark.com</strong></p>
          </section>
        </div>
      </div>
    </div>
  )
}
