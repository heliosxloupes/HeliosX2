import type Stripe from 'stripe'

import { cordlessOptionName, lightBySlug } from '@/lib/lights'
import { PRESCRIPTION_PRICE, lightPriceBySlug, resolveLightPrice, resolveProductPrice } from '@/lib/pricing'

export type OfferLine = {
  name: string
  description?: string
  image?: string
  /** Whole US dollars. */
  price: number
  percentOff: number
  metadata: Record<string, string>
}

export type PrivateOffer = {
  id: string
  greeting: string
  /**
   * Stripe promotion code. Its redemption limit is what makes the offer single-use,
   * and its amount must equal the sum of the line discounts below. Omit it for a
   * list-price offer (every percentOff 0); that link stays reusable.
   */
  promotionCode?: string
  discountNote: string
  /** Lights need no measurements, so checkout shows shorter next steps. */
  lightsOnly: boolean
  shippingCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
  lines: OfferLine[]
}

const canopusXl = lightBySlug('canopus-xl')
const sirius = lightBySlug('sirius')

/**
 * Hand-built checkouts sent to one customer. The key is the URL token, so keep
 * it unguessable. Amounts are decided here and on Stripe, never by the browser.
 */
const offers: Record<string, PrivateOffer> = {
  '37l_TqVDqJqH': {
    id: 'canopus-xl-kepler-owner',
    greeting: 'Brandon, your order is ready.',
    promotionCode: 'KEPLERCANOPUS',
    discountNote: 'As a Kepler owner, you get 10% off your Canopus XL and 15% off your spare battery. Both discounts are already applied.',
    lightsOnly: true,
    shippingCountries: ['US'],
    lines: [
      {
        name: lightPriceBySlug['canopus-xl'].name,
        description: canopusXl ? cordlessOptionName(canopusXl) : undefined,
        image: canopusXl?.image,
        price: resolveLightPrice('canopus-xl', 'headband') as number,
        percentOff: 10,
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
        percentOff: 15,
        metadata: { productSlug: 'canopus-xl-spare-battery', isAddon: 'true' },
      },
    ],
  },
  czqh4dx8Sie_: {
    id: 'newton-sirius-resident',
    greeting: 'Dr. Drekic, your loupes and light are ready.',
    // Replaced RESIDENTNEWTON15 on 2026-11-05 when the Sirius was added: $108.75 + $75.50.
    promotionCode: 'RESIDENTNEWTONSIRIUS',
    discountNote:
      'As an ABVP resident, you get 15% off your Newton loupes and 10% off your Sirius light. Both discounts are already applied.',
    lightsOnly: false,
    shippingCountries: ['US'],
    lines: [
      {
        name: 'Newton Flip-Up Loupes',
        description: '3.5x, black sport frame',
        price: resolveProductPrice('newton', '3.5x') as number,
        percentOff: 15,
        metadata: {
          productSlug: 'newton',
          frameStyle: 'Sport flip-up',
          frameColor: 'Black',
          magnification: '3.5x',
        },
      },
      {
        name: lightPriceBySlug.sirius.name,
        description: 'Coaxial, 150,000 lux. Extended battery pack, 10 hrs',
        image: sirius?.image,
        price: resolveLightPrice('sirius', 'pack-10h') as number,
        percentOff: 10,
        metadata: {
          productSlug: 'sirius',
          isLight: 'true',
          lightOption: 'pack-10h',
          battery: 'Extended battery, 10 hrs',
          bundled: 'true',
        },
      },
    ],
  },
  RhWb_mEPEhg7: {
    id: 'galileo-rx-evans',
    greeting: 'Sally, your Galileo loupes are ready.',
    discountNote:
      'Your Galileo 3.0× loupes with prescription lenses built in. Before production we confirm your prescription, working distance and frame fit with you, and you can cancel for a full refund until then.',
    lightsOnly: false,
    shippingCountries: ['GB'],
    lines: [
      {
        name: 'Galileo Surgical Loupes',
        description: '3.0×, JJ23 Grey frame',
        price: resolveProductPrice('galileo', '3.0x') as number,
        percentOff: 0,
        metadata: {
          productSlug: 'galileo',
          frameStyle: 'JJ23',
          frameColor: 'Grey',
          magnification: '3.0x',
        },
      },
      {
        name: 'Prescription Lenses',
        description: 'Prescription in the left lens, balance lens on the right',
        price: PRESCRIPTION_PRICE,
        percentOff: 0,
        metadata: { productSlug: 'prescription-lenses', isAddon: 'true' },
      },
    ],
  },
}

export function getPrivateOffer(token: string): PrivateOffer | null {
  return Object.prototype.hasOwnProperty.call(offers, token) ? offers[token] : null
}
