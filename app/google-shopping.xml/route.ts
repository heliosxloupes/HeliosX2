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

// Long-form Shopping copy per model. Every figure comes from
// components/m2/models.ts and lib/fallback-products.ts; keep them in step.
// No health or condition claims: Google disapproves those for personalised ads.
const modelCopy: Record<
  keyof typeof productPositioning,
  { body: string; audience: string; workingDistance: string; field?: string; weight?: string; lens: string; light: string }
> = {
  Medusa: {
    body: 'The adjustable working distance lets you move between seated and standing work without switching loupes, and the ergonomic prismatic optics keep your head more upright while you look down at the field. Available from 3.0x to 8.5x, so one design covers routine work through fine microsurgical detail.',
    audience: 'surgeons, dentists and hygienists who change posture between seated and standing work, including plastic, ENT, oral and maxillofacial surgery and restorative dentistry',
    workingDistance: '300 to 600 mm, adjustable',
    lens: 'Premium prismatic optical glass with multi-layer coatings',
    light: 'Compatible with LED headlights and battery packs',
  },
  Apollo: {
    body: 'Posture-aware ergonomic prismatic optics in a lightweight, balanced frame. Premium optical glass with advanced multi-layer coatings keeps colour neutral and bright, and the frame is optimised for LED light packs and fixed mounts.',
    audience: 'surgeons and dentists doing fine aesthetic, plastic and micro-oriented work who want an upright working posture',
    workingDistance: '420, 450, 500 or 550 mm, fitted to you',
    field: '50 to 105 mm across magnifications',
    weight: '55 to 58.2 g',
    lens: 'Premium optical glass with advanced multi-layer coatings',
    light: 'Optimised for LED light packs and fixed mounts',
  },
  Kepler: {
    body: 'Conventional prismatic (Keplerian) optics built for high-magnification, fine-detail work. Premium coated glass holds contrast and colour for critical detail at 4.0x, 5.0x and 6.0x.',
    audience: 'microsurgery, hand, plastic, vascular and neurosurgery, and endodontics',
    workingDistance: '280 to 600 mm, fitted to you',
    lens: 'Premium coated prismatic glass for high contrast',
    light: 'Compatible with LED headlights',
  },
  Galileo: {
    body: 'Wide-field Galilean optics with a 200 mm depth of field, so the whole field stays sharp as you move. Reduced-volume barrels keep the pair light, and multi-layer coated lenses give high colour fidelity. Fits a pupil distance range of 54 to 72 mm.',
    audience: 'medical and dental students, residents, general dentists, hygienists and general surgery',
    workingDistance: '300 to 580 mm, fitted to you',
    lens: 'Multi-layer coated lenses with high colour fidelity',
    light: 'Compatible with fixed LED light sources and battery packs',
  },
  Newton: {
    body: 'Our lightest and lowest-priced Galilean loupe, from 40 g with frame, built for long clinical days. A+ grade optical glass with multi-layer coatings gives neutral colour and high light transmission.',
    audience: 'students, hygienists, dental assistants and anyone buying their first pair of loupes',
    workingDistance: '300 to 550 mm, fitted to you',
    lens: 'A+ grade optical glass with multi-layer coatings',
    light: 'Compatible with fixed LED lights and battery packs',
  },
}

// Medusa's adjustable range starts at 350 mm on these magnifications.
const workingDistanceByMag: Record<string, Record<string, string>> = {
  medusa: { '3.0x': '350 to 600 mm, adjustable', '8.0x': '350 to 600 mm, adjustable', '8.5x': '350 to 600 mm, adjustable' },
}

const serviceLine =
  'Every pair is built to your pupillary distance and working distance after you order: send your measurements online and we build and ship in 7 to 14 days. Prescription lenses are available. Includes free shipping, a limited lifetime warranty, and 30-day returns with free return shipping on non-prescription pairs.'

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
      const model = modelBySlug(slug)
      const copy = modelCopy[shortName]
      return Object.entries(magnificationPriceByProduct[slug]).map(([mag, price]) => {
        const optics = model?.optics[mag] ?? {}
        const workingDistance = workingDistanceByMag[slug]?.[mag] ?? copy.workingDistance
        const field = optics.field ?? copy.field
        const weight = optics.weight ?? copy.weight
        const specs: [string, string, string | undefined][] = [
          ['Optics', 'Magnification', mag],
          ['Optics', 'Optical type', opticalType[shortName]],
          ['Optics', 'Working distance', workingDistance],
          ['Optics', 'Field of view', field],
          ['Optics', 'Depth of field', optics.depth],
          ['Optics', 'Lenses', copy.lens],
          ['Fit', 'Weight with frame', weight],
          ['Fit', 'Custom fit', 'Built to your pupillary distance and working distance'],
          ['Fit', 'Prescription', 'Prescription lenses available'],
          ['Fit', 'Light', copy.light],
          ['Service', 'Build and ship time', '7 to 14 days'],
          ['Service', 'Warranty', 'Limited lifetime warranty'],
          ['Service', 'Returns', '30 days, free return shipping on non-prescription pairs'],
        ]
        const opticsLine = [
          field && `field of view ${field}`,
          optics.depth && `depth of field ${optics.depth}`,
          weight && `weight with frame ${weight}`,
        ].filter(Boolean)
        const description = [
          `HeliosX ${shortName} ${mag} ${opticalType[shortName]} surgical and dental loupes, custom fit. ${productPositioning[shortName]}`,
          `At ${mag} magnification: working distance ${workingDistance}${opticsLine.length ? `; ${opticsLine.join('; ')}` : ''}.`,
          copy.body,
          `Made for ${copy.audience}.`,
          `${copy.light}.`,
          serviceLine,
        ].join(' ')
        const highlights = [
          opticsLine.length ? `${mag} magnification, ${opticsLine.slice(0, 2).join(', ')}` : `${mag} magnification`,
          `Working distance ${workingDistance}`,
          'Custom built to your pupillary distance and working distance',
          weight && `Weight with frame: ${weight}`,
          'Prescription lenses available',
          copy.light,
          copy.lens,
          'Limited lifetime warranty',
          'Free shipping, built and shipped in 7 to 14 days',
          '30-day returns with free return shipping on non-prescription pairs',
        ].filter(Boolean) as string[]
        return `
    <item>
      <g:id>${escapeXml(`heliosx-${slug}-${mag.replace('.', '')}`)}</g:id>
      <g:item_group_id>${escapeXml(`heliosx-${slug}`)}</g:item_group_id>
      <title>${escapeXml(`HeliosX ${shortName} ${mag} ${opticalType[shortName]} Surgical & Dental Loupes, Custom Fit, Prescription Ready, LED Light Compatible`)}</title>
      <description>${escapeXml(description)}</description>
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
      <g:product_type>Surgical and dental loupes &gt; ${escapeXml(opticalType[shortName])} &gt; ${escapeXml(`${shortName} ${mag}`)}</g:product_type>${weight
        ? `
      <g:product_weight>${escapeXml(weight.replace(/^.* to /, '').replace(' across magnifications', ''))}</g:product_weight>`
        : ''}
      <g:custom_label_0>${escapeXml(model?.group ?? '')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(opticalType[shortName])}</g:custom_label_1>${highlights
        .map((text) => `
      <g:product_highlight>${escapeXml(text)}</g:product_highlight>`)
        .join('')}${specs
        .filter(([, , value]) => value)
        .map(([section, name, value]) => `
      <g:product_detail>
        <g:section_name>${escapeXml(section)}</g:section_name>
        <g:attribute_name>${escapeXml(name)}</g:attribute_name>
        <g:attribute_value>${escapeXml(value!)}</g:attribute_value>
      </g:product_detail>`)
        .join('')}${shippingCountries
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
    </item>`
      })
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
