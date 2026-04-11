'use client'

import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function TermsPage() {
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
          {isEn ? 'Terms of Service' : 'Kullanim Sartlari'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#71717a] mb-8">
          {isEn ? 'Last updated: April 7, 2026' : 'Son guncelleme: 7 Nisan 2026'}
        </p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
          {isEn ? (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. Service Description</h2>
                <p>ViralSpark is an AI-powered social media content generation platform. Users can generate content, hashtag strategies, competitor analysis, and more for various social media platforms.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. Account Creation</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You must create an account to use the service.</li>
                  <li>You are responsible for the accuracy and currency of your account information.</li>
                  <li>You are responsible for maintaining the security of your account.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. Subscription & Payment</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The free plan offers limited features.</li>
                  <li>Paid plans are billed on a monthly subscription basis.</li>
                  <li>Payments are securely processed via Lemon Squeezy.</li>
                  <li>You can cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
                  <li>Refund policy: You can request a refund within 14 days of purchase.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Usage Rules</h2>
                <p>The following behaviors are prohibited:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Using the service for illegal purposes</li>
                  <li>Misusing or abusing the API</li>
                  <li>Attempting unauthorized access to other users&apos; accounts</li>
                  <li>Generating hate speech, misinformation, or harmful content</li>
                  <li>Attempting to disrupt the normal operation of the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Content Ownership</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Content you generate with ViralSpark belongs to you.</li>
                  <li>You are free to use generated content for commercial purposes.</li>
                  <li>ViralSpark does not claim any rights over generated content.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Service Level</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The service is provided &quot;as is&quot;.</li>
                  <li>Interruptions may occur due to unplanned maintenance or technical issues.</li>
                  <li>The accuracy of AI-generated content is not guaranteed.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">7. Limitation of Liability</h2>
                <p>ViralSpark cannot be held responsible for damages arising from the use of generated content. It is the user&apos;s responsibility to verify the suitability of generated content.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">8. Changes</h2>
                <p>These terms of service may be updated from time to time. Changes take effect immediately upon publication. Significant changes will be communicated via email.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">9. Contact</h2>
                <p>For questions: <strong>support@viralspark.shop</strong></p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. Hizmet Tanimi</h2>
                <p>ViralSpark, yapay zeka destekli sosyal medya icerik uretim platformudur. Kullanicilar, cesitli sosyal medya platformlari icin icerik, hashtag stratejisi, rakip analizi ve daha fazlasini uretebilir.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. Hesap Olusturma</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hizmeti kullanmak icin bir hesap olusturmaniz gerekmektedir.</li>
                  <li>Hesap bilgilerinizin dogrulugu ve guncelliginden siz sorumlusunuz.</li>
                  <li>Hesabinizin guvenligini saglamak sizin sorumlulugunuzdadir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. Abonelik ve Odeme</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ucretsiz plan sinirli ozellikler sunar.</li>
                  <li>Ucretli planlar aylik abonelik bazlidir.</li>
                  <li>Odemeler Lemon Squeezy uzerinden guvenle islenir.</li>
                  <li>Aboneliginizi istediginiz zaman iptal edebilirsiniz. Iptal, mevcut donem sonunda gecerli olur.</li>
                  <li>Iade politikasi: Satin alma tarihinden itibaren 14 gun icinde iade talep edebilirsiniz.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Kullanim Kurallari</h2>
                <p>Asagidaki davranislar yasaklanmistir:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Hizmeti yasa disi amaclarla kullanmak</li>
                  <li>API&apos;yi kotu niyetli sekilde kullanmak veya suistimal etmek</li>
                  <li>Baskalarinin hesaplarina yetkisiz erisim saglamaya calismak</li>
                  <li>Nefret soylemi, yanlis bilgi veya zarali icerik uretmek</li>
                  <li>Hizmetin normal isleyisini bozmaya calismak</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Icerik Mulkiyeti</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ViralSpark ile urettiginiz icerikler size aittir.</li>
                  <li>Uretilen icerikleri ticari amaclarla serbestce kullanabilirsiniz.</li>
                  <li>ViralSpark, uretilen icerikler uzerinde hak iddia etmez.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Hizmet Seviyesi</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hizmet &quot;oldugu gibi&quot; sunulmaktadir.</li>
                  <li>Plansiz bakim veya teknik sorunlar nedeniyle kesintiler yasanabilir.</li>
                  <li>AI tarafindan uretilen iceriklerin dogrulugu garanti edilmez.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">7. Sorumluluk Siniri</h2>
                <p>ViralSpark, uretilen iceriklerin kullanimindan dogan zararlardan sorumlu tutulamaz. Uretilen iceriklerin uygunlugunu kontrol etmek kullanicinin sorumlulugundadir.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">8. Degisiklikler</h2>
                <p>Bu kullanim sartlari zaman zaman guncellenebilir. Degisiklikler yayinlandigi anda yururluge girer. Onemli degisiklikler e-posta ile bildirilecektir.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">9. Iletisim</h2>
                <p>Sorulariniz icin: <strong>support@viralspark.shop</strong></p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
