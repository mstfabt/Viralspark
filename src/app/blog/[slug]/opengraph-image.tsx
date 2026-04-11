import { ImageResponse } from 'next/og'
import { BLOG_POSTS } from '@/lib/blog-data'

export const runtime = 'edge'
export const alt = 'ViralSpark Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  const title = post?.title ?? 'ViralSpark Blog'
  const category = post?.category ?? ''
  const locale = post?.locale ?? 'tr'

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
            right: '-180px',
            width: '720px',
            height: '720px',
            background:
              'radial-gradient(circle, rgba(255,0,110,0.38) 0%, rgba(131,56,236,0.18) 38%, rgba(10,10,15,0) 70%)',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-280px',
            left: '-220px',
            width: '760px',
            height: '760px',
            background:
              'radial-gradient(circle, rgba(58,134,255,0.32) 0%, rgba(131,56,236,0.12) 38%, rgba(10,10,15,0) 70%)',
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
          {category && (
            <div
              style={{
                padding: '12px 26px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '999px',
                fontSize: '22px',
                color: '#fff',
                display: 'flex',
              }}
            >
              {category}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            marginTop: '40px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? '56px' : '68px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              display: 'flex',
              color: '#f5f5f7',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '40px',
            paddingTop: '26px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '24px', color: '#a1a1aa', display: 'flex' }}>
            viralspark.shop/blog
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
            {locale === 'tr' ? 'Yazıyı oku →' : 'Read post →'}
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
