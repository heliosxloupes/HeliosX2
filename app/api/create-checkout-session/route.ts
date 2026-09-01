import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import {
  MAX_LINE_ITEMS,
  MAX_QUANTITY_PER_LINE,
  productNameBySlug,
  resolveAddOn,
  resolveProductPrice,
} from '@/lib/pricing'

type IncomingItem = {
  productSlug?: string
  name?: string
  price?: number
  quantity?: number
  frameStyle?: string
  frameColor?: string
  magnification?: string
  isAddon?: boolean
}

/**
 * The client tells us WHAT was ordered. It never tells us what it costs —
 * every amount below is looked up server-side from lib/pricing.json.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items = (body.items ?? []) as IncomingItem[]
    const customerEmail = String(body.customerEmail ?? '').trim().toLowerCase()
    const cartSessionId = body.cartSessionId ? String(body.cartSessionId) : ''

    if (!items.length) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (items.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Customer email is required before checkout' },
        { status: 400 }
      )
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      const slug = String(item.productSlug ?? '').trim()
      if (!slug) {
        return NextResponse.json({ error: 'Invalid item: missing product' }, { status: 400 })
      }

      const quantity = Number(item.quantity ?? 0)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
        return NextResponse.json(
          { error: `Invalid quantity for ${slug}` },
          { status: 400 }
        )
      }

      if (item.isAddon) {
        const addOn = resolveAddOn(slug)
        if (!addOn) {
          return NextResponse.json({ error: `Unknown add-on: ${slug}` }, { status: 400 })
        }

        line_items.push({
          quantity,
          price_data: {
            currency: 'usd',
            unit_amount: addOn.price * 100,
            product_data: {
              name: addOn.name,
              metadata: { productSlug: slug, isAddon: 'true' },
            },
          },
        })
        continue
      }

      const magnification = String(item.magnification ?? '').trim()
      const unitPrice = resolveProductPrice(slug, magnification)

      if (unitPrice === null) {
        console.error('Rejected unpriceable line item', { slug, magnification })
        return NextResponse.json(
          { error: `We could not price ${slug} at ${magnification || 'the selected magnification'}.` },
          { status: 400 }
        )
      }

      line_items.push({
        quantity,
        price_data: {
          currency: 'usd',
          unit_amount: unitPrice * 100,
          product_data: {
            name: productNameBySlug[slug] ?? slug,
            metadata: {
              productSlug: slug,
              frameStyle: item.frameStyle ?? '',
              frameColor: item.frameColor ?? '',
              magnification,
            },
          },
        },
      })
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' as any })

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://heliosxvision.com')
      .trim()
      .replace(/\/+$/, '')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      ui_mode: 'embedded',
      customer_email: customerEmail,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      metadata: { customerEmail, cartSessionId },
      return_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({ client_secret: session.client_secret })
  } catch (err: any) {
    console.error('Stripe checkout session error:', {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      statusCode: err?.statusCode,
    })
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}
