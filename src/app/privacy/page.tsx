import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikasi - ViralSpark',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center">
          <a href="/" className="text-xl font-semibold tracking-tight">ViralSpark.</a>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Gizlilik Politikasi</h1>
        <p className="text-sm text-gray-400 mb-8">Son guncelleme: 7 Nisan 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">1. Toplanan Veriler</h2>
            <p>ViralSpark, hizmet sunabilmek icin asagidaki verileri toplar:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Hesap bilgileri:</strong> Ad, soyad, e-posta adresi (Clerk uzerinden)</li>
              <li><strong>Kullanim verileri:</strong> Uretilen icerik sayisi, kullanilan ozellikler</li>
              <li><strong>Marka bilgileri:</strong> Kullanicinin girdigi marka adi, sektor, hedef kitle</li>
              <li><strong>Odeme bilgileri:</strong> Lemon Squeezy uzerinden islenir, kart bilgileri tarafimizca saklanmaz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">2. Verilerin Kullanimi</h2>
            <p>Toplanan veriler asagidaki amaclarla kullanilir:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Hizmetin sunulmasi ve iyilestirilmesi</li>
              <li>Kullanim limitlerinin takibi</li>
              <li>Marka bazli kisisellestirilmis icerik uretimi</li>
              <li>Teknik sorunlarin tespiti ve giderilmesi</li>
              <li>Yasal yukumluluklerin yerine getirilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">3. Veri Paylasimi</h2>
            <p>Verileriniz asagidaki ucuncu taraf hizmet saglayicilari ile paylasılabilir:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Clerk:</strong> Kimlik dogrulama ve kullanici yonetimi</li>
              <li><strong>Google (Gemini AI):</strong> Icerik uretimi icin API istekleri</li>
              <li><strong>Lemon Squeezy:</strong> Odeme islemleri</li>
              <li><strong>Vercel:</strong> Hosting ve altyapi</li>
            </ul>
            <p className="mt-2">Verileriniz ucuncu sahislara satilmaz veya pazarlama amaciyla paylasilmaz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">4. Cerezler</h2>
            <p>Oturum yonetimi ve analitik icin cerezler kullanilmaktadir. Tarayici ayarlarinizdan cerezleri yonetebilirsiniz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">5. Veri Guvenligi</h2>
            <p>Verileriniz HTTPS sifreleme ile korunur. Odeme bilgileri PCI DSS uyumlu Lemon Squeezy altyapisi uzerinden islenir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">6. Kullanici Haklari</h2>
            <p>KVKK ve GDPR kapsaminda asagidaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Verilerinize erisim talep etme</li>
              <li>Verilerinizin duzeltilmesini isteme</li>
              <li>Verilerinizin silinmesini talep etme</li>
              <li>Veri islemenin sinirlandirilmasini isteme</li>
            </ul>
            <p className="mt-2">Bu haklarinizi kullanmak icin <strong>info@viralspark.com</strong> adresine e-posta gonderebilirsiniz.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">7. Degisiklikler</h2>
            <p>Bu gizlilik politikasi zaman zaman guncellenebilir. Onemli degisiklikler e-posta ile bildirilecektir.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
