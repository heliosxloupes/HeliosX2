import { ImageResponse } from 'next/og'

import { getSeoLandingPage } from '@/lib/seo-content'

export const runtime = 'edge'
export const alt = 'HeliosX Loupes SEO guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image({ params }: { params: { seoSlug: string } }) {
  const page = getSeoLandingPage(params.seoSlug)
  const title = page?.title ?? 'HeliosX Loupes'
  const kicker = page?.heroKicker ?? 'Surgical and dental loupes'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #020617 0%, #061012 46%, #000000 100%)',
          color: 'white',
          padding: 64,
          fontFamily: 'Arial',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, color: '#86efac', textTransform: 'uppercase' }}>
          {kicker}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 0.95, maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: '#cbd5e1', maxWidth: 840 }}>
            Affordable premium ergonomic prismatic surgical and dental loupes.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>HeliosX Loupes</div>
          <div style={{ fontSize: 22, color: '#a7f3d0' }}>heliosxloupes.com</div>
        </div>
      </div>
    ),
    size
  )
}
