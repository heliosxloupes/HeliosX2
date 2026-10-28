import pricingData from './pricing.json'

/**
 * Money lives in lib/pricing.json and nowhere else.
 *
 * Before this module existed the price charged came straight off the request
 * body, and three separate hardcoded tables (product page, cart page, the
 * Stripe sync script) had drifted apart by as much as 58%. Everything that
 * touches an amount now reads from here.
 */

export type AddOnSlug = keyof typeof pricingData.addOns

export const magnificationPriceByProduct: Record<string, Record<string, number>> =
  Object.fromEntries(
    Object.entries(pricingData.products).map(([slug, entry]) => [slug, entry.prices])
  )

export const productNameBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(pricingData.products).map(([slug, entry]) => [slug, entry.name])
)

export const addOnCatalogue: Record<string, { name: string; price: number }> =
  pricingData.addOns

export const PRESCRIPTION_PRICE = pricingData.addOns['prescription-lenses'].price

export const TRAINEE_PERCENT_OFF = pricingData.trainee.percentOff

export const MAX_QUANTITY_PER_LINE = pricingData.limits.maxQuantityPerLine
export const MAX_LINE_ITEMS = pricingData.limits.maxLineItems

/** Catalogue price for a loupe at a magnification, or null if the pair isn't real. */
export function resolveProductPrice(slug: string, magnification: string): number | null {
  const table = magnificationPriceByProduct[slug]
  if (!table) return null
  const price = table[magnification]
  return typeof price === 'number' ? price : null
}

/** Catalogue price for an add-on, or null if the slug isn't a real add-on. */
export function resolveAddOn(slug: string): { name: string; price: number } | null {
  return addOnCatalogue[slug] ?? null
}

export const lightPriceBySlug: Record<string, { name: string; prices: Record<string, number> }> =
  Object.fromEntries(
    Object.entries(pricingData.lights).filter(([slug]) => !slug.startsWith('_')) as [
      string,
      { name: string; prices: Record<string, number> },
    ][]
  )

export const LIGHT_BUNDLE_PERCENT_OFF = pricingData.lightBundle.percentOff

/** Catalogue price for a light with a battery option, or null if the pair isn't real. */
export function resolveLightPrice(slug: string, option: string): number | null {
  const price = lightPriceBySlug[slug]?.prices[option]
  return typeof price === 'number' ? price : null
}

/** A light bought in the same order as a pair of loupes. Whole dollars, rounded down. */
export function bundledLightPrice(price: number): number {
  return Math.floor(price * (1 - LIGHT_BUNDLE_PERCENT_OFF / 100))
}

type PricedLine = { price: number; isLight?: boolean; isAddon?: boolean }

/** True when the order includes a pair of loupes, which unlocks the light bundle price. */
export function cartHasLoupes(items: PricedLine[]): boolean {
  return items.some((item) => !item.isLight && !item.isAddon)
}

/** What one unit of a cart line costs, given the rest of the cart (lights drop 10% beside loupes). */
export function lineUnitPrice(item: PricedLine, items: PricedLine[]): number {
  return item.isLight && cartHasLoupes(items) ? bundledLightPrice(item.price) : item.price
}
