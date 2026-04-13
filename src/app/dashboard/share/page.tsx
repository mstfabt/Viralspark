'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect, useRef, useCallback } from 'react'
import { PLAN_LIMITS, type PlanType } from '@/lib/plans'
import { useLanguage } from '@/components/language-provider'
import { useUpgradeModal } from '@/components/upgrade-modal'
import { useGenerationCache } from '@/lib/generation-cache'

const OVERLAY_STYLES = [
  { id: 'bottom-dark', label: { tr: 'Alt Koyu Bant', en: 'Bottom Dark' }, position: 'bottom' as const, bg: 'rgba(0,0,0,0.7)', text: '#fff' },
  { id: 'top-dark', label: { tr: 'Üst Koyu Bant', en: 'Top Dark' }, position: 'top' as const, bg: 'rgba(0,0,0,0.7)', text: '#fff' },
  { id: 'center-dark', label: { tr: 'Orta Koyu', en: 'Center Dark' }, position: 'center' as const, bg: 'rgba(0,0,0,0.6)', text: '#fff' },
  { id: 'bottom-light', label: { tr: 'Alt Açık Bant', en: 'Bottom Light' }, position: 'bottom' as const, bg: 'rgba(255,255,255,0.85)', text: '#000' },
  { id: 'gradient', label: { tr: 'Gradient Alt', en: 'Gradient Bottom' }, position: 'gradient' as const, bg: 'linear', text: '#fff' },
]

const PLATFORM_SIZES = [
  { id: 'instagram-square', label: 'Instagram Kare', width: 1080, height: 1080 },
  { id: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920 },
  { id: 'twitter', label: 'Twitter/X', width: 1200, height: 675 },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627 },
]

const BG_TEMPLATES = [
  { id: 'gradient-1', label: 'Sunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', colors: ['#f093fb', '#f5576c'] },
  { id: 'gradient-2', label: 'Ocean', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', colors: ['#4facfe', '#00f2fe'] },
  { id: 'gradient-3', label: 'Purple', css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', colors: ['#a18cd1', '#fbc2eb'] },
  { id: 'gradient-4', label: 'Dark', css: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)', colors: ['#0c0c0c', '#1a1a2e', '#16213e'] },
  { id: 'gradient-5', label: 'Emerald', css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', colors: ['#11998e', '#38ef7d'] },
  { id: 'gradient-6', label: 'Fire', css: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', colors: ['#f12711', '#f5af19'] },
  { id: 'gradient-7', label: 'Midnight', css: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', colors: ['#2b5876', '#4e4376'] },
  { id: 'gradient-8', label: 'Coral', css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', colors: ['#ff9a9e', '#fecfef'] },
  { id: 'solid-black', label: 'Black', css: '#000000', colors: ['#000000'] },
  { id: 'solid-white', label: 'White', css: '#ffffff', colors: ['#ffffff'] },
]

export default function SharePage() {
  const { user } = useUser()
  const { t, locale } = useLanguage()
  const { open: openUpgrade } = useUpgradeModal()
  const publicMeta = (user?.publicMetadata || {}) as Record<string, unknown>
  const status = publicMeta.subscriptionStatus as string
  const plan = (status === 'active' || status === 'on_trial' || status === 'cancelled')
    ? (publicMeta.plan as PlanType || 'free')
    : 'free'
  const limits = PLAN_LIMITS[plan]

  const [bgMode, setBgMode] = useState<'template' | 'image'>('template')
  const [selectedBg, setSelectedBg] = useState(BG_TEMPLATES[0])
  const [image, setImage] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [caption, setCaption] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [overlayStyle, setOverlayStyle] = useState(OVERLAY_STYLES[0])
  const [platformSize, setPlatformSize] = useState(PLATFORM_SIZES[0])
  const [overlayText, setOverlayText] = useState('')
  const [copiedCaption, setCopiedCaption] = useState(false)
  const { cachedResult, saveResult } = useGenerationCache<{ overlay: string; caption: string }>('share')

  useEffect(() => {
    if (cachedResult) {
      setOverlayText(cachedResult.overlay)
      setCaption(cachedResult.caption)
    }
  }, [cachedResult])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEn = locale === 'en'

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImage(ev.target?.result as string)
      setBgMode('image')
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!topic) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, lang: locale }),
      })
      const data = await res.json()

      if (data.limitReached) {
        setCaption(data.error)
        return
      }

      if (data.error) {
        setCaption(data.error)
        return
      }

      const overlay = data.result?.overlay || ''
      const captionText = data.result?.caption || ''
      setOverlayText(overlay)
      setCaption(captionText)
      if (overlay || captionText) {
        saveResult({ overlay, caption: captionText }, topic)
      }
    } catch {
      setCaption(t('common.error'))
    }
    setIsLoading(false)
  }

  const drawGradientBg = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (selectedBg.colors.length === 1) {
      ctx.fillStyle = selectedBg.colors[0]
      ctx.fillRect(0, 0, w, h)
    } else {
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      selectedBg.colors.forEach((color, i) => {
        gradient.addColorStop(i / (selectedBg.colors.length - 1), color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }
  }

  const drawOverlayText = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (!overlayText) return

    const fontSize = Math.floor(w / 16)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    const padding = 40
    const maxWidth = w - padding * 2
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

    if (bgMode === 'template') {
      // On template backgrounds, render text centered with subtle shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 4
      ctx.fillStyle = selectedBg.id === 'solid-white' ? '#000' : '#fff'
      const startY = (h - totalHeight) / 2
      lines.forEach((line, i) => {
        ctx.fillText(line, w / 2, startY + (i + 1) * lineHeight)
      })
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
    } else {
      // On uploaded images, use overlay style
      if (overlayStyle.position === 'bottom' || overlayStyle.position === 'gradient') {
        if (overlayStyle.position === 'gradient') {
          const gradient = ctx.createLinearGradient(0, h - totalHeight - 120, 0, h)
          gradient.addColorStop(0, 'rgba(0,0,0,0)')
          gradient.addColorStop(0.5, 'rgba(0,0,0,0.7)')
          gradient.addColorStop(1, 'rgba(0,0,0,0.9)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, h - totalHeight - 120, w, totalHeight + 120)
        } else {
          ctx.fillStyle = overlayStyle.bg
          ctx.fillRect(0, h - totalHeight - 80, w, totalHeight + 80)
        }
        ctx.fillStyle = overlayStyle.text
        lines.forEach((line, i) => {
          ctx.fillText(line, w / 2, h - totalHeight - 40 + (i + 1) * lineHeight)
        })
      } else if (overlayStyle.position === 'top') {
        ctx.fillStyle = overlayStyle.bg
        ctx.fillRect(0, 0, w, totalHeight + 80)
        ctx.fillStyle = overlayStyle.text
        lines.forEach((line, i) => {
          ctx.fillText(line, w / 2, 40 + (i + 1) * lineHeight)
        })
      } else {
        ctx.fillStyle = overlayStyle.bg
        const y = (h - totalHeight) / 2 - 40
        ctx.fillRect(0, y, w, totalHeight + 80)
        ctx.fillStyle = overlayStyle.text
        lines.forEach((line, i) => {
          ctx.fillText(line, w / 2, y + 40 + (i + 1) * lineHeight)
        })
      }
    }
  }

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = platformSize.width
    canvas.height = platformSize.height

    if (bgMode === 'template') {
      drawGradientBg(ctx, canvas.width, canvas.height)
      drawOverlayText(ctx, canvas.width, canvas.height)
    } else if (image) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
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
        drawOverlayText(ctx, canvas.width, canvas.height)
      }
      img.src = image
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, overlayText, overlayStyle, platformSize, bgMode, selectedBg])

  // Re-render canvas when dependencies change
  const prevDeps = useRef('')
  const depsKey = `${bgMode}-${selectedBg.id}-${image}-${overlayText}-${overlayStyle.id}-${platformSize.id}`
  if (depsKey !== prevDeps.current) {
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t('share.title')}</h1>
        <div className="bg-white dark:bg-[#13131a] p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-[#27272a]">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">{t('common.locked')}</h2>
          <p className="text-gray-500 dark:text-[#a1a1aa] mb-6">{t('common.locked.desc')}</p>
          <button type="button" onClick={openUpgrade} className="inline-block brand-grad brand-shadow px-8 py-4 rounded-full font-semibold">
            {t('common.upgrade')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t('share.title')}</h1>
      <p className="text-gray-500 dark:text-[#a1a1aa] mb-8">
        {isEn ? 'Choose a background or upload a photo, add AI text, download ready-to-share visuals.' : 'Arka plan sec veya fotograf yukle, AI metin ekle, paylasima hazir gorsel indir.'}
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Background Mode Toggle */}
          <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
            <h3 className="font-semibold mb-3">{isEn ? '1. Background' : '1. Arka Plan'}</h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setBgMode('template')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  bgMode === 'template' ? 'brand-grad brand-shadow-sm border-transparent' : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                }`}
              >
                {isEn ? 'Templates' : 'Sablonlar'}
              </button>
              <button
                onClick={() => setBgMode('image')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  bgMode === 'image' ? 'brand-grad brand-shadow-sm border-transparent' : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                }`}
              >
                {isEn ? 'Upload Photo' : 'Fotograf Yukle'}
              </button>
            </div>

            {bgMode === 'template' ? (
              <div className="grid grid-cols-5 gap-2">
                {BG_TEMPLATES.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`aspect-square rounded-xl border-2 transition-all ${
                      selectedBg.id === bg.id ? 'border-black scale-95' : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ background: bg.css }}
                    title={bg.label}
                  />
                ))}
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {image ? (
                  <div className="relative">
                    <img src={image} alt="" className="w-full h-40 object-cover rounded-xl" />
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
                    className="w-full h-40 border-2 border-dashed border-gray-200 dark:border-[#27272a] rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-[#71717a] hover:border-gray-400 dark:hover:border-[#52525b] hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isEn ? 'Select or drag a photo' : 'Fotograf sec veya surukle'}
                  </button>
                )}
              </>
            )}
          </div>

          {/* AI Text Generation */}
          <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
            <h3 className="font-semibold mb-3">{isEn ? '2. Generate AI Text' : '2. AI ile Metin Uret'}</h3>
            <textarea
              className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d62976] focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#52525b] text-sm"
              rows={2}
              placeholder={isEn ? 'Enter your topic... E.g.: New menu at our coffee shop' : 'Konunuzu yazin... Orn: Kahve dukkaninizin yeni menusu'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full mt-3 brand-grad brand-shadow-sm py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (isEn ? 'Generating...' : 'Uretiliyor...') : (isEn ? 'Generate Slogan + Caption' : 'Slogan + Caption Uret')}
            </button>
          </div>

          {/* Overlay Text Edit */}
          {overlayText && (
            <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
              <h3 className="font-semibold mb-3">{isEn ? '3. Visual Text' : '3. Gorseldeki Metin'}</h3>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full p-4 bg-gray-50 dark:bg-[#1a1a22] border border-gray-200 dark:border-[#27272a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d62976] text-sm"
              />
            </div>
          )}

          {/* Style Options */}
          <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
            {bgMode === 'image' && (
              <>
                <h3 className="font-semibold mb-3">{isEn ? 'Text Style' : 'Metin Stili'}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {OVERLAY_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setOverlayStyle(s)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        overlayStyle.id === s.id ? 'brand-grad brand-shadow-sm border-transparent' : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
                      }`}
                    >
                      {s.label[locale]}
                    </button>
                  ))}
                </div>
              </>
            )}

            <h3 className="font-semibold mb-3">{isEn ? 'Size' : 'Boyut'}</h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPlatformSize(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    platformSize.id === s.id ? 'brand-grad brand-shadow-sm border-transparent' : 'bg-white dark:bg-[#13131a] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-[#27272a] hover:border-gray-400 dark:hover:border-[#52525b]'
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
          <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{isEn ? 'Preview' : 'Onizleme'}</h3>
              <button
                onClick={handleDownload}
                className="text-sm font-semibold brand-grad brand-shadow-sm px-4 py-2 rounded-lg"
              >
                {isEn ? 'Download PNG' : 'PNG Indir'}
              </button>
            </div>
            <div className="bg-gray-100 dark:bg-[#1f1f26] rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 300 }}>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Caption */}
          {caption && (
            <div className="bg-white dark:bg-[#13131a] p-6 rounded-2xl border border-gray-100 dark:border-[#27272a] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{isEn ? 'Caption Text' : 'Paylasim Metni'}</h3>
                <button
                  onClick={handleCopyCaption}
                  className="text-sm text-gray-500 dark:text-[#a1a1aa] hover:text-black dark:hover:text-white transition-colors"
                >
                  {copiedCaption ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-[#1a1a22] p-4 rounded-xl">{caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
