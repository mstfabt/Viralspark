'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'

const TONE_OPTIONS_TR = [
  'Profesyonel ve ciddi',
  'Samimi ve sicak',
  'Genc ve enerjik',
  'Eglenceli ve espirili',
  'Luks ve sofistike',
  'Egitici ve bilgilendirici',
  'Cesur ve provokatif',
]

const TONE_OPTIONS_EN = [
  'Professional and serious',
  'Friendly and warm',
  'Young and energetic',
  'Fun and witty',
  'Luxury and sophisticated',
  'Educational and informative',
  'Bold and provocative',
]

const SECTOR_OPTIONS_TR = [
  'Teknoloji', 'E-ticaret', 'Yeme-Icme / Restoran', 'Moda / Guzellik',
  'Saglik / Fitness', 'Egitim', 'Finans', 'Gayrimenkul',
  'Turizm / Seyahat', 'Sanat / Tasarim', 'Diger',
]

const SECTOR_OPTIONS_EN = [
  'Technology', 'E-commerce', 'Food & Beverage', 'Fashion / Beauty',
  'Health / Fitness', 'Education', 'Finance', 'Real Estate',
  'Tourism / Travel', 'Art / Design', 'Other',
]

export default function BrandPage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toneOptions = locale === 'en' ? TONE_OPTIONS_EN : TONE_OPTIONS_TR
  const sectorOptions = locale === 'en' ? SECTOR_OPTIONS_EN : SECTOR_OPTIONS_TR

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const existingBrand = publicMeta.brand as Record<string, string> | undefined

  const [form, setForm] = useState({
    name: '',
    sector: '',
    audience: '',
    tone: '',
    notes: '',
  })

  useEffect(() => {
    if (existingBrand) {
      setForm({
        name: existingBrand.name || '',
        sector: existingBrand.sector || '',
        audience: existingBrand.audience || '',
        tone: existingBrand.tone || '',
        notes: existingBrand.notes || '',
      })
    }
  }, [existingBrand])

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    setSaved(false)
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          brandDraft: form,
        },
      })

      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('Brand save error:', err)
    }
    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (limits.brandProfiles === 0) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t('brand.title')}</h1>
        <div className="bg-white dark:bg-[#13131a] p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">{t('brand.locked')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('brand.locked.desc')}</p>
          <a href="/#pricing" className="inline-block brand-grad brand-shadow px-8 py-4 rounded-full font-semibold">
            {t('common.upgrade')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t('brand.title')}</h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-8">{t('brand.desc')}</p>

      <div className="bg-white dark:bg-[#13131a] p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a] space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('brand.name')} *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="ViralSpark"
            className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('brand.sector')}</label>
          <div className="flex flex-wrap gap-2">
            {sectorOptions.map((s) => (
              <button
                key={s}
                onClick={() => updateField('sector', s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.sector === s
                    ? 'brand-grad brand-shadow-sm border-transparent'
                    : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('brand.audience')}</label>
          <input
            type="text"
            value={form.audience}
            onChange={(e) => updateField('audience', e.target.value)}
            placeholder={t('brand.audience.placeholder')}
            className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('brand.tone')}</label>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((item) => (
              <button
                key={item}
                onClick={() => updateField('tone', item)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.tone === item
                    ? 'brand-grad brand-shadow-sm border-transparent'
                    : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#d4d4d8] mb-2">{t('brand.notes')}</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder={t('brand.notes.placeholder')}
            rows={3}
            className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b]"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.name}
          className="w-full brand-grad brand-shadow py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? t('brand.saving') : saved ? t('brand.saved') : t('brand.save')}
        </button>

        {saved && (
          <p className="text-center text-sm text-green-600">{t('brand.saved.desc')}</p>
        )}
      </div>
    </div>
  )
}
