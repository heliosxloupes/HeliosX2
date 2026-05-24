import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'HeliosX loupe measurements guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #020617 0%, #064e3b 50%, #000000 100%)',
          color: 'white',
          padding: 64,
          fontFamily: 'Arial',
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 8, color: '#86efac', textTransform: 'uppercase' }}>
          Measurements
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 0.95, maxWidth: 920 }}>
            Pupillary Distance and Working Distance
          </div>
          <div style={{ fontSize: 28, color: '#d1fae5', maxWidth: 820 }}>
            How to measure for surgical and dental loupes before final fit.
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>HeliosX Loupes</div>
      </div>
    ),
    size
  )
}
