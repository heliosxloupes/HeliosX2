import Header from '@/components/Header/Header'
import DesktopLightsExperience from '@/components/lights/DesktopLightsExperience'
import MobileLightsExperience from '@/components/mobile/MobileLightsExperience'
import { LIGHT_WARRANTY_YEARS, LIGHTS, lightFrom } from '@/lib/lights'
import JsonLd from '@/components/JsonLd'
import { LIGHT_BUNDLE_PERCENT_OFF, lightPriceBySlug } from '@/lib/pricing'
import { absoluteUrl, buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Loupe Lights & Dental Headlights | HeliosX',
  description: `LED loupe lights and dental headlights, corded or wireless, 50,000–150,000 lux, from $${Math.min(...LIGHTS.map((l) => lightFrom(l.slug)))}. ${LIGHT_WARRANTY_YEARS}-year warranty, ${LIGHT_BUNDLE_PERCENT_OFF}% off with loupes.`,
  path: '/product/lights',
  keywords: ['loupe lights', 'loupe light', 'dental loupe light', 'dental headlight', 'dental headlamp', 'surgical headlight', 'LED loupe light', 'wireless loupe light', 'loupes headlight'],
})

// One Product per light so search results can show the price range. Prices
// come from lib/pricing.json; no ratings, because we have no verified reviews.
const lightsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'HeliosX LED loupe lights',
  itemListElement: LIGHTS.map((light, i) => {
    const prices = Object.values(lightPriceBySlug[light.slug].prices)
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: lightPriceBySlug[light.slug].name,
        description: `${light.kind === 'wireless' ? 'Wireless' : 'Corded'} LED loupe light, ${light.lux.toLocaleString('en-US')} lux, head weight ${light.headWeight}. ${light.bestFor}`,
        image: absoluteUrl(light.image),
        brand: { '@type': 'Brand', name: 'HeliosX' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/product/lights'),
        },
      },
    }
  }),
}

export default function LightsPage() {
  return (
    <>
      <JsonLd data={lightsJsonLd} />
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
