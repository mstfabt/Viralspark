'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

const PLATFORMS = [
  { id: 'genel', label: 'Genel' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

type HashtagResult = {
  primary: string[]
  secondary: string[]
  trending: string[]
  niche: string[]
  avoid: string[]
  strategy: string
}

export default function HashtagsPage() {
  const { user } = useUser()
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('genel')
  const [result, setResult] = useState<HashtagResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const handleResearch = async () => {
    if (!topic) return
    setIsLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform }),
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

  const copyGroup = (label: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '))
    setCopiedGroup(label)
    setTimeout(() => setCopiedGroup(null), 2000)
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Hashtag Araştırma</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Bu özellik planınızda mevcut değil</h2>
          <p className="text-gray-500 mb-6">Hashtag araştırma aracına erişmek için planınızı yükseltin.</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Planını Yükselt
          </a>
        </div>
      </div>
    )
  }

  const TagGroup = ({ label, tags, color }: { label: string; tags: string[]; color: string }) => {
    if (!tags || tags.length === 0) return null
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{label}</h3>
          <button
            onClick={() => copyGroup(label, tags)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            {copiedGroup === label ? 'Kopyalandı!' : 'Tümünü Kopyala'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className={`text-sm px-3 py-1.5 rounded-full font-medium ${color}`}>
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Hashtag Araştırma</h1>
        <p className="text-gray-500 mt-1">AI destekli hashtag stratejisi. Konunuzu girin, en etkili hashtagleri bulun.</p>
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
        <textarea
          className="w-full p-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400"
          rows={2}
          placeholder="Örn: Butik kahve dükkanı, specialty coffee, üçüncü dalga..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleResearch() } }}
        />
        <button
          onClick={handleResearch}
          disabled={isLoading || !topic}
          className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-medium text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Araştırılıyor...' : 'Hashtag Araştır'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <TagGroup label="Ana Hashtagler (Yüksek Hacim)" tags={result.primary} color="bg-blue-100 text-blue-700" />
          <TagGroup label="İkincil Hashtagler (Orta Rekabet)" tags={result.secondary} color="bg-purple-100 text-purple-700" />
          <TagGroup label="Trend Hashtagler" tags={result.trending} color="bg-green-100 text-green-700" />
          <TagGroup label="Niş Hashtagler (Hedefli)" tags={result.niche} color="bg-amber-100 text-amber-700" />

          {result.avoid && result.avoid.length > 0 && (
            <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
              <h3 className="font-semibold text-sm text-red-600 mb-3">Kaçınılması Gerekenler</h3>
              <div className="space-y-2">
                {result.avoid.map((item, i) => (
                  <p key={i} className="text-sm text-red-500">• {item}</p>
                ))}
              </div>
            </div>
          )}

          {result.strategy && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-2">Strateji Notu</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{result.strategy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
