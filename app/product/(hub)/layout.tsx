import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  catalogItemListJsonLd,
  organizationJsonLd,
  webPageJsonLd,
} from '@/lib/seo'
import { productImages, productPositioning, productStartingPrices } from '@/lib/seo-content'

// This hub carried no structured data at all before the 8 Sep 2026 audit,
// despite being the category page for the entire lineup. CollectionPage plus
// an ItemList of the five models tells Google what the page collects.
//
// It lives in a (hub) route group rather than in app/product/layout.tsx so it
// applies to /product alone. The shared layout wrapped the five product detail
// pages too, which meant /product/apollo shipped a CollectionPage claiming to
// be /product, a second Organization node, and a two-item breadcrumb that
// contradicted its own three-item one. That is the likely source of the
// "Unnamed item" breadcrumb warnings Search Console reports on the product
// pages.
const pageTitle = 'HeliosX Loupes | Surgical, Dental & Prismatic'
const pageDescription =
  'Compare HeliosX Medusa, Apollo, Galileo, Newton, and Kepler loupes for surgical, dental, ergonomic, affordable, and high-magnification workflows.'

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Loupes', path: '/product' },
]

const modelItems = Object.entries(productPositioning).map(([name, positioning]) => {
  const price = productStartingPrices[name as keyof typeof productStartingPrices]
  return {
    name: `${name} Surgical Loupes`,
    url: `/product/${name.toLowerCase()}`,
    description: positioning,
    image: productImages[name as keyof typeof productImages],
    sku: `heliosx-${name.toLowerCase()}`,
    ...(typeof price === 'number' ? { price } : {}),
  }
})

export default function ProductHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          {
            // No `breadcrumb` passed to webPageJsonLd: it nests a full
            // BreadcrumbList inside WebPage.breadcrumb, and breadcrumbJsonLd()
            // below emits the same list as a top-level node.
            ...webPageJsonLd({
              title: pageTitle,
              description: pageDescription,
              path: '/product',
            }),
            '@type': 'CollectionPage',
          },
          breadcrumbJsonLd(breadcrumbItems),
          catalogItemListJsonLd(modelItems),
        ]}
      />
      {children}
    </>
  )
}
