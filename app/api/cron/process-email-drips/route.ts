import { NextResponse } from 'next/server'

import { renderTemplate, sendEmail } from '@/lib/email'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ processed: 0, skipped: 'Supabase not configured' })

  const { data: cartRows } = await supabase
    .from('abandoned_cart_sessions')
    .select('*')
    .is('completed_at', null)

  const { data: templateRows } = await supabase
    .from('email_templates')
    .select('*')
    .eq('is_active', true)
  const carts = cartRows ?? []
  const templates = templateRows ?? []

  let processed = 0
  const now = Date.now()

  for (const cart of carts as any[]) {
    const prefix = cart.reached_checkout_at ? 'checkout_abandoned' : 'cart_abandoned'
    const baseTime = new Date(cart.reached_checkout_at ?? cart.added_to_cart_at).getTime()

    for (const template of templates.filter((item: any) => item.key.startsWith(prefix))) {
      const dueAt = baseTime + Number(template.delay_days ?? 0) * 24 * 60 * 60 * 1000
      if (now < dueAt) continue

      const { data: existing } = await supabase
        .from('email_events')
        .select('id')
        .eq('template_key', template.key)
        .eq('related_cart_session_id', cart.id)
        .maybeSingle()

      if (existing) continue

      const subject = renderTemplate(template.subject, { email: cart.email })
      const body = renderTemplate(template.body, { email: cart.email })
      const result: any = await sendEmail({ to: cart.email, subject, body })

      await supabase.from('email_events').insert({
        template_key: template.key,
        recipient_email: cart.email,
        related_cart_session_id: cart.id,
        status: result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent',
        error: result?.error?.message ?? null,
      })
      processed += 1
    }
  }

  return NextResponse.json({ processed })
}
