import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Reduce payload and speed up TTFB
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Long-term caching for static assets
  async headers() {
    return [
      {
        source: '/:path*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
    ]
  },
}

export default nextConfig
