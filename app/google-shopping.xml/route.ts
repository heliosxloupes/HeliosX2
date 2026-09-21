import { absoluteUrl, siteName } from '@/lib/seo'
import { productImages, productPositioning, productStartingPrices } from '@/lib/seo-content'

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
  const products = (Object.keys(productPositioning) as Array<keyof typeof productPositioning>).map(
    (shortName) => {
      const slug = shortName.toLowerCase()
      return `
    <item>
      <g:id>${escapeXml(`heliosx-${slug}`)}</g:id>
      <title>${escapeXml(`${shortName} Loupes`)}</title>
      <description>${escapeXml(productPositioning[shortName])}</description>
      <link>${escapeXml(absoluteUrl(`/product/${slug}`))}</link>
      <g:image_link>${escapeXml(absoluteUrl(productImages[shortName]))}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(`${productStartingPrices[shortName].toFixed(2)} USD`)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(siteName)}</g:brand>
      <g:mpn>${escapeXml(`heliosx-${slug}`)}</g:mpn>
      <g:identifier_exists>yes</g:identifier_exists>
      <g:product_type>Surgical and dental loupes</g:product_type>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
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
    </item>`
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
