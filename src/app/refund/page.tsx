'use client'

import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function RefundPage() {
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
          {isEn ? 'Refund Policy' : 'Iade Politikasi'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#71717a] mb-8">
          {isEn ? 'Last updated: April 9, 2026' : 'Son guncelleme: 9 Nisan 2026'}
        </p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
          {isEn ? (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. 14-Day Money-Back Guarantee</h2>
                <p>We offer a 14-day money-back guarantee on all paid plans. If you are not satisfied with ViralSpark for any reason, you can request a full refund within 14 days of your initial purchase. No questions asked.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. How to Request a Refund</h2>
                <p>To request a refund, please contact us at <a href="mailto:support@viralspark.shop" className="text-blue-600 hover:underline">support@viralspark.shop</a> with your account email address and the reason for the refund (optional). We will process your refund within 5-10 business days.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. After the 14-Day Period</h2>
                <p>After the 14-day guarantee period, refunds are not available for the current billing cycle. However, you can cancel your subscription at any time, and you will retain access to your paid plan until the end of the current billing period.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Cancellation</h2>
                <p>You may cancel your subscription at any time from your account settings or by contacting us. Upon cancellation:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Your subscription will not renew at the next billing cycle.</li>
                  <li>You will continue to have access to your paid features until the end of the current billing period.</li>
                  <li>After the billing period ends, your account will be downgraded to the free plan.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Exceptions</h2>
                <p>Refunds may be denied in cases of abuse, such as repeated subscription and refund cycles, or violation of our Terms of Service.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Contact</h2>
                <p>For any questions about our refund policy, please reach out to us at <a href="mailto:support@viralspark.shop" className="text-blue-600 hover:underline">support@viralspark.shop</a>.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">1. 14 Gun Para Iade Garantisi</h2>
                <p>Tum ucretli planlarda 14 gun para iade garantisi sunuyoruz. Herhangi bir nedenle ViralSpark&apos;tan memnun kalmazsaniz, ilk satin aliminizdan itibaren 14 gun icinde tam iade talep edebilirsiniz. Soru sorulmaz.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">2. Iade Nasil Talep Edilir</h2>
                <p>Iade talep etmek icin <a href="mailto:support@viralspark.shop" className="text-blue-600 hover:underline">support@viralspark.shop</a> adresine hesap e-posta adresiniz ve iade nedeniniz (istege bagli) ile birlikte yazin. Iadenizi 5-10 is gunu icinde isleriz.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">3. 14 Gunluk Sureden Sonra</h2>
                <p>14 gunluk garanti suresinden sonra, mevcut fatura donemi icin iade yapilmaz. Ancak aboneliginizi istediginiz zaman iptal edebilirsiniz ve mevcut fatura donemi sonuna kadar ucretli planiniza erisim devam eder.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">4. Iptal</h2>
                <p>Aboneliginizi istediginiz zaman hesap ayarlarinizdan veya bize ulasarak iptal edebilirsiniz. Iptal durumunda:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Aboneliginiz bir sonraki fatura doneminde yenilenmez.</li>
                  <li>Mevcut fatura donemi sonuna kadar ucretli ozelliklere erismeye devam edersiniz.</li>
                  <li>Fatura donemi sona erdikten sonra hesabiniz ucretsiz plana dusurulur.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">5. Istisnalar</h2>
                <p>Tekrarlayan abonelik ve iade donguleri veya Kullanim Sartlarimizin ihlali gibi kotuye kullanim durumlarinda iade reddedilebilir.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-black dark:text-white mb-3">6. Iletisim</h2>
                <p>Iade politikamiz hakkinda sorulariniz icin <a href="mailto:support@viralspark.shop" className="text-blue-600 hover:underline">support@viralspark.shop</a> adresinden bize ulasin.</p>
              </section>
            </>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#27272a] text-center">
          <a href="/" className="text-sm text-gray-400 dark:text-[#71717a] hover:text-black dark:hover:text-white transition-colors">
            &larr; {isEn ? 'Back to home' : 'Ana sayfaya don'}
          </a>
        </div>
      </div>
    </div>
  )
}
