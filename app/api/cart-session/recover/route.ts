import { NextResponse } from 'next/server'

import { verifyCartRecoveryToken } from '@/lib/cart-recovery'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const productImages: Record<string, string> = {
  newton: '/mobile-home/newton-v2.png',
  galileo: '/mobile-home/galileo-editorial.png',
  apollo: '/mobile-home/apollo-editorial.png',
  medusa: '/mobile-home/medusa-editorial.png',
  kepler: '/mobile-home/kepler-v2.png',
}

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } })

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? ''
  let verified
  try {
    verified = verifyCartRecoveryToken(token)
  } catch {
    return json({ error: 'Cart recovery is not configured.' }, 503)
  }
  if (!verified) return json({ error: 'This cart link is invalid or has expired.' }, 400)

  const supabase = getSupabaseServiceClient()
  if (!supabase) return json({ error: 'Cart recovery is temporarily unavailable.' }, 503)

  const { data: cart, error } = await supabase
    .from('abandoned_cart_sessions')
    .select('id,email,cart_items,stage,reached_checkout_at,completed_at')
    .eq('id', verified.cartSessionId)
    .maybeSingle()

  if (error) return json({ error: 'We could not restore this cart.' }, 500)
  if (!cart) return json({ error: 'This saved cart no longer exists.' }, 404)
  if (cart.completed_at) return json({ error: 'This cart has already been completed.' }, 410)

  const storedItems = Array.isArray(cart.cart_items) ? cart.cart_items : []
  const prescriptionQuantity = storedItems
    .filter((item: any) => item?.productSlug === 'prescription-lenses')
    .reduce((sum: number, item: any) => sum + Math.max(1, Number(item?.quantity ?? 1)), 0)
  const warranty = storedItems.some(
    (item: any) => item?.productSlug === 'extended-warranty' || Boolean(item?.hasExtendedWarranty),
  )

  const cartItems = storedItems
    .filter((item: any) => item && !item.isAddon && !['prescription-lenses', 'extended-warranty'].includes(item.productSlug))
    .map((item: any) => {
      const productSlug = String(item.productSlug ?? '').trim().toLowerCase()
      return {
        productSlug,
        name: String(item.name ?? `${productSlug} Surgical Loupes`),
        shortName: item.shortName ? String(item.shortName) : undefined,
        price: Number(item.price ?? 0),
        quantity: Math.max(1, Math.min(10, Number(item.quantity ?? 1))),
        image: item.image ? String(item.image) : productImages[productSlug] ?? null,
        selectedFrameId: item.selectedFrameId ? String(item.selectedFrameId) : null,
        selectedFrameColor: item.selectedFrameColor ?? item.frameColor ?? null,
        selectedFrameName: item.selectedFrameName ?? item.frameStyle ?? null,
        selectedFrameImage: item.selectedFrameImage ? String(item.selectedFrameImage) : null,
        selectedMagnification: item.selectedMagnification ?? item.magnification ?? null,
        hasPrescriptionLenses: Boolean(item.hasPrescriptionLenses) || prescriptionQuantity > 0,
        hasExtendedWarranty: warranty,
      }
    })

  if (!cartItems.length) return json({ error: 'This saved cart is empty.' }, 410)
  const recoveredPrescriptionQuantity = prescriptionQuantity || cartItems.reduce(
    (sum: number, item: any) => sum + (item.hasPrescriptionLenses ? item.quantity : 0),
    0,
  )

  return json({
    cartSessionId: cart.id,
    customerEmail: cart.email,
    cartItems,
    addOns: {
      prescription: recoveredPrescriptionQuantity > 0,
      prescriptionQuantity: recoveredPrescriptionQuantity,
      warranty,
    },
    destination: cart.reached_checkout_at || cart.stage === 'checkout' ? '/checkout' : '/cart',
  })
}
