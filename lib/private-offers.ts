import type Stripe from 'stripe'

import { cordlessOptionName, lightBySlug } from '@/lib/lights'
import { PRESCRIPTION_PRICE, lightPriceBySlug, resolveLightPrice, resolveProductPrice } from '@/lib/pricing'
import { WORLDWIDE_SHIPPING_COUNTRIES } from '@/lib/shipping-countries'

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
const vega = lightBySlug('vega')

/** One Vega line at list price with the chosen battery. */
function vegaLine(option: 'slim-6h' | 'pack-10h' | 'neck-4h', battery: string): OfferLine {
  return {
    name: lightPriceBySlug.vega.name,
    description: `70,000 lux. ${battery}`,
    image: vega?.image,
    price: resolveLightPrice('vega', option) as number,
    percentOff: 0,
    metadata: { productSlug: 'vega', isLight: 'true', lightOption: option, battery, bundled: 'false' },
  }
}

/** Sirius on the 10-hour pack at the 10% loupe-bundle discount. */
const siriusBundledLine: OfferLine = {
  name: lightPriceBySlug.sirius.name,
  description: 'Coaxial, 150,000 lux, adjustable spot. Extended battery pack, 10 hrs',
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
}

// Dr. Roshan (cardiovascular surgery resident, FMIC): congenital plus adult CABG and valves.
// Two options, Galileo 3.5x (his pick) and Kepler 4.0x, each with its own single-use code.
const roshanOffer = (
  id: string,
  promotionCode: string,
  model: 'galileo' | 'kepler',
  magnification: '3.5x' | '4.0x',
  name: string,
  description: string,
  frameStyle: string
): PrivateOffer => ({
  id,
  greeting: 'Dr. Roshan, your loupes and light are ready.',
  promotionCode,
  discountNote:
    'As a verified resident, you get 15% off your loupes and 10% off your Sirius light. Both discounts are already applied. We confirm your PD, working distance and frame with you before anything is built.',
  lightsOnly: false,
  shippingCountries: WORLDWIDE_SHIPPING_COUNTRIES,
  lines: [
    {
      name,
      description,
      price: resolveProductPrice(model, magnification) as number,
      percentOff: 15,
      metadata: {
        productSlug: model,
        frameStyle,
        frameColor: 'Black',
        magnification,
      },
    },
    siriusBundledLine,
  ],
})

// Dr. Taheri (Hollywood Smile Dental) picks one of three Vega batteries. List price, no code.
const taheriVega = (option: 'slim-6h' | 'pack-10h' | 'neck-4h', battery: string): PrivateOffer => ({
  id: `vega-${option}-taheri`,
  greeting: 'Dr. Taheri, your Vega light is ready.',
  discountNote: `Your Vega LED Loupe Light with the ${battery}. It clips into your Medusa Sport frame.`,
  lightsOnly: true,
  shippingCountries: ['US'],
  lines: [vegaLine(option, battery)],
})

// Beverlyn: Medusa Ergo (factory "Ergo TTL") with swappable magnification lenses, one prescription for the frame.
// Frame is $1,447; lens pairs and the prescription are at cost. Quoted 2026-11-26.
const ERGO_TTL_LENSES = {
  '3.5x': { price: 118, detail: '3.5×, 70–90 mm field, 150 mm depth of field' },
  '4.5x': { price: 198, detail: '4.5×, 60–80 mm field, 100 mm depth of field' },
  '5.5x': { price: 285, detail: '5.5×, 50–70 mm field, 90 mm depth of field' },
  '6.5x': { price: 395, detail: '6.5×, 50–70 mm field, 80 mm depth of field' },
} as const

type ErgoTtlMag = keyof typeof ERGO_TTL_LENSES

const ergoTtlOffer = (id: string, mags: ErgoTtlMag[]): PrivateOffer => ({
  id,
  greeting: `Beverlyn, your Medusa with ${mags.length} interchangeable magnifications is ready.`,
  discountNote:
    'One prescription frame with magnetic lenses you swap in seconds. Before production we confirm your full prescription, PD and working distance with you, and you can cancel for a full refund until then.',
  lightsOnly: false,
  shippingCountries: WORLDWIDE_SHIPPING_COUNTRIES,
  lines: [
    {
      name: 'Medusa Ergonomic Prismatic Loupes',
      description: 'Interchangeable-magnification frame with magnetic lens mount',
      image: '/offers/ergo-ttl/frame.jpg',
      price: 1447,
      percentOff: 0,
      metadata: { productSlug: 'ergo-ttl', frameStyle: 'Medusa Ergo interchangeable', magnification: mags.join(' / ') },
    },
    ...mags.map(
      (mag): OfferLine => ({
        name: `${mag.replace('x', '×')} Magnification Lenses`,
        description: ERGO_TTL_LENSES[mag].detail,
        image: `/offers/ergo-ttl/lens-${mag}.jpg`,
        price: ERGO_TTL_LENSES[mag].price,
        percentOff: 0,
        metadata: { productSlug: 'ergo-ttl-lens', magnification: mag, isAddon: 'true' },
      })
    ),
    {
      name: 'Prescription Lenses',
      description: 'Built into the frame once, works with every magnification',
      price: PRESCRIPTION_PRICE,
      percentOff: 0,
      metadata: { productSlug: 'prescription-lenses', isAddon: 'true' },
    },
  ],
})

/**
 * Hand-built checkouts sent to one customer. The key is the URL token, so keep
 * it unguessable. Amounts are decided here and on Stripe, never by the browser.
 */
const offers: Record<string, PrivateOffer> = {
  VqMPihHpDgDe: taheriVega('slim-6h', 'Slim battery pack, 6 hrs'),
  cLBpBvxq4rGb: taheriVega('pack-10h', 'Extended battery pack, 10 hrs'),
  'kFdPBb8ha-7J': taheriVega('neck-4h', 'Neckband battery, 4 hrs'),
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
  // $179.25 + $75.50 = $254.75 off. Created 2026-11-21.
  sDBJWOnPoIHu: roshanOffer(
    'kepler-sirius-resident-roshan',
    'RESIDENTKEPLERSIRIUS',
    'kepler',
    '4.0x',
    'Kepler Surgical Loupes',
    '4.0×, conventional prismatic, 68 g with frame',
    'Confirmed at fitting'
  ),
  // $123.75 + $75.50 = $199.25 off. Created 2026-11-21 (replaced a Medusa option never sent).
  DqXXRoRbgCls: roshanOffer(
    'galileo-sirius-resident-roshan',
    'RESIDENTGALILEOSIRIUS',
    'galileo',
    '3.5x',
    'Galileo Surgical Loupes',
    '3.5×, JJ04 Black frame, 37 g with frame',
    'JJ04'
  ),
  // $1,447 + $601 lenses + $200 Rx = $2,248.
  'dVgb-hxcXlsZ': ergoTtlOffer('ergo-ttl-3mag-rx-beverlyn', ['3.5x', '4.5x', '5.5x']),
  // $1,447 + $996 lenses + $200 Rx = $2,643.
  FRq3OYoX9qCZ: ergoTtlOffer('ergo-ttl-4mag-rx-beverlyn', ['3.5x', '4.5x', '5.5x', '6.5x']),
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
