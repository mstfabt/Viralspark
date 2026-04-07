'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useMemo } from 'react'
import { HOOKS, HOOK_CATEGORIES, type Hook } from '@/lib/hooks-data'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

const PLATFORM_FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

const ENGAGEMENT_COLORS = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-500',
}

export default function HooksPage() {
  const { user } = useUser()
  const [category, setCategory] = useState('Tümü')
  const [platform, setPlatform] = useState('all')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const plan = (publicMeta.subscriptionStatus === 'active' || publicMeta.subscriptionStatus === 'on_trial')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]
  const isLocked = limits.singlePostsPerMonth === 0

  const filtered = useMemo(() => {
    return HOOKS.filter((h) => {
      if (category !== 'Tümü' && h.category !== category) return false
      if (platform !== 'all' && h.platform !== platform) return false
      return true
    })
  }, [category, platform])

  const handleCopy = (hook: Hook) => {
    navigator.clipboard.writeText(hook.text)
    setCopiedId(hook.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLocked) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Hook Kütüphanesi</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Bu özellik planınızda mevcut değil</h2>
          <p className="text-gray-500 mb-6">Hook kütüphanesine erişmek için planınızı yükseltin.</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Hook Kütüphanesi</h1>
        <p className="text-gray-500 mt-1">Viral içerikler için kanıtlanmış hook cümleleri. Kopyala ve kullan.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {HOOK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PLATFORM_FILTERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              platform === p.id
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-400 mb-4">{filtered.length} hook bulundu</p>

      {/* Hook Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((hook) => (
          <div
            key={hook.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <p className="text-gray-800 text-base leading-relaxed mb-4">&ldquo;{hook.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                  {hook.category}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                  {hook.platform}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ENGAGEMENT_COLORS[hook.engagement]}`}>
                  {hook.engagement === 'high' ? 'Yüksek' : hook.engagement === 'medium' ? 'Orta' : 'Düşük'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(hook)}
                className="text-xs bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedId === hook.id ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
