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
    console.log('API received body:', JSON.stringify(body, null, 2))
    const items = (body.items ?? []) as IncomingItem[]
    console.log('Parsed items:', JSON.stringify(items, null, 2))

    if (!items.length) {
      console.error('No items in cart')
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Validate required fields
    for (const item of items) {
      if (!item.name || item.price === undefined || !item.quantity) {
        console.error('Invalid item:', item)
        return NextResponse.json(
          { error: `Invalid item: missing required fields (name, price, quantity)` },
          { status: 400 }
        )
      }
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(secretKey, {
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

    console.log('Creating Stripe session with line_items:', JSON.stringify(line_items, null, 2))
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?cancelled=1`,
    })

    console.log('Stripe session created:', session.id)

    // Return session ID for redirect checkout
    return NextResponse.json({ id: session.id })
  } catch (err: any) {
    console.error('Stripe checkout session error:', err)
    console.error('Error details:', {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode
    })
    return NextResponse.json(
      { 
        error: 'Unable to create checkout session',
        details: err.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
