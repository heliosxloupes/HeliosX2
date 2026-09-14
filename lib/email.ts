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

export type RecoveryEmailSummary = {
  imageUrl?: string | null
  total?: number | null
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
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
  recoverySummary,
  bcc,
  replyTo = HELIOSX_SUPPORT_EMAIL,
}: {
  to: string
  /** Where "Reply" goes. Defaults to the support inbox. */
  replyTo?: string
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
  recoverySummary?: RecoveryEmailSummary
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
    replyTo,
    text: `${renderTextEmail(body, orderSummary)}${cta ? `\n\n${cta.label}: ${cta.url}` : ''}`,
    html: recoverySummary ? renderRecoveryEmail({
      preview: preview ?? subject,
      title: title ?? subject,
      body,
      cta,
      summary: recoverySummary,
    }) : renderHeliosEmail({
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

function renderRecoveryEmail({
  preview,
  title,
  body,
  cta,
  summary,
}: {
  preview: string
  title: string
  body: string
  cta?: { label: string; url: string }
  summary: RecoveryEmailSummary
}) {
  const itemRows = summary.items.map((item) => `
    <tr>
      <td style="padding:14px 0;border-top:1px solid #24312b;color:#f1f5f2;font-size:14px;font-weight:700;line-height:1.4;">
        ${escapeHtml(item.name)}${item.quantity > 1 ? ` <span style="color:#7f8c85;font-weight:400;">× ${item.quantity}</span>` : ''}
      </td>
      <td align="right" style="padding:14px 0;border-top:1px solid #24312b;color:#f1f5f2;font-size:14px;font-weight:700;white-space:nowrap;">
        ${escapeHtml(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.price * item.quantity))}
      </td>
    </tr>`).join('')

  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${escapeHtml(title)}</title></head>
  <body style="margin:0;background:#e4e9e6;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#e4e9e6;border-collapse:collapse;">
      <tr><td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:#060a08;border:1px solid #1b2822;border-collapse:collapse;">
          <tr><td style="padding:24px 28px;border-bottom:1px solid #1b2822;">
            <table role="presentation" width="100%"><tr>
              <td style="color:#f5f7f5;font-size:14px;font-weight:800;letter-spacing:.22em;">HELIOSX</td>
              <td align="right" style="color:#78e8bd;font-size:10px;font-weight:800;letter-spacing:.16em;">PERSONAL NOTE</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:38px 28px 20px;">
            <div style="color:#78e8bd;font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;">From the founder</div>
            <h1 style="max-width:500px;margin:14px 0 20px;color:#f3f6f4;font-size:38px;line-height:1.05;font-weight:500;letter-spacing:-.04em;">${escapeHtml(title)}</h1>
            <div style="color:#b4beb8;font-size:15px;line-height:1.72;">${renderRecoveryBody(body)}</div>
          </td></tr>
          ${summary.imageUrl ? `<tr><td style="padding:8px 28px 0;"><div style="height:260px;background:#0b120e;border:1px solid #24312b;text-align:center;overflow:hidden;"><img src="${escapeHtml(summary.imageUrl)}" width="560" alt="Your saved HeliosX loupe configuration" style="display:block;width:100%;height:260px;object-fit:contain;border:0;" /></div></td></tr>` : ''}
          <tr><td style="padding:0 28px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${itemRows}
              ${summary.total != null ? `<tr><td style="padding:15px 0;border-top:1px solid #3a4b42;color:#78e8bd;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Saved configuration</td><td align="right" style="padding:15px 0;border-top:1px solid #3a4b42;color:#f5f7f5;font-size:19px;font-weight:700;">${escapeHtml(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.total))}</td></tr>` : ''}
            </table>
          </td></tr>
          ${cta ? `<tr><td style="padding:22px 28px 8px;"><a href="${escapeHtml(cta.url)}" style="display:block;background:#78e8bd;color:#06100b;padding:17px 20px;text-align:center;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:.05em;">${escapeHtml(cta.label.toUpperCase())} &nbsp;→</a></td></tr>` : ''}
          <tr><td style="padding:18px 28px 25px;color:#98a49d;font-size:12px;line-height:1.65;text-align:center;">Questions about fit or magnification? Reply directly to this email.</td></tr>
          <tr><td style="padding:20px 28px;border-top:1px solid #1b2822;background:#030504;color:#68736d;font-size:10px;line-height:1.7;">Secure Stripe checkout &nbsp;·&nbsp; Measurements reviewed before production &nbsp;·&nbsp; Two-year limited warranty<br /><a href="${HELIOSX_SITE_URL}" style="color:#8d9992;text-decoration:none;">heliosxvision.com</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/returns" style="color:#8d9992;text-decoration:none;">Returns</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:#8d9992;text-decoration:none;">Warranty</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

function renderRecoveryBody(body: string) {
  return body.split(/\n{2,}/).map((paragraph) => {
    const lines = paragraph.trim().split('\n').map(escapeHtml)
    return `<p style="margin:0 0 18px;color:#b4beb8;font-size:15px;line-height:1.72;">${lines.join('<br />')}</p>`
  }).join('')
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
    '<a href="$1" style="color:#78e8bd;text-decoration:underline;">$1</a>'
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


// Shared layout for every HeliosX email: the dark card, mint accents and
// trust footer introduced with the founder follow-up (renderRecoveryEmail).
const BRAND = {
  page: '#e4e9e6',
  card: '#060a08',
  line: '#1b2822',
  rule: '#24312b',
  mint: '#78e8bd',
  heading: '#f3f6f4',
  text: '#b4beb8',
  muted: '#7f8c85',
  panel: '#0b120e',
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
              `<li style="margin:0 0 10px 0;padding-left:2px;color:${BRAND.text};font-size:15px;line-height:1.65;">${linkify(line)}</li>`
          )
          .join('')

        return `<ul style="margin:0 0 20px 20px;padding:0;">${items}</ul>`
      }

      return `<p style="margin:0 0 18px 0;color:${BRAND.text};font-size:15px;line-height:1.72;">${linkify(
        paragraph
      ).replaceAll('\n', '<br />')}</p>`
    })
    .join('')
}

function renderButton(label: string, url: string, variant: 'primary' | 'secondary') {
  const style =
    variant === 'primary'
      ? `background:${BRAND.mint};color:#06100b;`
      : `background:transparent;color:${BRAND.mint};border:1px solid ${BRAND.mint};`
  return `<a href="${escapeHtml(url)}" style="display:block;${style}padding:17px 20px;text-align:center;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:.05em;">${escapeHtml(
    label.toUpperCase()
  )}${variant === 'primary' ? ' &nbsp;→' : ''}</a>`
}

function renderInfoRow(label: string, value?: string | null) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:9px 0;color:${BRAND.muted};font-size:13px;line-height:1.45;">${escapeHtml(label)}</td>
      <td align="right" style="padding:9px 0;color:${BRAND.heading};font-size:13px;line-height:1.45;font-weight:700;">${escapeHtml(
        value
      ).replaceAll('\n', '<br />')}</td>
    </tr>`
}

function renderAddressPanel(label: string, value?: string) {
  if (!value) return ''
  return `<td valign="top" style="padding:16px;background:${BRAND.panel};border:1px solid ${BRAND.rule};">
    <div style="color:${BRAND.mint};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">${label}</div>
    <div style="margin-top:8px;color:${BRAND.heading};font-size:13px;line-height:1.6;">${escapeHtml(value).replaceAll('\n', '<br />')}</div>
  </td>`
}

function renderOrderSummary(summary?: OrderEmailSummary) {
  if (!summary) return ''
  const currency = summary.currency ?? 'usd'
  const itemRows = (summary.items ?? [])
    .map((item) => {
      const details = item.details?.filter(Boolean) ?? []
      const quantity = item.quantity ?? 1
      return `
        <tr>
          <td style="padding:14px 0;border-top:1px solid ${BRAND.rule};">
            <div style="color:${BRAND.heading};font-size:14px;font-weight:700;line-height:1.4;">${escapeHtml(item.name)}${
              quantity > 1 ? ` <span style="color:${BRAND.muted};font-weight:400;">× ${quantity}</span>` : ''
            }</div>
            ${
              details.length
                ? `<div style="margin-top:5px;color:${BRAND.muted};font-size:12px;line-height:1.5;">${details
                    .map(escapeHtml)
                    .join(' &nbsp;·&nbsp; ')}</div>`
                : ''
            }
          </td>
          <td align="right" valign="top" style="padding:14px 0;border-top:1px solid ${BRAND.rule};color:${BRAND.heading};font-size:14px;font-weight:700;white-space:nowrap;">
            ${escapeHtml(formatMoney(item.amountTotal, currency))}
          </td>
        </tr>`
    })
    .join('')

  const info = [
    renderInfoRow('Customer', summary.customerName),
    renderInfoRow('Email', summary.customerEmail),
    renderInfoRow('Phone', summary.customerPhone),
    renderInfoRow('Payment', summary.paymentStatus),
    renderInfoRow('Paid', formatDate(summary.paidAt)),
  ].join('')
  const addresses = [
    renderAddressPanel('Shipping to', summary.shippingAddress),
    renderAddressPanel('Billing', summary.billingAddress),
  ].filter(Boolean)

  return `
    <tr><td style="padding:8px 28px 0;">
      ${info ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:6px;">${info}</table>` : ''}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${itemRows}
        ${
          summary.subtotal != null && summary.subtotal !== summary.total
            ? `<tr><td style="padding:12px 0;border-top:1px solid ${BRAND.rule};color:${BRAND.muted};font-size:13px;">Subtotal</td><td align="right" style="padding:12px 0;border-top:1px solid ${BRAND.rule};color:${BRAND.heading};font-size:13px;font-weight:700;">${escapeHtml(formatMoney(summary.subtotal, currency))}</td></tr>`
            : ''
        }
        ${
          summary.total != null
            ? `<tr><td style="padding:15px 0;border-top:1px solid #3a4b42;color:${BRAND.mint};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Total paid</td><td align="right" style="padding:15px 0;border-top:1px solid #3a4b42;color:${BRAND.heading};font-size:19px;font-weight:700;">${escapeHtml(formatMoney(summary.total, currency))}</td></tr>`
            : ''
        }
      </table>
      ${
        addresses.length
          ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:${addresses.length > 1 ? '8px 0' : '0'};margin:14px ${addresses.length > 1 ? '-8px' : '0'} 0;"><tr>${addresses.join('')}</tr></table>`
          : ''
      }
    </td></tr>`
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
  const kicker = orderSummary?.orderNumber ? `Order ${orderSummary.orderNumber}` : ''
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${escapeHtml(title)}</title></head>
  <body style="margin:0;background:${BRAND.page};font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${BRAND.page};border-collapse:collapse;">
      <tr><td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:${BRAND.card};border:1px solid ${BRAND.line};border-collapse:collapse;">
          <tr><td style="padding:24px 28px;border-bottom:1px solid ${BRAND.line};">
            <table role="presentation" width="100%"><tr>
              <td style="color:#f5f7f5;font-size:14px;font-weight:800;letter-spacing:.22em;">HELIOSX</td>
              <td align="right" style="color:${BRAND.mint};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">${escapeHtml(eyebrow)}</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:38px 28px 12px;">
            ${kicker ? `<div style="color:${BRAND.mint};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;">${escapeHtml(kicker)}</div>` : ''}
            <h1 style="max-width:520px;margin:${kicker ? '14px' : '0'} 0 20px;color:${BRAND.heading};font-size:34px;line-height:1.08;font-weight:500;letter-spacing:-.03em;">${escapeHtml(title)}</h1>
            <div style="color:${BRAND.text};font-size:15px;line-height:1.72;">${renderBody(body)}</div>
          </td></tr>
          ${renderOrderSummary(orderSummary)}
          ${cta ? `<tr><td style="padding:22px 28px 0;">${renderButton(cta.label, cta.url, 'primary')}</td></tr>` : ''}
          ${secondaryCta ? `<tr><td style="padding:10px 28px 0;">${renderButton(secondaryCta.label, secondaryCta.url, 'secondary')}</td></tr>` : ''}
          <tr><td style="padding:26px 28px 6px;">
            <div style="color:${BRAND.heading};font-size:14px;font-weight:700;">Team HeliosX</div>
            <div style="margin-top:4px;color:${BRAND.muted};font-size:12px;line-height:1.6;">Questions about fit, magnification or your order? Reply directly to this email.</div>
          </td></tr>
          <tr><td style="padding:22px 28px;border-top:1px solid ${BRAND.line};background:#030504;color:#68736d;font-size:10px;line-height:1.7;">Secure Stripe checkout &nbsp;·&nbsp; Measurements reviewed before production &nbsp;·&nbsp; Two-year limited warranty<br /><a href="${HELIOSX_SITE_URL}" style="color:#8d9992;text-decoration:none;">heliosxvision.com</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/returns" style="color:#8d9992;text-decoration:none;">Returns</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:#8d9992;text-decoration:none;">Warranty</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}
