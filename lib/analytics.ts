export type GA4Item = {
  item_id: string
  item_name: string
  item_brand?: string
  item_category?: string
  item_variant?: string
  price?: number
  quantity?: number
}

type AnalyticsCallback = () => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: any[]) => void
    clarity?: (...args: any[]) => void
    __heliosxAnalyticsReady?: boolean
    __heliosxAnalyticsConsentGranted?: boolean
    __heliosxAnalyticsQueue?: AnalyticsCallback[]
  }
}

function sendWhenReady(callback: AnalyticsCallback): void {
  if (typeof window === 'undefined' || window.__heliosxAnalyticsConsentGranted === false) return

  if (window.__heliosxAnalyticsReady && window.__heliosxAnalyticsConsentGranted === true) {
    callback()
    return
  }

  window.__heliosxAnalyticsQueue = window.__heliosxAnalyticsQueue || []
  window.__heliosxAnalyticsQueue.push(callback)
}

function sendGA4(event: string, parameters: Record<string, unknown>): void {
  window.gtag?.('event', event, parameters)
}


export function trackCustomEvent(event: string, parameters: Record<string, unknown>): void {
  sendWhenReady(() => sendGA4(event, parameters))
}


export function trackViewItem(input: {
  itemId: string
  itemName: string
  price: number
  category?: string
  variant?: string
  currency?: string
}): void {
  const currency = input.currency ?? 'USD'
  const item: GA4Item = {
    item_id: input.itemId,
    item_name: input.itemName,
    item_brand: 'HeliosX',
    item_category: input.category ?? 'Loupes',
    ...(input.variant ? { item_variant: input.variant } : {}),
    price: input.price,
    quantity: 1,
  }

  sendWhenReady(() => {
    sendGA4('view_item', { currency, value: input.price, items: [item] })
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
  const currency = input.currency ?? 'USD'
  const value = input.price * input.quantity
  const item: GA4Item = {
    item_id: input.itemId,
    item_name: input.itemName,
    item_brand: 'HeliosX',
    item_category: input.category ?? 'Loupes',
    ...(input.variant ? { item_variant: input.variant } : {}),
    price: input.price,
    quantity: input.quantity,
  }

  sendWhenReady(() => {
    sendGA4('add_to_cart', { currency, value, items: [item] })
  })
}

export function trackViewCart(items: GA4Item[], value: number, currency = 'USD'): void {
  sendWhenReady(() => sendGA4('view_cart', { currency, value, items }))
}

/** Unique ID for one event, shared with any server-side copy of it. */
export function newEventId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `hx-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function trackBeginCheckout(items: GA4Item[], value: number, currency = 'USD', eventId?: string): void {
  sendWhenReady(() => {
    sendGA4('begin_checkout', { currency, value, items })
  })
}

export function trackPurchase(input: {
  transactionId: string
  value: number
  currency?: string
  items?: GA4Item[]
}): void {
  const currency = input.currency ?? 'USD'
  const items = input.items ?? []

  sendWhenReady(() => {
    sendGA4('purchase', {
      transaction_id: input.transactionId,
      value: input.value,
      currency,
      shipping: 0,
      items,
    })
  })
}

export function trackGenerateLead(source: string, extras: Record<string, unknown> = {}, eventId?: string): void {
  sendWhenReady(() => {
    sendGA4('generate_lead', { form_source: source, ...extras })
  })
}

export function trackContact(
  event: 'contact_open' | 'contact_topic_select' | 'email_click' | 'contact_submit',
  extras: Record<string, unknown> = {}
): void {
  trackCustomEvent(event, extras)
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
      item_name: item.name,
      item_brand: 'HeliosX',
      item_category: 'Loupes',
      ...(variant ? { item_variant: variant } : {}),
      price: item.price,
      quantity: item.quantity,
    }
  })
}
