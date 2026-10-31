import { cordlessOptionName, lightBySlug } from '@/lib/lights'
import { lightPriceBySlug, resolveLightPrice } from '@/lib/pricing'

export type OfferLine = {
  name: string
  description?: string
  image?: string
  /** Whole US dollars. */
  price: number
  metadata: Record<string, string>
}

export type PrivateOffer = {
  id: string
  greeting: string
  /** Stripe promotion code. Its redemption limit is what makes the offer single-use. */
  promotionCode: string
  percentOff: number
  discountNote: string
  shippingCountries: ['US']
  lines: OfferLine[]
}

const canopusXl = lightBySlug('canopus-xl')

/**
 * Hand-built checkouts sent to one customer. The key is the URL token, so keep
 * it unguessable. Amounts are decided here and on Stripe, never by the browser.
 */
const offers: Record<string, PrivateOffer> = {
  '37l_TqVDqJqH': {
    id: 'canopus-xl-kepler-owner',
    greeting: 'Brandon, your order is ready.',
    promotionCode: 'KEPLERLIGHT10',
    percentOff: 10,
    discountNote: 'As a Kepler owner, you get 10% off your Canopus XL and 10% off your spare battery. Both discounts are already applied.',
    shippingCountries: ['US'],
    lines: [
      {
        name: lightPriceBySlug['canopus-xl'].name,
        description: canopusXl ? cordlessOptionName(canopusXl) : undefined,
        image: canopusXl?.image,
        price: resolveLightPrice('canopus-xl', 'headband') as number,
        metadata: {
          productSlug: 'canopus-xl',
          isLight: 'true',
          lightOption: 'headband',
          battery: canopusXl ? cordlessOptionName(canopusXl) : '',
          bundled: 'false',
        },
      },
      {
        name: 'Canopus XL Spare Battery',
        price: 200,
        metadata: { productSlug: 'canopus-xl-spare-battery', isAddon: 'true' },
      },
    ],
  },
}

export function getPrivateOffer(token: string): PrivateOffer | null {
  return Object.prototype.hasOwnProperty.call(offers, token) ? offers[token] : null
}
