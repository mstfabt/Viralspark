'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

const TONE_OPTIONS = [
  'Profesyonel ve ciddi',
  'Samimi ve sıcak',
  'Genç ve enerjik',
  'Eğlenceli ve espirili',
  'Lüks ve sofistike',
  'Eğitici ve bilgilendirici',
  'Cesur ve provokatif',
]

const SECTOR_OPTIONS = [
  'Teknoloji',
  'E-ticaret',
  'Yeme-İçme / Restoran',
  'Moda / Güzellik',
  'Sağlık / Fitness',
  'Eğitim',
  'Finans',
  'Gayrimenkul',
  'Turizm / Seyahat',
  'Sanat / Tasarım',
  'Diğer',
]

export default function BrandPage() {
  const { user } = useUser()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

      // Save to publicMetadata via API
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Marka Ayarları</h1>
        <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Bu özellik Starter ve üzeri planlarda</h2>
          <p className="text-gray-500 mb-6">Markanızı tanımlayın, içerikler otomatik olarak marka tonunuza uygun üretilsin.</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Planını Yükselt
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Marka Ayarları</h1>
      <p className="text-gray-500 mb-8">Markanızı tanımlayın, tüm içerikler otomatik olarak markanıza uygun üretilsin.</p>

      <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 space-y-6">
        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marka Adı *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Örn: ViralSpark"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sektör</label>
          <div className="flex flex-wrap gap-2">
            {SECTOR_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => updateField('sector', s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.sector === s
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Kitle</label>
          <input
            type="text"
            value={form.audience}
            onChange={(e) => updateField('audience', e.target.value)}
            placeholder="Örn: 25-35 yaş arası girişimciler, üniversite öğrencileri..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marka Tonu</label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => updateField('tone', t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.tone === t
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ek Notlar</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Örn: Emoji çok kullanılmasın, formal dil tercih ediyoruz, rakiplerimizden farkımız..."
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || !form.name}
          className="w-full bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Marka Profilini Kaydet'}
        </button>

        {saved && (
          <p className="text-center text-sm text-green-600">Marka profiliniz kaydedildi. Artık tüm içerikler markanıza özel üretilecek.</p>
        )}
      </div>
    </div>
  )
}
