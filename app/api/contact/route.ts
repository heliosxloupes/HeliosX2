import { NextResponse } from 'next/server'

import { upsertCrmContact } from '@/lib/commerce'
import { HELIOSX_SUPPORT_EMAIL, sendEmail } from '@/lib/email'

const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)

/**
 * Contact drawer submissions. Saves the person to the CRM and emails the
 * message to the team inbox with Reply-To set to the customer, so a lead is
 * never lost in a mail client or an unreachable mailbox.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  // Honeypot: real people never see or fill this field.
  if (clip(body?.company, 200)) return NextResponse.json({ ok: true })

  const email = clip(body?.email, 254).toLowerCase()
  const name = clip(body?.name, 120)
  const phone = clip(body?.phone, 40)
  const message = clip(body?.message, 5000)
  const topic = clip(body?.topic, 80) || 'Question'
  const product = clip(body?.product, 200)
  const page = clip(body?.page, 300)
  const source = clip(body?.source, 60)

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (message.length < 2) {
    return NextResponse.json({ error: 'Please write a short message.' }, { status: 400 })
  }

  const [crm, mail] = await Promise.allSettled([
    upsertCrmContact({
      email,
      phone: phone || null,
      source: 'contact form',
      metadata: {
        name: name || undefined,
        last_contact_topic: topic,
        last_contact_message: message.slice(0, 1000),
        last_contact_page: page || undefined,
        last_contact_at: new Date().toISOString(),
      },
    }),
    sendEmail({
      to: HELIOSX_SUPPORT_EMAIL,
      replyTo: email,
      subject: `Website question: ${topic}${product ? ` (${product})` : ''} from ${name || email}`,
      eyebrow: 'New website question',
      title: topic,
      body: [
        `From: ${name ? `${name} <${email}>` : email}`,
        phone ? `Phone: ${phone}` : '',
        product ? `Product: ${product}` : '',
        page ? `Page: ${page}` : '',
        source ? `Opened from: ${source}` : '',
        '',
        message,
        '',
        'Reply to this email to answer the customer directly.',
      ]
        .filter((line, index, lines) => line || lines[index - 1])
        .join('\n'),
    }),
  ])

  const mailed = mail.status === 'fulfilled' && !(mail.value as { error?: unknown })?.error
  const saved = crm.status === 'fulfilled' && crm.value !== null
  if (!mailed && !saved) {
    console.error('Contact form failed', { crm, mail })
    return NextResponse.json(
      { error: `Sorry, that didn't send. Please email ${HELIOSX_SUPPORT_EMAIL}.` },
      { status: 500 }
    )
  }
  if (!mailed) console.error('Contact form email failed (saved to CRM)', mail)

  return NextResponse.json({ ok: true })
}
