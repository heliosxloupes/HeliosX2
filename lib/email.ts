import { Resend } from 'resend'

let resend: Resend | null = null

const HELIOSX_SITE_URL = 'https://heliosxvision.com'
export const PDCHECK_AR_IOS_URL = 'https://apps.apple.com/us/app/pdcheck-ar/id1563806777'
export const HELIOSX_SUPPORT_EMAIL = 'heliosxloupes@gmail.com'

export type OrderEmailItem = {
  name: string
  quantity?: number | null
  amountTotal?: number | null
  details?: string[]
}

export type OrderEmailSummary = {
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingAddress?: string
  billingAddress?: string
  subtotal?: number | null
  total?: number | null
  currency?: string | null
  paymentStatus?: string | null
  paidAt?: string | null
  items?: OrderEmailItem[]
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

export function hasEmailEnv() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export async function sendEmail({
  to,
  subject,
  body,
  preview,
  eyebrow = 'HeliosX',
  title,
  cta,
  secondaryCta,
  orderSummary,
  bcc,
}: {
  to: string
  subject: string
  body: string
  preview?: string
  eyebrow?: string
  title?: string
  cta?: {
    label: string
    url: string
  }
  secondaryCta?: {
    label: string
    url: string
  }
  orderSummary?: OrderEmailSummary
  bcc?: string | string[]
}) {
  const client = getResend()
  const from = process.env.RESEND_FROM_EMAIL

  if (!client || !from) {
    console.log('[email skipped]', { to, subject })
    return { skipped: true }
  }

  return client.emails.send({
    from,
    to,
    bcc,
    subject,
    replyTo: HELIOSX_SUPPORT_EMAIL,
    text: renderTextEmail(body, orderSummary),
    html: renderHeliosEmail({
      preview: preview ?? subject,
      eyebrow,
      title: title ?? subject,
      body,
      cta,
      secondaryCta,
      orderSummary,
    }),
  })
}

export function renderTemplate(
  template: string,
  values: Record<string, string | number | null | undefined>
) {
  return Object.entries(values).reduce((body, [key, value]) => {
    return body.replaceAll(`{{${key}}}`, value == null ? '' : String(value))
  }, template)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function linkify(text: string) {
  return escapeHtml(text).replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#047857;text-decoration:underline;">$1</a>'
  )
}

function formatMoney(cents?: number | null, currency = 'usd') {
  if (typeof cents !== 'number') return ''
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    }).format(cents / 100)
  } catch {
    return `$${(cents / 100).toFixed(2)}`
  }
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function renderTextEmail(body: string, orderSummary?: OrderEmailSummary) {
  if (!orderSummary) return body
  const currency = orderSummary.currency ?? 'usd'
  const lines = [
    body,
    '',
    'Order details',
    orderSummary.orderNumber ? `Order: ${orderSummary.orderNumber}` : '',
    orderSummary.customerName ? `Customer: ${orderSummary.customerName}` : '',
    orderSummary.customerEmail ? `Email: ${orderSummary.customerEmail}` : '',
    orderSummary.customerPhone ? `Phone: ${orderSummary.customerPhone}` : '',
    orderSummary.paymentStatus ? `Payment: ${orderSummary.paymentStatus}` : '',
    orderSummary.paidAt ? `Paid: ${formatDate(orderSummary.paidAt)}` : '',
    '',
    'Items',
    ...(orderSummary.items ?? []).map((item) => {
      const price = formatMoney(item.amountTotal, currency)
      const details = item.details?.length ? ` (${item.details.join(', ')})` : ''
      return `- ${item.name}${details} x ${item.quantity ?? 1}${price ? ` - ${price}` : ''}`
    }),
    '',
    orderSummary.subtotal != null ? `Subtotal: ${formatMoney(orderSummary.subtotal, currency)}` : '',
    orderSummary.total != null ? `Total paid: ${formatMoney(orderSummary.total, currency)}` : '',
    '',
    orderSummary.shippingAddress ? `Shipping:\n${orderSummary.shippingAddress}` : '',
    orderSummary.billingAddress ? `Billing:\n${orderSummary.billingAddress}` : '',
  ]

  return lines.filter((line) => line !== '').join('\n')
}

function renderBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const isList = paragraph
        .split('\n')
        .every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))

      if (isList) {
        const items = paragraph
          .split('\n')
          .map((line) => line.trim().replace(/^[-*]\s+/, ''))
          .filter(Boolean)
          .map(
            (line) =>
              `<li style="margin:0 0 10px 0;padding-left:2px;color:#374151;font-size:15px;line-height:1.6;">${linkify(
                line
              )}</li>`
          )
          .join('')

        return `<ul style="margin:0 0 22px 20px;padding:0;">${items}</ul>`
      }

      return `<p style="margin:0 0 18px 0;color:#374151;font-size:15px;line-height:1.7;">${linkify(
        paragraph
      ).replaceAll('\n', '<br />')}</p>`
    })
    .join('')
}

function renderButton(label: string, url: string, variant: 'primary' | 'secondary') {
  const isPrimary = variant === 'primary'
  return `
    <a href="${escapeHtml(url)}"
      style="display:inline-block;border-radius:999px;padding:14px 22px;font-size:14px;font-weight:700;letter-spacing:.02em;text-decoration:none;${
        isPrimary
          ? 'background:#0f172a;color:#ffffff;'
          : 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;'
      }">
      ${escapeHtml(label)}
    </a>
  `
}

function renderInfoRow(label: string, value?: string | null) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:9px 0;color:#64748b;font-size:13px;line-height:1.45;">${escapeHtml(label)}</td>
      <td align="right" style="padding:9px 0;color:#0f172a;font-size:13px;line-height:1.45;font-weight:650;">${escapeHtml(
        value
      ).replaceAll('\n', '<br />')}</td>
    </tr>
  `
}

function renderOrderSummary(summary?: OrderEmailSummary) {
  if (!summary) return ''
  const currency = summary.currency ?? 'usd'
  const itemRows = (summary.items ?? [])
    .map((item) => {
      const details = item.details?.filter(Boolean) ?? []
      return `
        <tr>
          <td style="padding:14px 0;border-top:1px solid #e5e7eb;">
            <div style="color:#0f172a;font-size:14px;font-weight:750;line-height:1.35;">${escapeHtml(
              item.name
            )}</div>
            ${
              details.length
                ? `<div style="margin-top:5px;color:#64748b;font-size:12px;line-height:1.5;">${details
                    .map(escapeHtml)
                    .join(' &bull; ')}</div>`
                : ''
            }
            <div style="margin-top:5px;color:#94a3b8;font-size:12px;">Qty ${item.quantity ?? 1}</div>
          </td>
          <td align="right" style="padding:14px 0;border-top:1px solid #e5e7eb;color:#0f172a;font-size:14px;font-weight:750;white-space:nowrap;">
            ${escapeHtml(formatMoney(item.amountTotal, currency))}
          </td>
        </tr>
      `
    })
    .join('')

  return `
    <div style="margin:28px 0;border:1px solid #dbe7e2;border-radius:22px;overflow:hidden;background:#fbfdfc;">
      <div style="background:#0f172a;padding:18px 20px;">
        <div style="color:#6ee7b7;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;">Receipt</div>
        <div style="margin-top:7px;color:#ffffff;font-size:20px;font-weight:750;">Order confirmed</div>
      </div>
      <div style="padding:20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          ${renderInfoRow('Order', summary.orderNumber)}
          ${renderInfoRow('Customer', summary.customerName)}
          ${renderInfoRow('Email', summary.customerEmail)}
          ${renderInfoRow('Phone', summary.customerPhone)}
          ${renderInfoRow('Payment', summary.paymentStatus)}
          ${renderInfoRow('Paid', formatDate(summary.paidAt))}
        </table>
        ${
          itemRows
            ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:14px;">${itemRows}</table>`
            : ''
        }
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:8px;border-top:2px solid #0f172a;">
          ${renderInfoRow('Subtotal', formatMoney(summary.subtotal, currency))}
          ${renderInfoRow('Total paid', formatMoney(summary.total, currency))}
        </table>
        <div style="margin-top:18px;display:block;">
          ${
            summary.shippingAddress
              ? `<div style="margin-bottom:12px;border-radius:16px;background:#f1f5f9;padding:16px;">
                  <div style="color:#64748b;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">Shipping</div>
                  <div style="margin-top:8px;color:#0f172a;font-size:14px;line-height:1.55;font-weight:600;">${escapeHtml(
                    summary.shippingAddress
                  ).replaceAll('\n', '<br />')}</div>
                </div>`
              : ''
          }
          ${
            summary.billingAddress
              ? `<div style="border-radius:16px;background:#ecfdf5;padding:16px;">
                  <div style="color:#047857;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">Billing</div>
                  <div style="margin-top:8px;color:#0f172a;font-size:14px;line-height:1.55;font-weight:600;">${escapeHtml(
                    summary.billingAddress
                  ).replaceAll('\n', '<br />')}</div>
                </div>`
              : ''
          }
        </div>
      </div>
    </div>
  `
}

function renderHeliosEmail({
  preview,
  eyebrow,
  title,
  body,
  cta,
  secondaryCta,
  orderSummary,
}: {
  preview: string
  eyebrow: string
  title: string
  body: string
  cta?: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
  orderSummary?: OrderEmailSummary
}) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f4f7f6;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f6;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="border-radius:28px 28px 0 0;background:#020617;padding:28px 30px;border:1px solid #10201c;border-bottom:0;">
                <div style="font-size:13px;font-weight:800;letter-spacing:.26em;text-transform:uppercase;color:#6ee7b7;">HeliosX</div>
                <div style="margin-top:18px;color:#f8fafc;font-size:30px;line-height:1.15;font-weight:750;letter-spacing:-.02em;">${escapeHtml(
                  title
                )}</div>
                <div style="margin-top:12px;color:#94a3b8;font-size:13px;letter-spacing:.18em;text-transform:uppercase;">${escapeHtml(
                  eyebrow
                )}</div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;padding:30px;border:1px solid #dbe7e2;border-top:0;">
                ${renderBody(body)}
                ${renderOrderSummary(orderSummary)}
                ${
                  cta || secondaryCta
                    ? `<div style="margin-top:26px;margin-bottom:8px;">
                        ${cta ? renderButton(cta.label, cta.url, 'primary') : ''}
                        ${
                          secondaryCta
                            ? `<span style="display:inline-block;width:10px;"></span>${renderButton(
                                secondaryCta.label,
                                secondaryCta.url,
                                'secondary'
                              )}`
                            : ''
                        }
                      </div>`
                    : ''
                }
                <div style="margin-top:28px;border-top:1px solid #e5e7eb;padding-top:20px;color:#64748b;font-size:13px;line-height:1.6;">
                  Need help or want us to review your measurements? Reply directly to this email and our team will take a look.
                </div>
              </td>
            </tr>
            <tr>
              <td style="border-radius:0 0 28px 28px;background:#f8fafc;padding:24px 30px;border:1px solid #dbe7e2;border-top:0;">
                <div style="color:#0f172a;font-size:14px;font-weight:700;">Team HeliosX</div>
                <div style="margin-top:8px;color:#64748b;font-size:13px;line-height:1.6;">
                  Surgical optics built around the way you work.<br />
                  <a href="mailto:${HELIOSX_SUPPORT_EMAIL}" style="color:#047857;text-decoration:none;">${HELIOSX_SUPPORT_EMAIL}</a>
                  <span style="color:#cbd5e1;"> - </span>
                  <a href="${HELIOSX_SITE_URL}" style="color:#047857;text-decoration:none;">heliosxloupes.com</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
