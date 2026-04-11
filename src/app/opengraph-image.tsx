import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ViralSpark - AI Social Media Content Generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000 0%, #1a1a2e 50%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#fff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            V
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '-2px',
            }}
          >
            ViralSpark
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Turn Your Ideas Into
          <span style={{ color: '#3B82F6' }}> Viral Content</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          AI-powered social media content for Twitter, Instagram, LinkedIn & TikTok
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '48px',
            padding: '24px 48px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>10,000+</span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Content Created</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>4</span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Platforms</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>85%</span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Viral Score</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
