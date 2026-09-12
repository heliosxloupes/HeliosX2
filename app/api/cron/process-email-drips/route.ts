import { NextResponse } from 'next/server'

import { sendEmail } from '@/lib/email'
import { createCartRecoveryToken } from '@/lib/cart-recovery'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const DAY_MS = 24 * 60 * 60 * 1000
const RECOVERY_WINDOW_DAYS = 14
const MAX_RECOVERY_EMAILS_PER_CUSTOMER = 2
const MIN_RECOVERY_EMAIL_GAP_DAYS = 3

const normalizeEmail = (value: unknown) => String(value ?? '').trim().toLowerCase()

const recoveryProductImages: Record<string, string> = {
  newton: '/mobile-home/newton-v2.png',
  galileo: '/mobile-home/galileo-editorial.png',
  apollo: '/mobile-home/apollo-editorial.png',
  medusa: '/mobile-home/medusa-editorial.png',
  kepler: '/mobile-home/kepler-v2.png',
}

const cartActivityTime = (cart: any) =>
  new Date(cart.reached_checkout_at ?? cart.added_to_cart_at).getTime()

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  const authHeader = req.headers.get('authorization')
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET && bearer !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ processed: 0, skipped: 'Supabase not configured' })

  const { data: cartRows } = await supabase
    .from('abandoned_cart_sessions')
    .select('*')
    .is('completed_at', null)
    .order('updated_at', { ascending: false })

  const { data: templateRows } = await supabase
    .from('email_templates')
    .select('*')
    .eq('is_active', true)
  const carts = cartRows ?? []
  const templates = templateRows ?? []

  let processed = 0
  const now = Date.now()
  const recoveryCutoff = now - RECOVERY_WINDOW_DAYS * DAY_MS
  const recoveryTemplateKeys = templates
    .map((template: any) => String(template.key ?? ''))
    .filter((key: string) => key.startsWith('cart_abandoned') || key.startsWith('checkout_abandoned'))

  const { data: recentEventRows } = recoveryTemplateKeys.length
    ? await supabase
        .from('email_events')
        .select('recipient_email, template_key, sent_at, status')
        .in('template_key', recoveryTemplateKeys)
        .eq('status', 'sent')
        .gte('sent_at', new Date(recoveryCutoff).toISOString())
        .order('sent_at', { ascending: false })
    : { data: [] }

  const recentEventsByCustomer = new Map<string, any[]>()
  for (const event of recentEventRows ?? []) {
    const email = normalizeEmail(event.recipient_email)
    if (!email) continue
    const events = recentEventsByCustomer.get(email) ?? []
    events.push(event)
    recentEventsByCustomer.set(email, events)
  }

  // A customer can create several cart rows while changing configurations.
  // Only the newest incomplete row is eligible, so those rows cannot start
  // overlapping reminder sequences.
  const latestCartByCustomer = new Map<string, any>()
  for (const cart of carts as any[]) {
    const email = normalizeEmail(cart.email)
    if (!email || latestCartByCustomer.has(email)) continue
    latestCartByCustomer.set(email, cart)
  }

  for (const [email, cart] of latestCartByCustomer) {
    const prefix = cart.reached_checkout_at ? 'checkout_abandoned' : 'cart_abandoned'
    const baseTime = cartActivityTime(cart)
    if (!Number.isFinite(baseTime) || baseTime < recoveryCutoff) continue

    const recentEvents = recentEventsByCustomer.get(email) ?? []
    if (recentEvents.length >= MAX_RECOVERY_EMAILS_PER_CUSTOMER) continue

    const lastSentAt = recentEvents[0]?.sent_at
      ? new Date(recentEvents[0].sent_at).getTime()
      : 0
    if (lastSentAt && now - lastSentAt < MIN_RECOVERY_EMAIL_GAP_DAYS * DAY_MS) continue

    const sentTemplateKeys = new Set(recentEvents.map((event: any) => event.template_key))
    const template = templates
      .filter((item: any) => item.key.startsWith(prefix) && !sentTemplateKeys.has(item.key))
      .sort((left: any, right: any) => Number(left.delay_days ?? 0) - Number(right.delay_days ?? 0))
      .find((item: any) => now >= baseTime + Number(item.delay_days ?? 0) * DAY_MS)

    if (!template) continue

    const storedItems = Array.isArray(cart.cart_items) ? cart.cart_items : []
    const displayItems = storedItems.filter((item: any) => item && !item.isAddon)
    const firstProduct = displayItems[0]
    const firstProductName = String(firstProduct?.name ?? 'HeliosX surgical loupes')
    const shortProductName = firstProductName.replace(/\s+surgical loupes$/i, '').trim()
    const productReference = displayItems.length === 1
      ? `${shortProductName} loupes`
      : 'HeliosX loupe configuration'
    const productImage = firstProduct
      ? recoveryProductImages[String(firstProduct.productSlug ?? '').toLowerCase()] ?? String(firstProduct.image ?? '')
      : ''
    const productImageUrl = productImage
      ? /^https?:\/\//i.test(productImage)
        ? productImage
        : `${getSiteUrl()}${productImage.startsWith('/') ? '' : '/'}${productImage}`
      : null
    const subject = `A personal note about your ${productReference}`
    const body = `Hello — this is Dr. Efimenko, founder of HeliosX.

I wanted to personally reach out regarding your interest in our ${productReference}. Choosing surgical loupes is personal, especially when you are buying online for the first time.

If a question about magnification, working distance, measurements, prescription lenses, or fit held you back, reply directly to this email. Tell me what kind of work you do and what you are deciding between, and I will give you an honest recommendation.

Your configuration is saved below if you would like to pick up where you left off. There is no pressure either way.

Best,
Dr. Efimenko
Founder, HeliosX`
    const isCheckout = template.key.startsWith('checkout_abandoned')
    let recoveryUrl: string
    try {
      const recoveryToken = createCartRecoveryToken(cart.id)
      recoveryUrl = `${getSiteUrl()}/cart/recover?token=${encodeURIComponent(recoveryToken)}`
    } catch (error) {
      console.error('Cart recovery link generation failed', error)
      continue
    }
    const result: any = await sendEmail({
      to: email,
      subject,
      body,
      preview: isCheckout
        ? 'A personal note from Dr. Efimenko about your saved loupe configuration.'
        : 'Dr. Efimenko wanted to personally follow up about your loupe configuration.',
      eyebrow: 'From the founder',
      title: `A personal note about your ${productReference}.`,
      cta: {
        label: isCheckout ? 'Restore checkout' : 'Restore saved cart',
        url: recoveryUrl,
      },
      recoverySummary: {
        imageUrl: productImageUrl,
        items: displayItems.map((item: any) => ({
          name: String(item.name ?? 'HeliosX surgical loupes'),
          quantity: Math.max(1, Number(item.quantity ?? 1)),
          price: Number(item.price ?? 0),
        })),
        total: displayItems.reduce(
          (sum: number, item: any) => sum + Number(item.price ?? 0) * Math.max(1, Number(item.quantity ?? 1)),
          0,
        ),
      },
    })

    const status = result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent'
    await supabase.from('email_events').insert({
      template_key: template.key,
      recipient_email: email,
      related_cart_session_id: cart.id,
      status,
      error: result?.error?.message ?? null,
    })

    if (status === 'sent') {
      recentEventsByCustomer.set(email, [
        { recipient_email: email, template_key: template.key, sent_at: new Date(now).toISOString(), status },
        ...recentEvents,
      ])
    }
    processed += 1
  }

  return NextResponse.json({
    processed,
    customersConsidered: latestCartByCustomer.size,
    limits: {
      maximumEmailsPerCustomer: MAX_RECOVERY_EMAILS_PER_CUSTOMER,
      minimumDaysBetweenEmails: MIN_RECOVERY_EMAIL_GAP_DAYS,
      recoveryWindowDays: RECOVERY_WINDOW_DAYS,
    },
  })
}
