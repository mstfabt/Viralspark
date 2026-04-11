'use client'

import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function PrivacyPage() {
  const { locale } = useLanguage()
  const isEn = locale === 'en'

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a]">
      <nav className="border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <LanguageSelector />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          {isEn ? 'Privacy Policy' : 'Gizlilik Politikasi'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#71717a] mb-8">
          {isEn ? 'Last updated: April 7, 2026' : 'Son guncelleme: 7 Nisan 2026'}
        </p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
          {isEn ? (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. Data We Collect</h2>
                <p>ViralSpark collects the following data to provide its services:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Account information:</strong> Name, surname, email address (via Clerk)</li>
                  <li><strong>Usage data:</strong> Number of content generated, features used</li>
                  <li><strong>Brand information:</strong> Brand name, industry, target audience entered by users</li>
                  <li><strong>Payment information:</strong> Processed via Lemon Squeezy; card details are not stored by us</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. How We Use Data</h2>
                <p>Collected data is used for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Providing and improving the service</li>
                  <li>Tracking usage limits</li>
                  <li>Generating brand-personalized content</li>
                  <li>Detecting and resolving technical issues</li>
                  <li>Fulfilling legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. Data Sharing</h2>
                <p>Your data may be shared with the following third-party service providers:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Clerk:</strong> Authentication and user management</li>
                  <li><strong>Google (Gemini AI):</strong> API requests for content generation</li>
                  <li><strong>Lemon Squeezy:</strong> Payment processing</li>
                  <li><strong>Vercel:</strong> Hosting and infrastructure</li>
                </ul>
                <p className="mt-2">Your data is never sold or shared for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Cookies</h2>
                <p>Cookies are used for session management and analytics. You can manage cookies through your browser settings.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Data Security</h2>
                <p>Your data is protected with HTTPS encryption. Payment information is processed through Lemon Squeezy&apos;s PCI DSS compliant infrastructure.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Your Rights</h2>
                <p>Under GDPR, you have the following rights:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Request access to your data</li>
                  <li>Request correction of your data</li>
                  <li>Request deletion of your data</li>
                  <li>Request restriction of data processing</li>
                </ul>
                <p className="mt-2">To exercise these rights, email us at <strong>support@viralspark.shop</strong>.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">7. Changes</h2>
                <p>This privacy policy may be updated from time to time. Significant changes will be communicated via email.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. Toplanan Veriler</h2>
                <p>ViralSpark, hizmet sunabilmek icin asagidaki verileri toplar:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Hesap bilgileri:</strong> Ad, soyad, e-posta adresi (Clerk uzerinden)</li>
                  <li><strong>Kullanim verileri:</strong> Uretilen icerik sayisi, kullanilan ozellikler</li>
                  <li><strong>Marka bilgileri:</strong> Kullanicinin girdigi marka adi, sektor, hedef kitle</li>
                  <li><strong>Odeme bilgileri:</strong> Lemon Squeezy uzerinden islenir, kart bilgileri tarafimizca saklanmaz</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. Verilerin Kullanimi</h2>
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
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. Veri Paylasimi</h2>
                <p>Verileriniz asagidaki ucuncu taraf hizmet saglayicilari ile paylasilabilir:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Clerk:</strong> Kimlik dogrulama ve kullanici yonetimi</li>
                  <li><strong>Google (Gemini AI):</strong> Icerik uretimi icin API istekleri</li>
                  <li><strong>Lemon Squeezy:</strong> Odeme islemleri</li>
                  <li><strong>Vercel:</strong> Hosting ve altyapi</li>
                </ul>
                <p className="mt-2">Verileriniz ucuncu sahislara satilmaz veya pazarlama amaciyla paylasilmaz.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Cerezler</h2>
                <p>Oturum yonetimi ve analitik icin cerezler kullanilmaktadir. Tarayici ayarlarinizdan cerezleri yonetebilirsiniz.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Veri Guvenligi</h2>
                <p>Verileriniz HTTPS sifreleme ile korunur. Odeme bilgileri PCI DSS uyumlu Lemon Squeezy altyapisi uzerinden islenir.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Kullanici Haklari</h2>
                <p>KVKK ve GDPR kapsaminda asagidaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Verilerinize erisim talep etme</li>
                  <li>Verilerinizin duzeltilmesini isteme</li>
                  <li>Verilerinizin silinmesini talep etme</li>
                  <li>Veri islemenin sinirlandirilmasini isteme</li>
                </ul>
                <p className="mt-2">Bu haklarinizi kullanmak icin <strong>support@viralspark.shop</strong> adresine e-posta gonderebilirsiniz.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">7. Degisiklikler</h2>
                <p>Bu gizlilik politikasi zaman zaman guncellenebilir. Onemli degisiklikler e-posta ile bildirilecektir.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
