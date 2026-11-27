'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart, getCart } from '@/lib/cart'
import { magnificationPriceByProduct } from '@/lib/pricing'

// Google Merchant Center checkout link: /checkout/google?item_id={id}
// The id matches the Shopping feed (app/google-shopping.xml), e.g.
// heliosx-galileo-30x = Galileo at 3.0x. We bag that pair with the product
// page's default frame and send the buyer straight to checkout. Anything we
// can't read falls back to the product page so the click is never lost.
// Same photos as productImages in lib/seo-content (kept inline to keep checkout light).
const productImage: Record<string, string> = {
  medusa: '/share/medusa.jpg',
  apollo: '/share/apollo.jpg',
  kepler: '/share/kepler.jpg',
  galileo: '/share/galileo.jpg',
  newton: '/share/newton-desk.jpg',
}

const defaultFrame: Record<string, { id: string; color: string; name: string; image: string }> = {
  newton: { id: 'H1Black', color: 'black', name: 'H1 - Black', image: '/Frames/H1Black.png' },
  apollo: { id: 'Apollo1', color: 'red', name: 'Apollo 1 - Red', image: '/Apollo/apollof1.1.png' },
  medusa: { id: 'JJ23Grey', color: 'grey', name: 'JJ23 - Grey', image: '/Frames/JJ23Grey.png' },
  kepler: { id: 'JJ23Grey', color: 'grey', name: 'JJ23 - Grey', image: '/Frames/JJ23Grey.png' },
  galileo: { id: 'JJ23Grey', color: 'grey', name: 'JJ23 - Grey', image: '/Frames/JJ23Grey.png' },
}

function parseItemId(raw: string | null) {
  const match = raw?.toLowerCase().match(/^heliosx-([a-z]+)-(\d+x)$/)
  if (!match) return null
  const [, slug, magKey] = match
  const prices = magnificationPriceByProduct[slug]
  if (!prices) return { slug, mag: null, price: null }
  const mag = Object.keys(prices).find((m) => m.replace('.', '') === magKey) ?? null
  return { slug, mag, price: mag ? prices[mag] : null }
}

export default function GoogleCheckoutLink() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const parsed = parseItemId(params.get('item_id') ?? params.get('id'))
    const frame = parsed && defaultFrame[parsed.slug]

    if (!parsed || !parsed.mag || parsed.price === null || !frame) {
      router.replace(parsed && magnificationPriceByProduct[parsed.slug] ? `/product/${parsed.slug}` : '/product')
      return
    }

    const shortName = parsed.slug.charAt(0).toUpperCase() + parsed.slug.slice(1)
    const quantity = Math.min(Math.max(parseInt(params.get('quantity') ?? '1', 10) || 1, 1), 10)

    // Reloads and the back button must not bag the same pair twice.
    const alreadyBagged = getCart().some(
      (item) => item.productSlug === parsed.slug && item.selectedMagnification === parsed.mag
    )
    if (!alreadyBagged) addToCart({
      productSlug: parsed.slug,
      name: `${shortName} Surgical Loupes`,
      shortName,
      price: parsed.price,
      quantity,
      image: productImage[parsed.slug] ?? null,
      selectedMagnification: parsed.mag,
      selectedFrameId: frame.id,
      selectedFrameColor: frame.color,
      selectedFrameName: frame.name,
      selectedFrameImage: frame.image,
    })
    router.replace('/checkout')
  }, [router])

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 text-sm text-neutral-400">
      Opening checkout…
    </main>
  )
}

