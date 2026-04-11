'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { LanguageSelector } from '@/components/language-selector'
import { Logo } from '@/components/logo'

export default function ContactPage() {
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      // silent
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#13131a] text-black dark:text-white font-sans">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#13131a]/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="inline-flex"><Logo size={28} /></a>
          <LanguageSelector />
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 md:px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          {isEn ? 'Contact Us' : 'Bize Ulasin'}
        </h1>
        <p className="text-gray-500 dark:text-[#a1a1aa] text-center mb-12 text-lg font-light">
          {isEn
            ? 'Have a question or feedback? We\'d love to hear from you.'
            : 'Sorunuz veya geri bildiriminiz mi var? Size yardimci olmaktan mutluluk duyariz.'}
        </p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">
              {isEn ? 'Message Sent!' : 'Mesajiniz Gonderildi!'}
            </h2>
            <p className="text-gray-500 dark:text-[#a1a1aa]">
              {isEn ? 'We\'ll get back to you as soon as possible.' : 'En kisa surede size donecegiz.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#13131a] p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a] space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
                {isEn ? 'Name' : 'Adiniz'}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={isEn ? 'Your name' : 'Adinizi girin'}
                className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
                {isEn ? 'Email' : 'E-posta'}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={isEn ? 'your@email.com' : 'email@adresiniz.com'}
                className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">
                {isEn ? 'Message' : 'Mesajiniz'}
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={isEn ? 'How can we help you?' : 'Size nasil yardimci olabiliriz?'}
                className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (isEn ? 'Sending...' : 'Gonderiliyor...') : (isEn ? 'Send Message' : 'Mesaj Gonder')}
            </button>
          </form>
        )}

        <div className="mt-12 text-center text-sm text-gray-400 dark:text-[#71717a]">
          {isEn ? 'Or email us directly at' : 'Veya dogrudan e-posta gonderin:'}{' '}
          <a href="mailto:support@viralspark.shop" className="text-black dark:text-white font-medium hover:underline">
            support@viralspark.shop
          </a>
        </div>
      </main>
    </div>
  )
}
