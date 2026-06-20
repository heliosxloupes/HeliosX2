import { NextResponse } from 'next/server'

import { upsertCrmContact } from '@/lib/commerce'
import { HELIOSX_SUPPORT_EMAIL, sendEmail, type OrderEmailSummary } from '@/lib/email'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const token = String(body?.token ?? '')
  const email = String(body?.email ?? '').trim().toLowerCase()
  const pupillaryDistance = String(body?.pupillaryDistance ?? '').trim()

  if (!token || !email || !pupillaryDistance) {
    return NextResponse.json({ error: 'Token, email, and PD are required' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('measurement_token', token)
    .maybeSingle()

  if (!order) return NextResponse.json({ error: 'Invalid measurement link' }, { status: 404 })

  await supabase.from('measurements').insert({
    order_id: order.id,
    email,
    pupillary_distance: pupillaryDistance,
    working_distance: body?.workingDistance ?? null,
    prescription_notes: body?.prescriptionNotes ?? null,
    additional_notes: body?.additionalNotes ?? null,
  })

  await supabase
    .from('orders')
    .update({ status: 'measurements_received' })
    .eq('id', order.id)

  await supabase.from('order_status_events').insert({
    order_id: order.id,
    status: 'measurements_received',
    note: 'Customer submitted measurements',
    metadata: {
      email,
      hasWorkingDistance: Boolean(body?.workingDistance),
      hasPrescriptionNotes: Boolean(body?.prescriptionNotes),
    },
  })

  await upsertCrmContact({ email, source: 'measurement' })

  // Notify the team (review) and confirm to the customer. Email failures must
  // not fail the submission — the measurements are already saved above.
  try {
    await sendMeasurementEmails({
      order,
      submittedEmail: email,
      pupillaryDistance,
      workingDistance: body?.workingDistance ? String(body.workingDistance).trim() : '',
      prescriptionNotes: body?.prescriptionNotes ? String(body.prescriptionNotes).trim() : '',
      additionalNotes: body?.additionalNotes ? String(body.additionalNotes).trim() : '',
    })
  } catch (error) {
    console.error('[measurements] email send failed', error)
  }

  return NextResponse.json({ ok: true })
}

async function sendMeasurementEmails({
  order,
  submittedEmail,
  pupillaryDistance,
  workingDistance,
  prescriptionNotes,
  additionalNotes,
}: {
  order: any
  submittedEmail: string
  pupillaryDistance: string
  workingDistance: string
  prescriptionNotes: string
  additionalNotes: string
}) {
  const customerName = order?.customer_name as string | undefined
  const customerEmail = (order?.customer_email as string | undefined) || submittedEmail
  const who = customerName || customerEmail
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heliosxvision.com'

  const orderSummary: OrderEmailSummary = {
    orderNumber: order?.id,
    customerName,
    customerEmail,
    customerPhone: order?.customer_phone ?? undefined,
    subtotal: order?.subtotal ?? undefined,
    total: order?.total ?? undefined,
    currency: order?.currency ?? 'usd',
    paymentStatus: order?.payment_status ?? undefined,
    items: Array.isArray(order?.items)
      ? order.items.map((item: any) => ({
          name: item?.description || 'HeliosX item',
          quantity: item?.quantity ?? 1,
          amountTotal: item?.amountTotal ?? item?.amount_total ?? null,
          details: [],
        }))
      : [],
  }

  const measurementList = [
    `- Pupillary distance (PD): ${pupillaryDistance}`,
    workingDistance ? `- Working distance: ${workingDistance}` : '',
    prescriptionNotes ? `- Prescription notes: ${prescriptionNotes}` : '',
    additionalNotes ? `- Anything else: ${additionalNotes}` : '',
    `- Submitted from: ${submittedEmail}`,
  ]
    .filter(Boolean)
    .join('\n')

  // 1) Internal review email to the HeliosX team.
  await sendEmail({
    to: HELIOSX_SUPPORT_EMAIL,
    subject: `Measurements submitted — ${who}`,
    preview: `${who} submitted fit measurements — ready for review.`,
    eyebrow: 'Internal · Measurements',
    title: 'Measurements submitted',
    body: [
      `${who} just submitted their fit measurements. Their order is ready to review and move toward production.`,
      '',
      measurementList,
    ].join('\n'),
    orderSummary,
    cta: {
      label: 'Open admin orders',
      url: `${baseUrl}/admin/orders`,
    },
  })

  // 2) Confirmation to the customer.
  await sendEmail({
    to: customerEmail,
    subject: 'We received your HeliosX measurements',
    preview: 'Thanks — your fit measurements are in and your order is moving into review.',
    eyebrow: 'Measurements received',
    title: 'Measurements received',
    body: [
      `Thanks${customerName ? `, ${customerName}` : ''} — we have received your fit measurements and your HeliosX order is now moving into review.`,
      '',
      'Our team will check your details and start building your loupes around the way you work. If we need anything else to perfect your fit, we will reach out to you directly.',
      '',
      'Have a question in the meantime? Just reply to this email.',
    ].join('\n'),
  })
}
