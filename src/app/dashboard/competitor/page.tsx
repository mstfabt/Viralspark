'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

type CompetitorResult = {
  topStrategies: { strategy: string; description: string; effectiveness: string }[]
  contentTypes: { type: string; frequency: string; engagement: string }[]
  bestTimes: string[]
  gaps: string[]
  hooks: string[]
  recommendations: string
}

const PLATFORMS = [
  { id: 'genel', label: 'Genel' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

export default function CompetitorPage() {
  const { user } = useUser()
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('genel')
  const [competitors, setCompetitors] = useState('')
  const [result, setResult] = useState<CompetitorResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const handleAnalyze = async () => {
    if (!niche) return
    setIsLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform, competitors }),
      })
      const data = await res.json()
      if (data.limitReached) {
        setError(data.error)
      } else if (data.result) {
        setResult(data.result)
      } else {
        setError(data.error || 'Bir hata oluştu.')
      }
    } catch {
      setError('Sunucuya bağlanılamadı.')
    }
    setIsLoading(false)
  }

  const effectivenessColor = (e: string) => {
    if (e === 'high') return 'bg-green-100 text-green-700'
    if (e === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-500'
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Rakip Analizi</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Bu özellik planınızda mevcut değil</h2>
          <p className="text-gray-500 mb-6">Rakip analizi aracına erişmek için planınızı yükseltin.</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Planını Yükselt
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Rakip Analizi</h1>
        <p className="text-gray-500 mt-1">Sektörünüzdeki sosyal medya stratejilerini analiz edin, fırsatları keşfedin.</p>
      </div>

      {/* Input */}
      <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                platform === p.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          className="w-full p-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400 mb-3"
          placeholder="Sektör/Niş: Örn: Butik kahve, fitness koçluğu, SaaS..."
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
        <input
          className="w-full p-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
          placeholder="Rakip hesaplar (opsiyonel): @hesap1, @hesap2..."
          value={competitors}
          onChange={(e) => setCompetitors(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !niche}
          className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analiz Ediliyor...' : 'Rakip Analizi Yap'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Top Strategies */}
          {result.topStrategies && result.topStrategies.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold mb-4">En Etkili Stratejiler</h3>
              <div className="space-y-3">
                {result.topStrategies.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg font-bold text-gray-300 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{s.strategy}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${effectivenessColor(s.effectiveness)}`}>
                          {s.effectiveness === 'high' ? 'Yüksek' : s.effectiveness === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Types */}
          {result.contentTypes && result.contentTypes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold mb-4">İçerik Türleri ve Sıklık</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {result.contentTypes.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl">
                    <p className="font-medium text-sm">{c.type}</p>
                    <p className="text-xs text-gray-500 mt-1">Haftalık: {c.frequency} | Etkileşim: {c.engagement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Best Times */}
            {result.bestTimes && result.bestTimes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold mb-3">En İyi Paylaşım Zamanları</h3>
                <div className="space-y-2">
                  {result.bestTimes.map((t, i) => (
                    <p key={i} className="text-sm text-gray-600">• {t}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {result.gaps && result.gaps.length > 0 && (
              <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
                <h3 className="font-semibold mb-3 text-green-700">Fırsatlar (Rakiplerin Kaçırdığı)</h3>
                <div className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <p key={i} className="text-sm text-green-600">• {g}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hooks */}
          {result.hooks && result.hooks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Bu Sektörde Etkili Hook Cümleleri</h3>
              <div className="space-y-2">
                {result.hooks.map((h, i) => (
                  <p key={i} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg">&ldquo;{h}&rdquo;</p>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && (
            <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
              <h3 className="font-semibold mb-2 text-blue-700">Genel Strateji Önerisi</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{result.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
