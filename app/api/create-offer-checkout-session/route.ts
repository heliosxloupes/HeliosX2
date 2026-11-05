import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { getPrivateOffer, pricedOfferLines, type PrivateOffer } from '@/lib/private-offers'
import { getSiteUrl } from '@/lib/site-url'

const OFFER_ID_PATTERN = /^[A-Za-z0-9_-]+$/
const ALREADY_USED = 'This private checkout has already been used. Reply to our email and we will sort it out.'

/** The client sends only the offer token. Items and the amount come from lib/private-offers.ts. */
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
    const promotionCodeId = await promotionCodeFor(stripe, offer)
    if (offer.promotionCode && !promotionCodeId) {
      return NextResponse.json({ error: ALREADY_USED }, { status: 410 })
    }
    if (!offer.promotionCode && (await netOfferAlreadyPaid(stripe, offer.id))) {
      return NextResponse.json({ error: ALREADY_USED }, { status: 410 })
    }

    const lines = pricedOfferLines(offer)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: lines.map((line) => ({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: line.unitAmountCents,
          product_data: {
            name: line.name,
            ...(line.description ? { description: line.description } : {}),
            metadata: Object.fromEntries(Object.entries(line.metadata).filter(([, value]) => value !== '')),
          },
        },
      })),
      // One code, applied by us. Customers cannot type another code on top.
      ...(promotionCodeId ? { discounts: [{ promotion_code: promotionCodeId }] } : {}),
      payment_intent_data: {
        metadata: { privateOffer: offer.id },
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: offer.shippingCountries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: offer.shippingDisplayName ?? 'Standard shipping',
          },
        },
      ],
      metadata: {
        privateOffer: offer.id,
        discountMode: offer.promotionCode ? 'promotion_code' : 'net_line_prices',
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

/** Active promotion code for offers that still discount through Stripe. Null when the code is exhausted. */
async function promotionCodeFor(stripe: Stripe, offer: PrivateOffer): Promise<string | null> {
  if (!offer.promotionCode) return null
  const promotionCodes = await stripe.promotionCodes.list({
    code: offer.promotionCode,
    active: true,
    limit: 1,
  })
  return promotionCodes.data[0]?.id ?? null
}

/**
 * Net-priced offers have no coupon to exhaust. A completed Checkout Session
 * for this offer, or a succeeded PaymentIntent tagged with it, closes the link.
 * Open sessions are expired so a tab still showing the previous loupes-only
 * invoice cannot be paid. Lookup failures do not block a new charge.
 */
async function netOfferAlreadyPaid(stripe: Stripe, offerId: string): Promise<boolean> {
  if (!OFFER_ID_PATTERN.test(offerId)) {
    throw new Error(`Refusing to query Stripe for offer id ${offerId}`)
  }

  const recentlyPaid = await expireStaleOfferSessions(stripe, offerId)
  if (recentlyPaid) return true

  try {
    const paid = await stripe.paymentIntents.search({
      query: `metadata['privateOffer']:'${offerId}' AND status:'succeeded'`,
      limit: 1,
    })
    return paid.data.length > 0
  } catch (err: any) {
    console.error('Private offer redemption check failed; checkout will still open', {
      offerId,
      message: err?.message,
    })
    return false
  }
}

/** Recent sessions are listed, not searched: Checkout Session search is not in the SDK. */
async function expireStaleOfferSessions(stripe: Stripe, offerId: string): Promise<boolean> {
  const twoDaysAgo = Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60
  let startingAfter: string | undefined
  let paid = false
  const openIds: string[] = []

  try {
    for (let page = 0; page < 5; page++) {
      const list = await stripe.checkout.sessions.list({
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      })
      for (const session of list.data) {
        if (session.metadata?.privateOffer !== offerId) continue
        if (session.status === 'complete') paid = true
        else if (session.status === 'open') openIds.push(session.id)
      }
      const oldest = list.data[list.data.length - 1]
      if (!list.has_more || !oldest || oldest.created < twoDaysAgo) break
      startingAfter = oldest.id
    }
  } catch (err: any) {
    console.error('Could not list private-offer sessions', { offerId, message: err?.message })
  }

  await Promise.all(
    openIds.map(async (sessionId) => {
      try {
        await stripe.checkout.sessions.expire(sessionId)
      } catch (err: any) {
        console.error('Could not expire an open private-offer session', {
          sessionId,
          message: err?.message,
        })
      }
    })
  )

  return paid
}
