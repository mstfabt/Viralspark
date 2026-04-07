'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', color: 'bg-black', icon: '𝕏' },
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'IG' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-gray-900', icon: 'TT' },
]

export default function DashboardPage() {
  const { user } = useUser()
  const [topic, setTopic] = useState('')
  const [results, setResults] = useState<Record<string, { text: string; score: number; tip: string | null }> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number; plan: string } | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const hasBrand = !!publicMeta.brand
  const canMulti = limits.multiPlatformPerMonth > 0

  const togglePlatform = (id: string) => {
    if (!canMulti) {
      // Free: tek platform seçimi
      setSelectedPlatforms([id])
      return
    }
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!topic || selectedPlatforms.length === 0) return
    setIsLoading(true)
    setResults(null)
    setLimitReached(false)
    setErrorMsg('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, platforms: selectedPlatforms }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.result) {
        setResults(data.result)
        if (data.usage) setUsageInfo(data.usage)
      } else {
        setErrorMsg(data.error || 'Bir hata oluştu.')
      }
    } catch {
      setErrorMsg('Sunucuya bağlanılamadı.')
    }
    setIsLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  const handleCopy = (platformId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(platformId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold tracking-tight">İçerik Üret</h1>
        {usageInfo && usageInfo.limit !== Infinity && (
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {usageInfo.used}/{usageInfo.limit} kullanım
          </span>
        )}
      </div>

      {!hasBrand && limits.brandProfiles > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          Marka profilinizi tanımlayın, içerikler markanıza özel üretilsin.{' '}
          <a href="/dashboard/brand" className="font-semibold underline">Marka Ayarları →</a>
        </div>
      )}

      <p className="text-gray-500 mb-6">
        {canMulti
          ? 'Tek konudan tüm platformlara özel viral içerik üretin.'
          : 'Seçtiğiniz platforma özel viral içerik üretin.'}
      </p>

      {/* Platform Selection */}
      <div className="flex flex-wrap gap-3 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedPlatforms.includes(p.id)
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            <span className="text-xs font-bold">{p.icon}</span>
            {p.label}
          </button>
        ))}
        {!canMulti && (
          <span className="flex items-center text-xs text-gray-400 ml-2">
            Çoklu platform için{' '}
            <a href="/#pricing" className="underline ml-1">plan yükseltin</a>
          </span>
        )}
      </div>

      {/* Input */}
      <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <textarea
          className="w-full p-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
          rows={3}
          placeholder="Örn: Yeni açtığım butik kahveci için viral içerik üret..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic || selectedPlatforms.length === 0}
          className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {isLoading ? 'Yapay Zeka Üretiyor...' : selectedPlatforms.length > 1 ? `${selectedPlatforms.length} Platform İçin Üret` : 'İçerik Üret'}
        </button>
      </div>

      {/* Error / Limit */}
      {limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 mb-3">{errorMsg}</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm">
            Planını Yükselt
          </a>
        </div>
      )}

      {errorMsg && !limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className={`mt-8 grid gap-6 ${Object.keys(results).length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {PLATFORMS.filter((p) => results[p.id]).map((p) => {
            const item = results[p.id]
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${p.color} text-white px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{p.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(p.id, item.text)}
                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                  >
                    {copiedId === p.id ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>
                <div className="p-5">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">{item.text}</p>
                  {item.tip && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs text-amber-700"><span className="font-semibold">İyileştirme:</span> {item.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
