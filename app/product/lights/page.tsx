import Header from '@/components/Header/Header'
import DesktopLightsExperience from '@/components/lights/DesktopLightsExperience'
import MobileLightsExperience from '@/components/mobile/MobileLightsExperience'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'LED Loupe Lights | HeliosX',
  description:
    'Corded and wireless LED lights for surgical and dental loupes, from 50,000 to 150,000 lux. Fits every HeliosX frame, 10% off with any pair of loupes.',
  path: '/product/lights',
  keywords: ['loupe light', 'dental loupe light', 'surgical headlight', 'LED loupe light', 'wireless loupe light'],
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
