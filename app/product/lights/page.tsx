import Header from '@/components/Header/Header'
import DesktopLightsExperience from '@/components/lights/DesktopLightsExperience'
import MobileLightsExperience from '@/components/mobile/MobileLightsExperience'
import { LIGHTS, lightFrom } from '@/lib/lights'
import { LIGHT_BUNDLE_PERCENT_OFF } from '@/lib/pricing'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Loupe Lights & Dental Headlights | HeliosX',
  description: `LED loupe lights and dental headlights, corded or wireless, 50,000–150,000 lux, from $${Math.min(...LIGHTS.map((l) => lightFrom(l.slug)))}. Fits every HeliosX frame, ${LIGHT_BUNDLE_PERCENT_OFF}% off with any pair of loupes.`,
  path: '/product/lights',
  keywords: ['loupe lights', 'loupe light', 'dental loupe light', 'dental headlight', 'dental headlamp', 'surgical headlight', 'LED loupe light', 'wireless loupe light', 'loupes headlight'],
})

export default function LightsPage() {
  return (
    <>
      <Header />
      <div className="md:hidden">
        <MobileLightsExperience />
      </div>
      <div className="hidden md:block">
        <DesktopLightsExperience />
      </div>
    </>
  )
}
