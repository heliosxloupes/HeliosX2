import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import OfferCheckout from '@/components/cart/OfferCheckout'
import { getPrivateOffer } from '@/lib/private-offers'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'HeliosX Private Checkout',
  description: 'Complete your HeliosX order.',
  path: '/offer',
  noIndex: true,
})

export default function OfferPage({ params }: { params: { token: string } }) {
  const offer = getPrivateOffer(params.token)
  if (!offer) notFound()

  return (
    <OfferCheckout
      token={params.token}
      greeting={offer.greeting}
      discountNote={offer.discountNote}
      lightsOnly={offer.lightsOnly}
      lines={offer.lines.map(({ name, description, image, price, percentOff }) => ({ name, description, image, price, percentOff }))}
    />
  )
}
