import { NextResponse } from 'next/server'
import Stripe from 'stripe'

type IncomingItem = {
  productSlug: string
  name: string
  price: number
  quantity: number
  frameStyle?: string
  frameColor?: string
  magnification?: string
  isAddon?: boolean
  stripePriceId?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items = (body.items ?? []) as IncomingItem[]

    if (!items.length) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-06-20' as any,
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        if (item.isAddon && item.stripePriceId) {
          // Use a preconfigured Stripe Price for add-ons
          return {
            quantity: item.quantity || 1,
            price: item.stripePriceId,
            // optional metadata
          }
        }

        // Base loupes: dynamic price_data
        return {
          quantity: item.quantity || 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: item.name,
              metadata: {
                productSlug: item.productSlug,
                frameStyle: item.frameStyle ?? '',
                frameColor: item.frameColor ?? '',
                magnification: item.magnification ?? '',
              },
            },
          },
        }
      })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?cancelled=1`,
    })

    return NextResponse.json({ id: session.id })
  } catch (err) {
    console.error('Stripe checkout session error', err)
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}
