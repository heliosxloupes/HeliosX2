// dataLayer push helpers for Google Tag Manager.
// Safe to import from server modules too — every push is window-guarded.

export type GA4Item = {
  item_id: string
  item_name: string
  item_brand?: string
  item_category?: string
  item_variant?: string
  price?: number
  quantity?: number
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

function pushEcommerce(event: string, ecommerce: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  // Clear the previous ecommerce object so stale items/value don't leak
  // into the next event. Google's documented GA4 pattern.
  pushDataLayer({ ecommerce: null })
  pushDataLayer({ event, ecommerce })
}

export function trackViewItem(input: {
  itemId: string
  itemName: string
  price: number
  category?: string
  variant?: string
  currency?: string
}): void {
  pushEcommerce('view_item', {
    currency: input.currency ?? 'USD',
    value: input.price,
    items: [
      {
        item_id: input.itemId,
        item_name: input.itemName,
        item_brand: 'HeliosX',
        item_category: input.category ?? 'Loupes',
        ...(input.variant ? { item_variant: input.variant } : {}),
        price: input.price,
        quantity: 1,
      },
    ],
  })
}

export function trackAddToCart(input: {
  itemId: string
  itemName: string
  price: number
  quantity: number
  category?: string
  variant?: string
  currency?: string
}): void {
  pushEcommerce('add_to_cart', {
    currency: input.currency ?? 'USD',
    value: input.price * input.quantity,
    items: [
      {
        item_id: input.itemId,
        item_name: input.itemName,
        item_brand: 'HeliosX',
        item_category: input.category ?? 'Loupes',
        ...(input.variant ? { item_variant: input.variant } : {}),
        price: input.price,
        quantity: input.quantity,
      },
    ],
  })
}

export function trackViewCart(items: GA4Item[], value: number, currency = 'USD'): void {
  pushEcommerce('view_cart', { currency, value, items })
}

export function trackBeginCheckout(items: GA4Item[], value: number, currency = 'USD'): void {
  pushEcommerce('begin_checkout', { currency, value, items })
}

export function trackPurchase(input: {
  transactionId: string
  value: number
  currency?: string
  items?: GA4Item[]
}): void {
  pushEcommerce('purchase', {
    transaction_id: input.transactionId,
    value: input.value,
    currency: input.currency ?? 'USD',
    items: input.items ?? [],
  })
}

export function trackGenerateLead(source: string, extras: Record<string, unknown> = {}): void {
  pushDataLayer({
    event: 'generate_lead',
    form_source: source,
    ...extras,
  })
}

type CartLike = {
  productSlug: string
  name: string
  shortName?: string
  price: number
  quantity: number
  selectedMagnification?: string | null
  selectedFrameName?: string | null
}

export function cartItemsToGA4Items(items: CartLike[]): GA4Item[] {
  return items.map((item) => {
    const variant = [item.selectedMagnification, item.selectedFrameName].filter(Boolean).join(' / ')
    return {
      item_id: item.productSlug,
      item_name: item.shortName ?? item.name,
      item_brand: 'HeliosX',
      item_category: 'Loupes',
      ...(variant ? { item_variant: variant } : {}),
      price: item.price,
      quantity: item.quantity,
    }
  })
}
