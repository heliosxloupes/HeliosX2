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
export const WARRANTY_PRICE = pricingData.addOns['extended-warranty'].price

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
