import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-auth'
import { renderTemplate, sendEmail } from '@/lib/email'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const body = await req.json()
  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const { data: order, error } = await supabase
    .from('orders')
    .update({
      tracking_number: body.trackingNumber,
      tracking_url: body.trackingUrl,
      status: 'shipped',
      shipped_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('key', 'tracking')
    .maybeSingle()

  if (template?.is_active) {
    const subject = renderTemplate(template.subject, body)
    const emailBody = renderTemplate(template.body, {
      tracking_number: body.trackingNumber,
      tracking_url: body.trackingUrl,
    })
    const result: any = await sendEmail({
      to: order.customer_email,
      subject,
      body: emailBody,
      preview: 'Your HeliosX order has shipped.',
      eyebrow: 'Shipping update',
      title: 'Your HeliosX order has shipped',
      cta: body.trackingUrl
        ? {
            label: 'Track shipment',
            url: body.trackingUrl,
          }
        : undefined,
    })
    await supabase.from('email_events').insert({
      template_key: 'tracking',
      recipient_email: order.customer_email,
      related_order_id: order.id,
      status: result?.error ? 'error' : result?.skipped ? 'skipped' : 'sent',
      error: result?.error?.message ?? null,
    })
  }

  return NextResponse.json({ ok: true })
}
