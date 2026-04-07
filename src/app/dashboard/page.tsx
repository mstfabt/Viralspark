'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useToast } from '@/components/toast'
import { saveToHistory } from '@/lib/history'

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', color: 'bg-black', icon: 'X' },
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'IG' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-gray-900', icon: 'TT' },
]

type ContentResult = { text: string; score: number; tip: string | null }

export default function DashboardPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [topic, setTopic] = useState('')
  const [results, setResults] = useState<Record<string, ContentResult[]> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number; plan: string } | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter'])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const hasBrand = !!publicMeta.brand
  const canMulti = limits.multiPlatformPerMonth > 0

  // Onboarding check
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('vs_onboarded')) {
      setShowOnboarding(true)
    }
  }, [])

  const dismissOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('vs_onboarded', '1')
  }

  const togglePlatform = (id: string) => {
    if (!canMulti) {
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
        body: JSON.stringify({ prompt: topic, platforms: selectedPlatforms, variations: plan !== 'free' ? 3 : 1 }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setLimitReached(true)
        setErrorMsg(data.error)
      } else if (data.result) {
        // Normalize: if old format (single object per platform), wrap in array
        const normalized: Record<string, ContentResult[]> = {}
        for (const [key, val] of Object.entries(data.result)) {
          if (Array.isArray(val)) {
            normalized[key] = val as ContentResult[]
          } else {
            normalized[key] = [val as ContentResult]
          }
        }
        setResults(normalized)
        if (data.usage) setUsageInfo(data.usage)

        // Save to history (use first variation for each)
        const historyResults: Record<string, ContentResult> = {}
        for (const [key, val] of Object.entries(normalized)) {
          historyResults[key] = val[0]
        }
        saveToHistory({ prompt: topic, platforms: selectedPlatforms, results: historyResults })
        toast('Icerik uretildi!')
      } else {
        setErrorMsg(data.error || 'Bir hata olustu.')
      }
    } catch {
      setErrorMsg('Sunucuya baglanilamadi.')
    }
    setIsLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast('Kopyalandi!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">ViralSpark'a Hosgeldiniz!</h2>
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex gap-3 items-start">
                <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p><strong>Platform secin</strong> — Icerik uretmek istediginiz sosyal medya platformunu secin.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p><strong>Konunuzu yazin</strong> — Neyle ilgili icerik istiyorsaniz kisa bir aciklama girin.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p><strong>Uretin ve kullanin</strong> — AI viral skorlu icerik uretecek, kopyalayip kullanin!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={dismissOnboarding} className="flex-1 bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors">
                Baslayalim!
              </button>
              <a href="/dashboard/brand" onClick={dismissOnboarding} className="flex-1 bg-gray-100 text-center py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors">
                Once Marka Ayarla
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Icerik Uret</h1>
        {usageInfo && usageInfo.limit !== Infinity && (
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {usageInfo.used}/{usageInfo.limit} kullanim
          </span>
        )}
      </div>

      {!hasBrand && limits.brandProfiles > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          Marka profilinizi tanimlayin, icerikler markaniza ozel uretilsin.{' '}
          <a href="/dashboard/brand" className="font-semibold underline">Marka Ayarlari</a>
        </div>
      )}

      <p className="text-gray-500 mb-6 text-sm md:text-base">
        {canMulti
          ? 'Tek konudan tum platformlara ozel viral icerik uretin.'
          : 'Sectiginiz platforma ozel viral icerik uretin.'}
      </p>

      {/* Platform Selection */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedPlatforms.includes(p.id)
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            <span className="text-xs font-bold">{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
        {!canMulti && (
          <span className="flex items-center text-xs text-gray-400 ml-2">
            Coklu platform icin{' '}
            <a href="/#pricing" className="underline ml-1">plan yukseltin</a>
          </span>
        )}
      </div>

      {/* Input */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <textarea
          className="w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
          rows={3}
          placeholder="Orn: Yeni actigim butik kahveci icin viral icerik uret..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic || selectedPlatforms.length === 0}
          className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {isLoading ? 'Yapay Zeka Uretiyor...' : selectedPlatforms.length > 1 ? `${selectedPlatforms.length} Platform Icin Uret` : 'Icerik Uret'}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {selectedPlatforms.map((p) => (
            <div key={p} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="skeleton h-12" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error / Limit */}
      {limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600 mb-3">{errorMsg}</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm">
            Planini Yukselt
          </a>
        </div>
      )}

      {errorMsg && !limitReached && (
        <div className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {results && !isLoading && (
        <div className={`mt-8 grid gap-6 ${Object.keys(results).length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {PLATFORMS.filter((p) => results[p.id]).map((p) => {
            const variations = results[p.id]
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${p.color} text-white px-4 md:px-5 py-3 flex items-center justify-between`}>
                  <span className="font-semibold text-sm">{p.label}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {variations.map((item, idx) => (
                    <div key={idx} className="p-4 md:p-5">
                      {variations.length > 1 && (
                        <span className="text-xs text-gray-400 font-medium mb-2 block">Varyasyon {idx + 1}</span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(item.score)}`}>
                          {item.score}/100
                        </span>
                        <button
                          onClick={() => handleCopy(`${p.id}-${idx}`, item.text)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors ml-auto"
                        >
                          {copiedId === `${p.id}-${idx}` ? 'Kopyalandi!' : 'Kopyala'}
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">{item.text}</p>
                      {item.tip && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs text-amber-700"><span className="font-semibold">Iyilestirme:</span> {item.tip}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
