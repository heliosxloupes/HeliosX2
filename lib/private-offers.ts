import { cordlessOptionName, lightBySlug } from '@/lib/lights'
import { dollarsToCents, formatUsdFromCents, percentOffCents } from '@/lib/money'
import { lightPriceBySlug, resolveLightPrice, resolveProductPrice } from '@/lib/pricing'

export type OfferLine = {
  name: string
  description?: string
  image?: string
  /** Whole US dollars, catalogue price before this offer's discount. */
  price: number
  percentOff: number
  /** Shown on its own line, e.g. "15% resident discount". */
  discountLabel?: string
  metadata: Record<string, string>
}

export type PrivateOffer = {
  id: string
  greeting: string
  /**
   * Stripe promotion code. When set, Checkout charges catalogue prices and
   * Stripe applies this code. Its redemption limit is what makes that offer
   * single-use, and its amount must equal the sum of the line discounts.
   *
   * Omit it when the lines use different rates. Checkout accepts one coupon,
   * so one code cannot take 15% off the loupes and 10% off the light. A
   * shared single-use code is also unsafe: whichever customer redeems it
   * first disables it for the other. Those offers charge the discounted
   * amount on each line instead.
   */
  promotionCode?: string
  discountNote: string
  /** Lights need no measurements, so checkout shows shorter next steps. */
  lightsOnly: boolean
  shippingCountries: ['US']
  /** Embedded Checkout shipping option. Defaults to "Standard shipping". */
  shippingDisplayName?: string
  /** Appended to the page's "Included" shipping line, e.g. "free, US". */
  shippingNote?: string
  lines: OfferLine[]
}

export type PricedOfferLine = {
  name: string
  description?: string
  unitAmountCents: number
  metadata: Record<string, string>
}

const canopusXl = lightBySlug('canopus-xl')
const sirius = lightBySlug('sirius')

/** A quoted private offer must not silently follow a later catalogue change. */
function quotedPrice(actual: number | null, expected: number, label: string): number {
  if (actual !== expected) {
    throw new Error(
      `${label} resolved to ${String(actual)}, but this private offer was quoted at $${expected}. Update the quote before charging a different amount.`
    )
  }
  return actual
}

function invoiceText(line: OfferLine): string | undefined {
  if (line.percentOff <= 0) return undefined
  const label = line.discountLabel ?? `${line.percentOff}% off`
  return `${formatUsdFromCents(dollarsToCents(line.price))}, ${label} -${formatUsdFromCents(percentOffCents(line.price, line.percentOff))}`
}

/**
 * What Checkout should charge. Promotion-code offers stay at catalogue price
 * and Stripe applies the code. Every other offer is already net of its discount,
 * because that discount is not a Stripe coupon.
 */
export function pricedOfferLines(offer: PrivateOffer): PricedOfferLine[] {
  const netOfDiscount = !offer.promotionCode
  return offer.lines.map((line) => {
    const listCents = dollarsToCents(line.price)
    const discountCents = percentOffCents(line.price, line.percentOff)
    const invoice = netOfDiscount ? invoiceText(line) : undefined
    const description = [line.description, invoice].filter(Boolean).join('. ')
    return {
      name: line.name,
      ...(description ? { description } : {}),
      unitAmountCents: netOfDiscount ? listCents - discountCents : listCents,
      metadata: {
        ...line.metadata,
        ...(netOfDiscount
          ? {
              listPriceCents: String(listCents),
              discountCents: String(discountCents),
              ...(line.discountLabel ? { discountLabel: line.discountLabel } : {}),
              ...(invoice ? { invoiceLine: invoice } : {}),
            }
          : {}),
      },
    }
  })
}

export function offerChargeCents(offer: PrivateOffer): number {
  return pricedOfferLines(offer).reduce((sum, line) => sum + line.unitAmountCents, 0)
}

/**
 * Hand-built checkouts sent to one customer. The key is the URL token, so keep
 * it unguessable. Amounts are decided here and on the server, never by the browser.
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
    id: 'newton-flip-up-resident',
    greeting: 'Dr. Drekic, your order is ready.',
    // No Stripe promotion code. RESIDENTNEWTON15 and HELIOS10 are single-use
    // and shared with other customers; Checkout also accepts only one coupon,
    // which cannot be 15% on the loupes and 10% on the light. The discounted
    // amounts are computed in pricedOfferLines.
    discountNote:
      'As an ABVP resident, you get 15% off your Newton loupes and 10% off your Sirius light. Both discounts are already applied.',
    lightsOnly: false,
    shippingCountries: ['US'],
    shippingDisplayName: 'Shipping included',
    shippingNote: 'free, US',
    lines: [
      {
        name: 'Newton Flip-Up Loupes',
        description: '3.5x, black sport frame',
        price: quotedPrice(resolveProductPrice('newton', '3.5x'), 725, 'Newton 3.5x'),
        percentOff: 15,
        discountLabel: '15% resident discount',
        metadata: {
          productSlug: 'newton',
          frameStyle: 'Sport flip-up',
          frameColor: 'Black',
          magnification: '3.5x',
        },
      },
      {
        name: lightPriceBySlug.sirius.name,
        description: '10-hour extended battery pack',
        image: sirius?.image,
        // Catalogue price for Sirius with the 10-hour pack. Not bundledLightPrice:
        // that helper floors to whole dollars ($679), and this quote is the exact 10%.
        price: quotedPrice(resolveLightPrice('sirius', 'pack-10h'), 755, 'Sirius 10-hour pack'),
        percentOff: 10,
        discountLabel: '10% resident discount',
        metadata: {
          productSlug: 'sirius',
          isLight: 'true',
          lightOption: 'pack-10h',
          battery: '10-hour extended battery pack',
          bundled: 'false',
        },
      },
    ],
  },
}

export function getPrivateOffer(token: string): PrivateOffer | null {
  return Object.prototype.hasOwnProperty.call(offers, token) ? offers[token] : null
}
