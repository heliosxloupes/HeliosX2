import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import {
  MAX_LINE_ITEMS,
  MAX_QUANTITY_PER_LINE,
  productNameBySlug,
  resolveAddOn,
  resolveProductPrice,
} from '@/lib/pricing'

const WORLDWIDE_SHIPPING_COUNTRIES = `
  AC AD AE AF AG AI AL AM AO AQ AR AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
  CA CD CF CG CH CI CK CL CM CN CO CR CV CW CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FO FR GA GB GD
  GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IS IT JE JM JO JP KE KG KH
  KI KM KN KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MK ML MM MN MO MQ MR MS MT MU MV MW MX
  MY MZ NA NC NE NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PY QA RE RO RS RU RW SA SB SC SD
  SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SZ TA TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY
  UZ VA VC VE VG VN VU WF WS XK YE YT ZA ZM ZW
`
  .trim()
  .split(/\s+/) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]

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
    const analyticsConsent = body.analyticsConsent === 'granted' ? 'granted' : 'denied'

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

    const cookies = Object.fromEntries(
      String(req.headers.get('cookie') ?? '')
        .split(';')
        .map((part) => part.trim().split('='))
        .filter(([name]) => Boolean(name))
        .map(([name, ...value]) => [name, decodeURIComponent(value.join('='))])
    )
    const clientIp = String(req.headers.get('x-forwarded-for') ?? '')
      .split(',')[0]
      .trim()
      .slice(0, 64)
    const clientUserAgent = String(req.headers.get('user-agent') ?? '').slice(0, 450)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      ui_mode: 'embedded',
      customer_email: customerEmail,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: WORLDWIDE_SHIPPING_COUNTRIES },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard worldwide shipping',
          },
        },
      ],
      metadata: {
        customerEmail,
        cartSessionId,
        analyticsConsent,
        clientIp,
        clientUserAgent,
        fbp: String(cookies._fbp ?? '').slice(0, 200),
        fbc: String(cookies._fbc ?? '').slice(0, 200),
      },
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
