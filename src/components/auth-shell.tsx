'use client'

import { useLanguage } from './language-provider'

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'

  return (
    <div className="min-h-screen relative overflow-hidden bg-black antialiased">
      {/* Instagram gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]" />

      {/* Soft color blobs for depth */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#fa7e1e] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-[#962fbf] blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#4f5bd5] blur-3xl opacity-50 pointer-events-none" />

      {/* Subtle noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left: Brand hero */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 text-white">
          <a href="/" className="inline-flex items-center gap-2.5 group w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-512.svg"
              alt="ViralSpark"
              width={40}
              height={40}
              className="drop-shadow-xl group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-semibold tracking-tight drop-shadow-sm">
              ViralSpark.
            </span>
          </a>

          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] mb-6 tracking-tight drop-shadow-sm">
              {isEn ? (
                <>
                  Viral content in{' '}
                  <span className="italic font-light">seconds.</span>
                </>
              ) : (
                <>
                  Viral içerikler{' '}
                  <span className="italic font-light">saniyeler</span> içinde.
                </>
              )}
            </h1>
            <p className="text-white/85 text-lg xl:text-xl font-light leading-relaxed max-w-md">
              {isEn
                ? 'AI-powered social media assistant. Generate viral posts for Twitter, Instagram, LinkedIn & TikTok.'
                : 'Yapay zeka destekli sosyal medya asistanı. Twitter, Instagram, LinkedIn ve TikTok için viral içerikler üretin.'}
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'bg-[#feda75]',
                  'bg-[#fa7e1e]',
                  'bg-[#d62976]',
                  'bg-[#962fbf]',
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full border-2 border-white/90 ${c} shadow-lg`}
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">
                  {isEn ? '10,000+ creators' : '10.000+ içerik üretici'}
                </div>
                <div className="text-white/70 text-xs">
                  {isEn ? 'trust ViralSpark' : 'bize güveniyor'}
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-xs">
            © 2026 ViralSpark.{' '}
            {isEn ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </p>
        </div>

        {/* Right: Auth card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6 flex justify-center">
              <a href="/" className="inline-flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-512.svg"
                  alt="ViralSpark"
                  width={36}
                  height={36}
                  className="drop-shadow-xl"
                />
                <span className="text-2xl font-semibold tracking-tight text-white drop-shadow-md">
                  ViralSpark.
                </span>
              </a>
            </div>

            {/* Glassmorphic card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] p-6 sm:p-8 border border-white/40">
              {children}
            </div>

            {/* Mobile footer */}
            <p className="lg:hidden text-center text-white/70 text-xs mt-6 drop-shadow-sm">
              © 2026 ViralSpark
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
