import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { getPrivateOffer } from '@/lib/private-offers'
import { getSiteUrl } from '@/lib/site-url'

/** The client sends only the offer token. Items and discount come from lib/private-offers.ts. */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const offer = getPrivateOffer(String(body.token ?? ''))
    if (!offer) {
      return NextResponse.json({ error: 'This checkout link is not valid.' }, { status: 404 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' as any })

    // An exhausted code stops being active, which closes the offer after one payment.
    const promotionCodes = await stripe.promotionCodes.list({
      code: offer.promotionCode,
      active: true,
      limit: 1,
    })
    const promotionCode = promotionCodes.data[0]
    if (!promotionCode) {
      return NextResponse.json(
        { error: 'This private checkout has already been used. Reply to our email and we will sort it out.' },
        { status: 410 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: offer.lines.map((line) => ({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: line.price * 100,
          product_data: {
            name: line.name,
            ...(line.description ? { description: line.description } : {}),
            metadata: line.metadata,
          },
        },
      })),
      discounts: [{ promotion_code: promotionCode.id }],
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: offer.shippingCountries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard shipping',
          },
        },
      ],
      metadata: {
        privateOffer: offer.id,
        analyticsConsent: body.analyticsConsent === 'granted' ? 'granted' : 'denied',
      },
      return_url: `${getSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({ client_secret: session.client_secret })
  } catch (err: any) {
    console.error('Stripe offer checkout session error:', {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      statusCode: err?.statusCode,
    })
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 })
  }
}
