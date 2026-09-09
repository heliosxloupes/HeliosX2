import { fallbackProducts } from '@/lib/fallback-products'
import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function GET() {
  const urls = fallbackProducts.map((product) => {
    const images = [
      { src: product.cardImageSrc, alt: product.cardImageAlt },
      ...product.heroImages,
      ...product.specImages,
    ]

    const uniqueImages = Array.from(new Map(images.map((image) => [image.src, image])).values())
      .map(
        (image) => `
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(image.src))}</image:loc>
      <image:title>${escapeXml(image.alt)}</image:title>
    </image:image>`,
      )
      .join('')

    return `
  <url>
    <loc>${escapeXml(absoluteUrl(`/product/${product.slug}`))}</loc>${uniqueImages}
  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
