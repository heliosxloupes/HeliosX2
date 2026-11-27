import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { productNameBySlug } from '@/lib/pricing'
import { HEADLIGHTS, lightBySlug } from '@/lib/lights'

/**
 * Real recent orders for the sitewide "recent order" toast.
 *
 * Only what the toast shows leaves the server: product, magnification,
 * shipping country (ISO code) and the day it was paid. No name, email, city,
 * order id or amount. Paid orders only; cancelled and refunded ones are skipped.
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

const LOUPE_IMAGES: Record<string, string> = {
  medusa: '/Medusa/MedusaStudioCloseup.png',
  apollo: '/Apollo/Apollofinal.png',
  galileo: '/Galileo/galileoproduct.png',
  newton: '/Newton/NewtonMain.png',
  kepler: '/Keppler/KepplerNewmain.png',
}
const headlightSlugs = new Set<string>(HEADLIGHTS.map((light) => light.slug))

type OrderRow = {
  paid_at: string | null
  created_at: string
  items: Array<{ productMetadata?: Record<string, string> }> | null
  shipping_details: { address?: { country?: string | null } | null } | null
  billing_details: { address?: { country?: string | null } | null } | null
}

function toPurchase(order: OrderRow): RecentPurchase | null {
  const country = (
    order.shipping_details?.address?.country ??
    order.billing_details?.address?.country ??
    ''
  ).toUpperCase()
  if (!/^[A-Z]{2}$/.test(country)) return null

  // The headline is the main product, not an add-on or a bundled light.
  const items = (order.items ?? []).map((item) => item.productMetadata ?? {})
  const main =
    items.find((meta) => meta.isAddon !== 'true' && meta.isLight !== 'true' && meta.productSlug) ??
    items.find((meta) => meta.isAddon !== 'true' && meta.productSlug)
  if (!main?.productSlug) return null

  const slug = main.productSlug
  const isLight = main.isLight === 'true'
  const light = isLight ? lightBySlug(slug) : undefined
  const product = isLight ? light?.name : productNameBySlug[slug]
  const image = isLight ? light?.image : LOUPE_IMAGES[slug]
  if (!product || !image) return null

  const magnification = !isLight && main.magnification ? main.magnification.trim() : undefined

  return {
    slug,
    product: product.replace(/\s+(surgical\s+)?loupes?$/i, ''),
    ...(magnification ? { magnification } : {}),
    kind: !isLight ? 'loupes' : headlightSlugs.has(slug) ? 'headlight' : 'light',
    image,
    country,
    day: (order.paid_at ?? order.created_at).slice(0, 10),
  }
}

export async function getRecentPurchases(): Promise<RecentPurchase[]> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return []

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString()
  const { data, error } = await supabase
    .from('orders')
    .select('paid_at,created_at,items,shipping_details,billing_details')
    .eq('payment_status', 'paid')
    .not('status', 'in', '(cancelled,refunded)')
    .gt('total', 0)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(MAX_ITEMS * 3)

  if (error || !data) return []

  return (data as OrderRow[])
    .map(toPurchase)
    .filter((purchase): purchase is RecentPurchase => purchase !== null)
    .slice(0, MAX_ITEMS)
}
