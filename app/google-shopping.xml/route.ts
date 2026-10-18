import { absoluteUrl, siteName } from '@/lib/seo'
import { productImages, productPositioning } from '@/lib/seo-content'
import { magnificationPriceByProduct } from '@/lib/pricing'
import { modelBySlug } from '@/components/m2/models'

// Titles carry the words people search ("surgical loupes", "dental loupes",
// the optical type and magnification), which drive Shopping matching far
// more than the model name alone.
const opticalType: Record<keyof typeof productPositioning, string> = {
  Medusa: 'Ergonomic Prismatic',
  Apollo: 'Ergonomic Prismatic',
  Kepler: 'Prismatic',
  Galileo: 'Galilean',
  Newton: 'Galilean',
}
// Free worldwide shipping; list the countries we target in Merchant Center.
const shippingCountries = ['US', 'CA', 'GB', 'AU']

export const dynamic = 'force-static'

function escapeXml(value: string | number) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function GET() {
  // One item per model and magnification, because each magnification has its
  // own price. Items share an item_group_id per model, and each links to the
  // product page with ?mag= so the page opens on that price. IDs match the
  // per-magnification SKUs Google already crawled (e.g. heliosx-newton-25x).
  const products = (Object.keys(productPositioning) as Array<keyof typeof productPositioning>).flatMap(
    (shortName) => {
      const slug = shortName.toLowerCase()
      return Object.entries(magnificationPriceByProduct[slug]).map(([mag, price]) => `
    <item>
      <g:id>${escapeXml(`heliosx-${slug}-${mag.replace('.', '')}`)}</g:id>
      <g:item_group_id>${escapeXml(`heliosx-${slug}`)}</g:item_group_id>
      <title>${escapeXml(`HeliosX ${shortName} ${mag} ${opticalType[shortName]} Surgical & Dental Loupes, Custom Fit`)}</title>
      <description>${escapeXml(`${productPositioning[shortName]} ${mag} magnification, built to your pupillary and working distance.`)}</description>
      <link>${escapeXml(absoluteUrl(`/product/${slug}?mag=${mag}`))}</link>
      <g:image_link>${escapeXml(absoluteUrl(modelBySlug(slug)?.photo.src ?? productImages[shortName]))}</g:image_link>${(modelBySlug(slug)?.gallery ?? [])
        .slice(0, 10)
        .map((src) => `
      <g:additional_image_link>${escapeXml(absoluteUrl(src))}</g:additional_image_link>`)
        .join('')}
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(`${price.toFixed(2)} USD`)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(siteName)}</g:brand>
      <g:mpn>${escapeXml(`heliosx-${slug}-${mag.replace('.', '')}`)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Business &amp; Industrial &gt; Medical &gt; Medical Instruments</g:google_product_category>
      <g:product_type>Surgical and dental loupes &gt; ${escapeXml(opticalType[shortName])}</g:product_type>
      <g:product_highlight>Custom built to your pupillary and working distance</g:product_highlight>
      <g:product_highlight>Limited lifetime warranty and free worldwide shipping</g:product_highlight>
      <g:product_highlight>30-day returns on non-prescription pairs</g:product_highlight>${shippingCountries
        .map(
          (country) => `
      <g:shipping>
        <g:country>${country}</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>`,
        )
        .join('')}
      <!--
        Every pair is built to the buyer's measurements after checkout, so
        "in_stock" only holds alongside an honest handling time. Without these
        two tags the feed reads as ships-immediately, which contradicts the
        7-14 day build declared in the Product schema (lib/seo.ts,
        defaultShippingDetails) and is what Merchant Center penalises on
        made-to-order goods.
      -->
      <g:min_handling_time>7</g:min_handling_time>
      <g:max_handling_time>14</g:max_handling_time>
    </item>`)
    },
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>HeliosX surgical and dental loupes product feed</description>${products.join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
