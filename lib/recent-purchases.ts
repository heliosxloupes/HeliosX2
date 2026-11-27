import Stripe from 'stripe'
import { productNameBySlug } from '@/lib/pricing'
import { HEADLIGHTS, lightBySlug } from '@/lib/lights'

/**
 * Real recent orders for the sitewide "recent order" toast, read straight
 * from Stripe: the record of what was actually paid.
 *
 * Only what the toast shows leaves the server: product, magnification,
 * shipping country (ISO code) and the day it was paid. No name, email, city,
 * order id or amount. Paid, live checkouts only; refunded ones are skipped.
 */

export type RecentPurchase = {
  /** Product slug, used to pick the thumbnail. */
  slug: string
  /** Display name, e.g. "Medusa" or "Polaris". */
  product: string
  /** Loupes only, e.g. "3.5x". */
  magnification?: string
  /** What the product is, so the client can label it in its own language. */
  kind: 'loupes' | 'light' | 'headlight'
  /** Thumbnail path under /public. */
  image: string
  /** ISO 3166-1 alpha-2 shipping country. */
  country: string
  /** Paid date as YYYY-MM-DD, so the client can only say "today", "3 days ago". */
  day: string
}

const MAX_ITEMS = 10
const WINDOW_DAYS = 60

// Square product thumbnails cropped tight on the product (public/recent/<slug>.webp).
const THUMBNAILS = new Set([
  'medusa', 'apollo', 'galileo', 'newton', 'kepler',
  'polaris', 'vega', 'rigel', 'sirius', 'nova', 'antares', 'arcturus', 'canopus', 'canopus-xl',
])
const headlightSlugs = new Set<string>(HEADLIGHTS.map((light) => light.slug))

type Meta = Record<string, string | undefined>

function productMeta(item: Stripe.LineItem): Meta {
  const product = item.price?.product
  if (!product || typeof product !== 'object' || 'deleted' in product) return {}
  return product.metadata ?? {}
}

function toPurchase(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]): RecentPurchase | null {
  const shipping =
    (session as any).shipping_details ?? (session as any).collected_information?.shipping_details ?? null
  const country = String(
    shipping?.address?.country ?? session.customer_details?.address?.country ?? '',
  ).toUpperCase()
  if (!/^[A-Z]{2}$/.test(country)) return null

  // The headline is the main product, not an add-on or a bundled light.
  const metas = lineItems.map(productMeta)
  const main =
    metas.find((meta) => meta.isAddon !== 'true' && meta.isLight !== 'true' && meta.productSlug) ??
    metas.find((meta) => meta.isAddon !== 'true' && meta.productSlug)
  if (!main?.productSlug) return null

  const slug = main.productSlug
  const isLight = main.isLight === 'true'
  const light = isLight ? lightBySlug(slug) : undefined
  const product = isLight ? light?.name : productNameBySlug[slug]
  const image = THUMBNAILS.has(slug) ? `/recent/${slug}.webp` : undefined
  if (!product || !image) return null

  const magnification = !isLight && main.magnification ? main.magnification.trim() : undefined

  return {
    slug,
    product: product.replace(/\s+(surgical\s+)?loupes?$/i, ''),
    ...(magnification ? { magnification } : {}),
    kind: !isLight ? 'loupes' : headlightSlugs.has(slug) ? 'headlight' : 'light',
    image,
    country,
    day: new Date(session.created * 1000).toISOString().slice(0, 10),
  }
}

function isRefunded(session: Stripe.Checkout.Session) {
  const intent = session.payment_intent
  if (!intent || typeof intent !== 'object') return false
  const charge = intent.latest_charge
  return Boolean(charge && typeof charge === 'object' && charge.amount_refunded > 0)
}

export async function getRecentPurchases(): Promise<RecentPurchase[]> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return []
  const stripe = new Stripe(key, { apiVersion: '2024-06-20' as any })

  try {
    const since = Math.floor((Date.now() - WINDOW_DAYS * 86_400_000) / 1000)
    const sessions = await stripe.checkout.sessions.list({
      status: 'complete',
      created: { gte: since },
      limit: MAX_ITEMS * 2,
      expand: ['data.payment_intent.latest_charge'],
    })

    const paid = sessions.data
      .filter((session) => session.livemode && session.payment_status === 'paid' && (session.amount_total ?? 0) > 0)
      .filter((session) => !isRefunded(session))

    const purchases = await Promise.all(
      paid.map(async (session) => {
        const items = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 20,
          expand: ['data.price.product'],
        })
        return toPurchase(session, items.data)
      }),
    )

    return purchases.filter((purchase): purchase is RecentPurchase => purchase !== null).slice(0, MAX_ITEMS)
  } catch (error) {
    console.error('recent-purchases: Stripe read failed', error)
    return []
  }
}
