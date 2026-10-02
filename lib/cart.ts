import { trackAddToCart } from './analytics'

export type CartItem = {
  productSlug: string
  name: string
  shortName?: string
  price: number
  quantity: number
  image: string | null
  selectedFrameId?: string | null
  selectedFrameColor?: string | null
  selectedFrameName?: string | null
  selectedFrameImage?: string | null
  selectedMagnification?: string | null
  hasPrescriptionLenses?: boolean
  hasExtendedWarranty?: boolean
  stripeProductId?: string | null
}

const CART_STORAGE_KEY = 'heliosx_cart'

// Get cart from localStorage
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    return cartData ? JSON.parse(cartData) : []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

// Save cart to localStorage
function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Get total number of items in cart
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

function sameConfiguration(a: CartItem, b: CartItem): boolean {
  return (
    a.productSlug === b.productSlug &&
    a.selectedFrameId === b.selectedFrameId &&
    a.selectedFrameColor === b.selectedFrameColor &&
    a.selectedMagnification === b.selectedMagnification &&
    Boolean(a.hasPrescriptionLenses) === Boolean(b.hasPrescriptionLenses)
  )
}

// Link from the cart back to a product page to change one bagged line.
export function cartEditHref(item: CartItem, index: number): string {
  return `/product/${item.productSlug}?edit=${index}`
}

// The bagged line a product page was opened to edit (via ?edit=N), if it
// belongs to this product.
export function getCartEditTarget(productSlug: string): { index: number; item: CartItem } | null {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('edit')
  if (raw === null || !/^\d+$/.test(raw)) return null
  const index = Number(raw)
  const item = getCart()[index]
  return item && item.productSlug === productSlug ? { index, item } : null
}

// Swap one line for its edited version instead of adding a second pair. If
// the edit makes it identical to another line, the two are merged.
export function replaceCartItem(index: number, item: CartItem): boolean {
  const cart = getCart()
  if (!cart[index] || cart[index].productSlug !== item.productSlug) return false
  cart[index] = item
  const duplicate = cart.findIndex((other, i) => i !== index && sameConfiguration(other, item))
  if (duplicate >= 0) {
    cart[duplicate].quantity += item.quantity
    cart.splice(index, 1)
  }
  saveCart(cart)
  return true
}

// Add item to cart
export function addToCart(item: CartItem): void {
  const cart = getCart()
  
  // Check if item already exists in cart
  const existingIndex = cart.findIndex(cartItem => sameConfiguration(cartItem, item))
  
  if (existingIndex >= 0) {
    // Update quantity if item exists
    cart[existingIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.push(item)
  }

  saveCart(cart)

  const variant = [item.selectedMagnification, item.selectedFrameName].filter(Boolean).join(' / ')
  trackAddToCart({
    itemId: item.productSlug,
    // Same name view_item sends, so GA4 joins views to add-to-carts per model.
    itemName: item.name,
    price: item.price,
    quantity: item.quantity,
    variant: variant || undefined,
  })
}

// Update quantity of a cart item
export function updateCartItemQuantity(productSlug: string, quantity: number): void {
  const cart = getCart()
  const itemIndex = cart.findIndex(item => item.productSlug === productSlug)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }
}

// Remove item from cart
export function removeFromCart(productSlug: string): void {
  const cart = getCart()
  const filteredCart = cart.filter(item => item.productSlug !== productSlug)
  saveCart(filteredCart)
}

// Update add-on selections for all cart items
export function updateCartAddOns(hasPrescriptionLenses: boolean, hasExtendedWarranty: boolean): void {
  const cart = getCart()
  const updatedCart = cart.map(item => ({
    ...item,
    hasPrescriptionLenses,
    hasExtendedWarranty,
  }))
  saveCart(updatedCart)
}

// Clear entire cart
export function clearCart(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

// Get total price of cart
export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

// Get Stripe product ID based on product slug and magnification
export function getStripeProductId(slug: string, magnification: string | null): string | null {
  if (!magnification) return null
  
  // Map of product slugs and magnifications to Stripe product IDs
  // These would need to be configured based on your actual Stripe products
  const stripeProductMap: Record<string, Record<string, string>> = {
    galileo: {
      '2.5x': 'price_galileo_25x',
      '3.0x': 'price_galileo_30x',
      '3.5x': 'price_galileo_35x',
    },
    newton: {
      '2.5x': 'price_newton_25x',
      '3.0x': 'price_newton_30x',
      '3.5x': 'price_newton_35x',
    },
    apollo: {
      '2.5x': 'price_apollo_25x',
      '3.0x': 'price_apollo_30x',
      '3.5x': 'price_apollo_35x',
    },
    kepler: {
      '3.0x': 'price_kepler_30x',
      '3.5x': 'price_kepler_35x',
      '4.0x': 'price_kepler_40x',
      '4.5x': 'price_kepler_45x',
    },
  }
  
  const productMap = stripeProductMap[slug]
  if (!productMap || !magnification) return null
  
  return productMap[magnification] || null
}
