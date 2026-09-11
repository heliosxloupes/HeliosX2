import { NextResponse } from 'next/server'

import { renderTemplate, sendEmail } from '@/lib/email'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const DAY_MS = 24 * 60 * 60 * 1000
const RECOVERY_WINDOW_DAYS = 14
const MAX_RECOVERY_EMAILS_PER_CUSTOMER = 2
const MIN_RECOVERY_EMAIL_GAP_DAYS = 3

const normalizeEmail = (value: unknown) => String(value ?? '').trim().toLowerCase()

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

    const subject = renderTemplate(template.subject, { email })
    const body = renderTemplate(template.body, { email })
    const isCheckout = template.key.startsWith('checkout_abandoned')
    const result: any = await sendEmail({
      to: email,
      subject,
      body,
      preview: isCheckout
        ? 'Your HeliosX checkout is still available when you are ready.'
        : 'Your HeliosX loupe configuration is still waiting for you.',
      eyebrow: isCheckout ? 'Checkout reminder' : 'Cart reminder',
      title: isCheckout ? 'Your checkout is still open' : 'Your HeliosX configuration is saved',
      cta: {
        label: isCheckout ? 'Return to checkout' : 'Return to cart',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://heliosxvision.com'}${
          isCheckout ? '/checkout' : '/cart'
        }`,
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
