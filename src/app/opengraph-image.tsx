import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ViralSpark — AI Sosyal Medya İçerik Üretici'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
            top: '-220px',
            left: '50%',
            marginLeft: '-380px',
            width: '760px',
            height: '760px',
            background:
              'radial-gradient(circle, rgba(131,56,236,0.42) 0%, rgba(255,0,110,0.18) 38%, rgba(10,10,15,0) 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-260px',
            right: '-200px',
            width: '680px',
            height: '680px',
            background:
              'radial-gradient(circle, rgba(58,134,255,0.30) 0%, rgba(131,56,236,0.12) 38%, rgba(10,10,15,0) 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background:
                'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 900,
              color: '#fff',
            }}
          >
            V
          </div>
          <span
            style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px' }}
          >
            ViralSpark
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
            gap: '28px',
          }}
        >
          <div
            style={{
              fontSize: '78px',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-3px',
              display: 'flex',
              flexWrap: 'wrap',
              color: '#f5f5f7',
            }}
          >
            <span style={{ display: 'flex' }}>Yapay zekayla&nbsp;</span>
            <span
              style={{
                background:
                  'linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
              }}
            >
              viral içerik
            </span>
          </div>
          <div
            style={{
              fontSize: '30px',
              lineHeight: 1.4,
              color: '#a1a1aa',
              display: 'flex',
              maxWidth: '900px',
            }}
          >
            Twitter, Instagram, LinkedIn ve TikTok için saniyeler içinde caption,
            hashtag ve hook üretin.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            paddingTop: '26px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            zIndex: 1,
          }}
        >
          {['Twitter', 'Instagram', 'LinkedIn', 'TikTok'].map((p) => (
            <div
              key={p}
              style={{
                padding: '10px 22px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '999px',
                fontSize: '22px',
                color: '#e4e4e7',
                display: 'flex',
              }}
            >
              {p}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '22px', color: '#a1a1aa', display: 'flex' }}>
            viralspark.shop
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
