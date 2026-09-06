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
    fbq?: (...args: any[]) => void
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

function sendMeta(
  event: string,
  parameters: Record<string, unknown>,
  eventId?: string
): void {
  if (!window.fbq) return
  if (eventId) {
    window.fbq('track', event, parameters, { eventID: eventId })
    return
  }
  window.fbq('track', event, parameters)
}

export function trackCustomEvent(event: string, parameters: Record<string, unknown>): void {
  sendWhenReady(() => sendGA4(event, parameters))
}

function metaContents(items: GA4Item[]) {
  return items.map((item) => ({
    id: item.item_id,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }))
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
    sendMeta('ViewContent', {
      content_ids: [input.itemId],
      content_name: input.itemName,
      content_category: input.category ?? 'Loupes',
      content_type: 'product',
      contents: metaContents([item]),
      currency,
      value: input.price,
    })
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
    sendMeta('AddToCart', {
      content_ids: [input.itemId],
      content_name: input.itemName,
      content_type: 'product',
      contents: metaContents([item]),
      currency,
      value,
    })
  })
}

export function trackViewCart(items: GA4Item[], value: number, currency = 'USD'): void {
  sendWhenReady(() => sendGA4('view_cart', { currency, value, items }))
}

export function trackBeginCheckout(items: GA4Item[], value: number, currency = 'USD'): void {
  sendWhenReady(() => {
    sendGA4('begin_checkout', { currency, value, items })
    sendMeta('InitiateCheckout', {
      content_ids: items.map((item) => item.item_id),
      content_type: 'product',
      contents: metaContents(items),
      currency,
      num_items: items.reduce((total, item) => total + (item.quantity ?? 1), 0),
      value,
    })
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
    sendMeta(
      'Purchase',
      {
        content_ids: items.map((item) => item.item_id),
        content_type: 'product',
        contents: metaContents(items),
        currency,
        num_items: items.reduce((total, item) => total + (item.quantity ?? 1), 0),
        value: input.value,
      },
      input.transactionId
    )
  })
}

export function trackGenerateLead(source: string, extras: Record<string, unknown> = {}): void {
  sendWhenReady(() => {
    sendGA4('generate_lead', { form_source: source, ...extras })
    sendMeta('Lead', { content_name: source, ...extras })
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
