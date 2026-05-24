import { ImageResponse } from 'next/og'

import { getEducationGuide } from '@/lib/seo-content'

export const runtime = 'edge'
export const alt = 'HeliosX Loupes education guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image({ params }: { params: { slug: string } }) {
  const guide = getEducationGuide(params.slug)
  const title = guide?.title ?? 'HeliosX Education'
  const kicker = guide?.kicker ?? 'Education'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #030712 0%, #082f49 48%, #020617 100%)',
          color: 'white',
          padding: 64,
          fontFamily: 'Arial',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, color: '#7dd3fc', textTransform: 'uppercase' }}>
          {kicker}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 0.98, maxWidth: 940 }}>
            {title}
          </div>
          <div style={{ fontSize: 27, color: '#dbeafe', maxWidth: 850 }}>
            Evidence-backed loupe education for fit, posture, magnification, and buying decisions.
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>HeliosX Loupes</div>
      </div>
    ),
    size
  )
}
