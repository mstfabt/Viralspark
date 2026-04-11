import { ImageResponse } from 'next/og'
import { TOOLS } from '@/lib/tools-data'

export const runtime = 'edge'
export const alt = 'ViralSpark Tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = TOOLS.find((t) => t.slug === slug)
  const headline = tool?.tr.h1 ?? 'ViralSpark'
  const subtitle = tool?.tr.subtitle ?? 'AI sosyal medya içerik üretici'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0f',
          color: '#f5f5f7',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '50%',
            marginLeft: '-360px',
            width: '720px',
            height: '720px',
            background:
              'radial-gradient(circle, rgba(131,56,236,0.40) 0%, rgba(255,0,110,0.18) 35%, rgba(10,10,15,0) 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-260px',
            right: '-220px',
            width: '700px',
            height: '700px',
            background:
              'radial-gradient(circle, rgba(58,134,255,0.32) 0%, rgba(131,56,236,0.10) 38%, rgba(10,10,15,0) 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background:
                  'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: 900,
                color: '#fff',
              }}
            >
              V
            </div>
            <span
              style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}
            >
              ViralSpark
            </span>
          </div>
          <div
            style={{
              padding: '12px 26px',
              background:
                'linear-gradient(135deg, rgba(255,0,110,0.18), rgba(131,56,236,0.18), rgba(58,134,255,0.18))',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '999px',
              fontSize: '22px',
              color: '#fff',
              display: 'flex',
              fontWeight: 600,
            }}
          >
            AI Aracı
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: '32px',
            zIndex: 1,
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: headline.length > 50 ? '58px' : '68px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              display: 'flex',
              color: '#f5f5f7',
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: '#a1a1aa',
              display: 'flex',
              maxWidth: '980px',
            }}
          >
            {subtitle.length > 160 ? subtitle.slice(0, 157) + '…' : subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '26px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '24px', color: '#a1a1aa', display: 'flex' }}>
            viralspark.shop/tools
          </span>
          <span
            style={{
              fontSize: '24px',
              background:
                'linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            Ücretsiz Dene →
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
