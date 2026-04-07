'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useRef, useCallback } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'

const OVERLAY_STYLES = [
  { id: 'bottom-dark', label: 'Alt Koyu Bant', position: 'bottom' as const, bg: 'rgba(0,0,0,0.7)', text: '#fff' },
  { id: 'top-dark', label: 'Üst Koyu Bant', position: 'top' as const, bg: 'rgba(0,0,0,0.7)', text: '#fff' },
  { id: 'center-dark', label: 'Orta Koyu', position: 'center' as const, bg: 'rgba(0,0,0,0.6)', text: '#fff' },
  { id: 'bottom-light', label: 'Alt Açık Bant', position: 'bottom' as const, bg: 'rgba(255,255,255,0.85)', text: '#000' },
  { id: 'gradient', label: 'Gradient Alt', position: 'gradient' as const, bg: 'linear', text: '#fff' },
]

const PLATFORM_SIZES = [
  { id: 'instagram-square', label: 'Instagram Kare', width: 1080, height: 1080 },
  { id: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920 },
  { id: 'twitter', label: 'Twitter/X', width: 1200, height: 675 },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627 },
]

export default function SharePage() {
  const { user } = useUser()
  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const status = publicMeta.subscriptionStatus as string
  const plan = (status === 'active' || status === 'on_trial' || status === 'cancelled')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]

  const [image, setImage] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [caption, setCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [overlayStyle, setOverlayStyle] = useState(OVERLAY_STYLES[0])
  const [platformSize, setPlatformSize] = useState(PLATFORM_SIZES[0])
  const [overlayText, setOverlayText] = useState('')
  const [copiedCaption, setCopiedCaption] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!topic) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${topic}. Fotoğraf üzerine yazılacak kısa ve vurucu bir slogan/başlık (max 10 kelime) ve ayrı olarak caption metni üret.

JSON formatında döndür:
{"overlay": "fotoğraf üzerine yazılacak kısa slogan", "caption": "paylaşım açıklaması metni hashtaglerle"}

SADECE JSON döndür.`, platforms: ['instagram'] }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setCaption(data.error)
        return
      }

      // Extract text from the result - handle both old and new formats
      const igResult = data.result?.instagram
      let rawText = ''
      if (Array.isArray(igResult)) {
        rawText = igResult[0]?.text || ''
      } else if (igResult && typeof igResult === 'object') {
        rawText = igResult.text || ''
      } else {
        rawText = String(igResult || '')
      }

      // Try to parse as JSON (overlay + caption)
      let parsed
      try {
        const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        parsed = JSON.parse(cleaned)
      } catch {
        // Fallback: use raw text
        setOverlayText(rawText.slice(0, 50))
        setCaption(rawText)
        return
      }

      setOverlayText(parsed.overlay || '')
      setCaption(parsed.caption || '')
    } catch {
      setCaption('Hata oluştu, tekrar deneyin.')
    }
    setIsLoading(false)
  }

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = platformSize.width
    canvas.height = platformSize.height

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Cover-fit the image
      const imgRatio = img.width / img.height
      const canvasRatio = canvas.width / canvas.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height

      if (imgRatio > canvasRatio) {
        sw = img.height * canvasRatio
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / canvasRatio
        sy = (img.height - sh) / 2
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

      if (overlayText) {
        const fontSize = Math.floor(canvas.width / 18)
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'

        const padding = 40
        const maxWidth = canvas.width - padding * 2
        const words = overlayText.split(' ')
        const lines: string[] = []
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        }
        if (currentLine) lines.push(currentLine)

        const lineHeight = fontSize * 1.4
        const totalHeight = lines.length * lineHeight

        if (overlayStyle.position === 'bottom' || overlayStyle.position === 'gradient') {
          if (overlayStyle.position === 'gradient') {
            const gradient = ctx.createLinearGradient(0, canvas.height - totalHeight - 120, 0, canvas.height)
            gradient.addColorStop(0, 'rgba(0,0,0,0)')
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.7)')
            gradient.addColorStop(1, 'rgba(0,0,0,0.9)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, canvas.height - totalHeight - 120, canvas.width, totalHeight + 120)
          } else {
            ctx.fillStyle = overlayStyle.bg
            ctx.fillRect(0, canvas.height - totalHeight - 80, canvas.width, totalHeight + 80)
          }
          ctx.fillStyle = overlayStyle.text
          lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, canvas.height - totalHeight - 40 + (i + 1) * lineHeight)
          })
        } else if (overlayStyle.position === 'top') {
          ctx.fillStyle = overlayStyle.bg
          ctx.fillRect(0, 0, canvas.width, totalHeight + 80)
          ctx.fillStyle = overlayStyle.text
          lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, 40 + (i + 1) * lineHeight)
          })
        } else {
          // center
          ctx.fillStyle = overlayStyle.bg
          const y = (canvas.height - totalHeight) / 2 - 40
          ctx.fillRect(0, y, canvas.width, totalHeight + 80)
          ctx.fillStyle = overlayStyle.text
          lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, y + 40 + (i + 1) * lineHeight)
          })
        }
      }
    }
    img.src = image
  }, [image, overlayText, overlayStyle, platformSize])

  // Re-render canvas when dependencies change
  const prevDeps = useRef('')
  const depsKey = `${image}-${overlayText}-${overlayStyle.id}-${platformSize.id}`
  if (depsKey !== prevDeps.current && image) {
    prevDeps.current = depsKey
    setTimeout(renderCanvas, 50)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `viralspark-${platformSize.id}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption)
    setCopiedCaption(true)
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  if (limits.multiPlatformPerMonth === 0 && limits.singlePostsPerMonth <= 5) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Paylaşım Paketi</h1>
        <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Bu özellik Starter ve üzeri planlarda</h2>
          <p className="text-gray-500 mb-6">Fotoğrafınıza AI metin ekleyip paylaşıma hazır görseller oluşturun.</p>
          <a href="/#pricing" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Planını Yükselt
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Paylaşım Paketi</h1>
      <p className="text-gray-500 mb-8">Fotoğraf yükle, AI metin ekle, paylaşıma hazır görsel indir.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold mb-3">1. Fotoğraf Yükle</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {image ? (
              <div className="relative">
                <img src={image} alt="Yüklenen" className="w-full h-48 object-cover rounded-xl" />
                <button
                  onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-black/70"
                >
                  X
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fotoğraf seç veya sürükle
              </button>
            )}
          </div>

          {/* AI Text Generation */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold mb-3">2. AI ile Metin Üret</h3>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none placeholder:text-gray-400 text-sm"
              rows={2}
              placeholder="Konunuzu yazın... Örn: Kahve dükkanımızın yeni menüsü"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full mt-3 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Üretiliyor...' : 'Slogan + Caption Üret'}
            </button>
          </div>

          {/* Overlay Text Edit */}
          {overlayText && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold mb-3">3. Görseldeki Metin</h3>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>
          )}

          {/* Style Options */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold mb-3">Stil</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {OVERLAY_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setOverlayStyle(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    overlayStyle.id === s.id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Boyut</h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPlatformSize(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    platformSize.id === s.id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview + Caption */}
        <div className="space-y-6">
          {/* Canvas Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Önizleme</h3>
              {image && (
                <button
                  onClick={handleDownload}
                  className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  PNG İndir
                </button>
              )}
            </div>
            <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 300 }}>
              {image ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[500px] object-contain"
                />
              ) : (
                <p className="text-gray-400 text-sm py-20">Fotoğraf yükleyin</p>
              )}
            </div>
          </div>

          {/* Caption */}
          {caption && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Paylaşım Metni</h3>
                <button
                  onClick={handleCopyCaption}
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  {copiedCaption ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-xl">{caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
