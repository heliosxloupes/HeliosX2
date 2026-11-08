import { Resend } from 'resend'

let resend: Resend | null = null

const HELIOSX_SITE_URL = 'https://heliosxvision.com'
export const PD_GUIDE_URL = `${HELIOSX_SITE_URL}/measurements/ipd`
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

/**
 * Supplier purchase order. Built for forwarding to the factory, so it carries
 * no prices, no HeliosX branding and no customer email: only what the
 * supplier needs to build and ship the order.
 */
export type SupplierInvoiceSpec = { label: string; value: string }

export type SupplierInvoice = {
  poNumber: string
  date: string
  recipientName?: string
  recipientPhone?: string
  shippingAddress?: string
  needsMeasurements?: boolean
  items: Array<{
    model: string
    quantity: number
    specs: SupplierInvoiceSpec[]
  }>
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
  supplierInvoice,
  confirmation,
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
  supplierInvoice?: SupplierInvoice
  /** Customer order confirmation: renders the dedicated receipt layout. */
  confirmation?: OrderConfirmationContent
  bcc?: string | string[]
}) {
  const client = getResend()
  const from = process.env.RESEND_FROM_EMAIL

  if (!client || !from) {
    console.log('[email skipped]', { to, subject })
    return { skipped: true }
  }

  const supplierText = supplierInvoice ? `\n\n${renderSupplierInvoiceText(supplierInvoice)}` : ''

  return client.emails.send({
    from,
    to,
    bcc,
    subject,
    replyTo,
    attachments: supplierInvoice
      ? [
          {
            filename: `${supplierInvoice.poNumber}.html`,
            content: Buffer.from(renderSupplierInvoiceDocument(supplierInvoice), 'utf8'),
          },
        ]
      : undefined,
    text:
      confirmation && orderSummary
        ? renderOrderConfirmationText(orderSummary, confirmation)
        : `${renderTextEmail(body, orderSummary)}${cta ? `\n\n${cta.label}: ${cta.url}` : ''}${supplierText}`,
    html: confirmation && orderSummary
      ? renderOrderConfirmationEmail({ preview: preview ?? subject, summary: orderSummary, content: confirmation })
      : recoverySummary ? renderRecoveryEmail({
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
      supplierInvoice,
    }),
  })
}

// ---------------------------------------------------------------------------
// Supplier purchase order (English, unbranded, no prices)
// ---------------------------------------------------------------------------

const SUPPLIER_INSTRUCTIONS = [
  'Build to the specifications above. Please confirm PD and working distance with us on WeChat before production.',
  'Do not include any price, invoice or receipt in the package.',
  'Send us the tracking number on WeChat as soon as it ships.',
  'Please communicate all questions and updates about this order with us on WeChat.',
]

const PO_STYLE = {
  ink: '#0b1f17',
  accent: '#0b6b53',
  muted: '#5d6d65',
  line: '#cfdad4',
  head: '#f1f6f3',
  note: '#f7faf8',
}

const isPrescriptionItem = (item: SupplierInvoice['items'][number]) => /prescription|\brx\b/i.test(item.model)

/** Prescription lenses are an add-on, so the supplier sees "Yes" rather than a count. */
function quantityRow(item: SupplierInvoice['items'][number]): [string, string] {
  return isPrescriptionItem(item) ? ['Prescription lenses', 'Yes'] : ['Quantity', String(item.quantity)]
}

function poHeading(label: string) {
  return `<div style="margin:18px 0 6px;color:${PO_STYLE.accent};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">${escapeHtml(label)}</div>`
}

function poRow(label: string, value: string) {
  return `<tr>
    <th align="left" valign="top" style="width:42%;padding:7px 9px;border:1px solid ${PO_STYLE.line};background:${PO_STYLE.head};color:${PO_STYLE.ink};font-size:12px;font-weight:700;">${escapeHtml(label)}</th>
    <td valign="top" style="padding:7px 9px;border:1px solid ${PO_STYLE.line};color:${PO_STYLE.ink};font-size:13px;font-weight:700;">${escapeHtml(value).replaceAll('\n', '<br />')}</td>
  </tr>`
}

function poTable(rows: string) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">${rows}</table>`
}

/** Inner purchase-order markup, shared by the email section and the attachment. */
function renderSupplierInvoiceInner(po: SupplierInvoice) {
  const items = po.items
    .map((item, index) => {
      const rows = [
        poRow('Model', item.model),
        ...item.specs.map((spec) => poRow(spec.label, spec.value)),
        poRow(...quantityRow(item)),
      ].join('')
      return `${poHeading(`Item ${index + 1}`)}${poTable(rows)}`
    })
    .join('')

  const hasPrescription = po.items.some(isPrescriptionItem)
  const measurements = po.needsMeasurements
    ? `${poHeading('Fit measurements')}${poTable(
        poRow(
          hasPrescription ? 'PD, working distance and prescription' : 'PD and working distance',
          'To follow on WeChat'
        )
      )}`
    : ''

  const shipTo = poTable(
    [
      po.recipientName ? poRow('Recipient', po.recipientName) : '',
      po.recipientPhone ? poRow('Phone', po.recipientPhone) : '',
      po.shippingAddress ? poRow('Address', po.shippingAddress) : '',
    ].join('')
  )

  const instructions = SUPPLIER_INSTRUCTIONS.map(
    (line, index) => `<div style="margin:0 0 6px;">${index + 1}. ${escapeHtml(line)}</div>`
  ).join('')

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:${PO_STYLE.ink};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-bottom:3px solid ${PO_STYLE.accent};">
      <tr><td style="padding:0 0 10px;">
        <div style="font-size:20px;font-weight:800;color:${PO_STYLE.ink};">Purchase Order</div>
        <div style="margin-top:4px;color:${PO_STYLE.muted};font-size:12px;">PO No. <b style="color:${PO_STYLE.ink};">${escapeHtml(po.poNumber)}</b> &nbsp;·&nbsp; Date: ${escapeHtml(po.date)}</div>
      </td></tr>
    </table>
    ${items}
    ${measurements}
    ${poHeading('Ship to')}${shipTo}
    ${poHeading('Instructions')}
    <div style="padding:10px 12px;border:1px solid ${PO_STYLE.line};background:${PO_STYLE.note};font-size:12px;line-height:1.55;color:${PO_STYLE.ink};">${instructions}</div>
  </div>`
}

/** Standalone, printable purchase order (attached to the internal email). */
export function renderSupplierInvoiceDocument(po: SupplierInvoice) {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Purchase Order ${escapeHtml(po.poNumber)}</title>
  <style>@page{size:A4;margin:12mm}body{margin:0;background:#fff}</style></head>
  <body><div style="max-width:720px;margin:0 auto;padding:24px;">${renderSupplierInvoiceInner(po)}</div></body>
</html>`
}

function renderSupplierInvoiceSection(po: SupplierInvoice) {
  return `
    <tr><td style="padding:34px 28px 0;">
      <div style="color:${BRAND.mint};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;">Supplier invoice · forward as is</div>
      <div style="margin-top:8px;color:${BRAND.muted};font-size:12px;line-height:1.6;">No prices and no HeliosX branding. Screenshot the white panel, or send the attached ${escapeHtml(po.poNumber)}.html (open it and print to PDF).</div>
    </td></tr>
    <tr><td style="padding:14px 28px 0;">
      <div style="background:#ffffff;padding:22px 20px;">${renderSupplierInvoiceInner(po)}</div>
    </td></tr>`
}

function renderSupplierInvoiceText(po: SupplierInvoice) {
  const lines = [
    '------------------------------',
    'SUPPLIER INVOICE (forward as is)',
    `PO No. ${po.poNumber}`,
    `Date: ${po.date}`,
    '',
    ...po.items.flatMap((item, index) => {
      const [label, value] = quantityRow(item)
      return [
        `Item ${index + 1}: ${item.model}`,
        ...item.specs.map((spec) => `  ${spec.label}: ${spec.value}`),
        `  ${label}: ${value}`,
      ]
    }),
    po.needsMeasurements ? '\nFit measurements: To follow on WeChat' : '',
    '',
    'Ship to',
    po.recipientName ? `Recipient: ${po.recipientName}` : '',
    po.recipientPhone ? `Phone: ${po.recipientPhone}` : '',
    po.shippingAddress ? `Address:\n${po.shippingAddress}` : '',
    '',
    'Instructions',
    ...SUPPLIER_INSTRUCTIONS.map((line, index) => `${index + 1}. ${line}`),
  ]
  return lines.filter((line) => line !== '').join('\n')
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
            <div style="color:#78e8bd;font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;">From the HeliosX team</div>
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
          <tr><td style="padding:20px 28px;border-top:1px solid #1b2822;background:#030504;color:#68736d;font-size:10px;line-height:1.7;">Secure Stripe checkout &nbsp;·&nbsp; Measurements reviewed before production &nbsp;·&nbsp; Limited lifetime warranty<br /><a href="${HELIOSX_SITE_URL}" style="color:#8d9992;text-decoration:none;">heliosxvision.com</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/returns" style="color:#8d9992;text-decoration:none;">Returns</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:#8d9992;text-decoration:none;">Warranty</a></td></tr>
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

export function renderHeliosEmail({
  preview,
  eyebrow,
  title,
  body,
  cta,
  secondaryCta,
  orderSummary,
  supplierInvoice,
}: {
  preview: string
  eyebrow: string
  title: string
  body: string
  cta?: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
  orderSummary?: OrderEmailSummary
  supplierInvoice?: SupplierInvoice
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
          ${supplierInvoice ? renderSupplierInvoiceSection(supplierInvoice) : ''}
          <tr><td style="padding:26px 28px 6px;">
            <div style="color:${BRAND.heading};font-size:14px;font-weight:700;">Team HeliosX</div>
            <div style="margin-top:4px;color:${BRAND.muted};font-size:12px;line-height:1.6;">Questions about fit, magnification or your order? Reply directly to this email.</div>
          </td></tr>
          <tr><td style="padding:22px 28px;border-top:1px solid ${BRAND.line};background:#030504;color:#68736d;font-size:10px;line-height:1.7;">Secure Stripe checkout &nbsp;·&nbsp; Measurements reviewed before production &nbsp;·&nbsp; Limited lifetime warranty<br /><a href="${HELIOSX_SITE_URL}" style="color:#8d9992;text-decoration:none;">heliosxvision.com</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/returns" style="color:#8d9992;text-decoration:none;">Returns</a> &nbsp;·&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:#8d9992;text-decoration:none;">Warranty</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

// ---------------------------------------------------------------------------
// Customer order confirmation
// ---------------------------------------------------------------------------

/** What the customer confirmation needs beyond the receipt itself. */
export type OrderConfirmationContent = {
  customerName?: string
  /** False for lights-only orders: nothing is custom-built. */
  needsMeasurements: boolean
  /** Secure per-order measurement page. Without it, the customer replies by email. */
  measurementUrl?: string
}

const EMAIL_LOGO_URL = `${HELIOSX_SITE_URL}/email/heliosx-logo-white.png`
const FONT_STACK = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`

const CONFIRM = {
  page: '#0d1310',
  card: '#060a08',
  panel: '#0c1410',
  line: '#1c2a23',
  rule: '#22322a',
  mint: '#78e8bd',
  heading: '#f3f6f4',
  text: '#c3ccc7',
  muted: '#8c9a93',
  faint: '#6b7972',
}

/** Short, human order reference: the first 8 characters of the order id, uppercased. */
export function shortOrderReference(orderNumber?: string) {
  if (!orderNumber) return ''
  return orderNumber.replace(/^cs_(live|test)_/, '').replaceAll('-', '').slice(0, 8).toUpperCase()
}

const hasPrescriptionItem = (summary?: OrderEmailSummary) =>
  (summary?.items ?? []).some((item) => /prescription|\brx\b/i.test(item.name))

function firstName(name?: string) {
  return (name ?? '').trim().split(/\s+/)[0] ?? ''
}

function formatLongDate(value?: string | null) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

function confirmHeading(text: string) {
  return `<h2 style="margin:0 0 14px;color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:19px;line-height:1.3;font-weight:600;">${escapeHtml(text)}</h2>`
}

function renderProgress(needsMeasurements: boolean) {
  const steps: Array<{ label: string; state: 'done' | 'current' | 'next' }> = needsMeasurements
    ? [
        { label: 'Paid', state: 'done' },
        { label: 'Measurements', state: 'current' },
        { label: 'Built for you', state: 'next' },
        { label: 'Shipped', state: 'next' },
      ]
    : [
        { label: 'Paid', state: 'done' },
        { label: 'Preparing', state: 'current' },
        { label: 'Shipped', state: 'next' },
      ]
  const width = `${Math.floor(100 / steps.length)}%`
  const cells = steps
    .map((step, index) => {
      const bar = step.state === 'done' ? CONFIRM.mint : step.state === 'current' ? '#3f7a63' : CONFIRM.rule
      const color = step.state === 'next' ? CONFIRM.faint : CONFIRM.heading
      const weight = step.state === 'current' ? 700 : 500
      const pad = index === 0 ? '0 3px 0 0' : index === steps.length - 1 ? '0 0 0 3px' : '0 3px'
      return `<td width="${width}" valign="top" style="padding:${pad};">
        <div style="height:4px;line-height:4px;font-size:0;background:${bar};border-radius:2px;">&nbsp;</div>
        <div style="padding-top:9px;color:${color};font-family:${FONT_STACK};font-size:12px;line-height:1.35;font-weight:${weight};">${escapeHtml(step.label)}${
          step.state === 'current' ? `<br /><span style="color:${CONFIRM.mint};font-weight:500;">Now</span>` : ''
        }</div>
      </td>`
    })
    .join('')
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>${cells}</tr></table>`
}

function renderMeasurementStep(content: OrderConfirmationContent, prescription: boolean) {
  const rows = [
    ['Pupillary distance (PD)', 'Use two of the three tools in our guide and take three readings on each.'],
    ['Working distance', 'The distance from your eyes to the surgical field in your usual operating posture.'],
    prescription
      ? ['Prescription', 'A photo or screenshot of your current glasses prescription.']
      : ['Fit notes', 'Optional. Anything about how you work that our team should review.'],
  ]
  const list = rows
    .map(([label, detail], index) => {
      const border = index ? `border-top:1px solid ${CONFIRM.rule};` : ''
      return `<tr>
        <td valign="top" width="26" style="padding:12px 0;${border}color:${CONFIRM.mint};font-family:${FONT_STACK};font-size:14px;line-height:1.4;font-weight:700;">${index + 1}</td>
        <td valign="top" style="padding:12px 0;${border}">
          <div style="color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:14px;line-height:1.4;font-weight:600;">${escapeHtml(label)}</div>
          <div style="margin-top:3px;color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:13px;line-height:1.55;">${escapeHtml(detail)}</div>
        </td>
      </tr>`
    })
    .join('')

  const primary = content.measurementUrl
    ? `<a href="${escapeHtml(content.measurementUrl)}" style="display:block;background:${CONFIRM.mint};color:#06100b;padding:16px 20px;text-align:center;text-decoration:none;font-family:${FONT_STACK};font-size:15px;font-weight:700;border-radius:8px;">Submit your measurements</a>`
    : ''
  const replyLine = content.measurementUrl
    ? 'Prefer email? Reply with screenshots of your results.'
    : 'Reply to this email with screenshots of your results.'

  return `<tr><td style="padding:0 32px 36px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;background:${CONFIRM.panel};border:1px solid ${CONFIRM.line};border-radius:12px;">
      <tr><td style="padding:24px 24px 22px;">
        ${confirmHeading('Your next step: send your fit measurements')}
        <p style="margin:0 0 8px;color:${CONFIRM.text};font-family:${FONT_STACK};font-size:14px;line-height:1.6;">Every pair is built to your measurements. Production starts as soon as we have them.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${list}</table>
        ${primary ? `<div style="margin-top:16px;">${primary}</div>` : ''}
        <p style="margin:14px 0 0;color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:13px;line-height:1.6;text-align:center;"><a href="${PD_GUIDE_URL}" style="color:${CONFIRM.mint};text-decoration:underline;">How to measure your PD</a><br />${escapeHtml(replyLine)}</p>
      </td></tr>
    </table>
  </td></tr>`
}

function renderConfirmationReceipt(summary: OrderEmailSummary) {
  const currency = summary.currency ?? 'usd'
  const items = (summary.items ?? [])
    .map((item) => {
      const details = item.details?.filter(Boolean) ?? []
      const quantity = item.quantity ?? 1
      return `<tr>
        <td valign="top" style="padding:14px 0;border-top:1px solid ${CONFIRM.rule};">
          <div style="color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:15px;line-height:1.4;font-weight:600;">${escapeHtml(item.name)}${
            quantity > 1 ? `<span style="color:${CONFIRM.muted};font-weight:400;"> &times; ${quantity}</span>` : ''
          }</div>
          ${
            details.length
              ? `<div style="margin-top:4px;color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:13px;line-height:1.5;">${details.map(escapeHtml).join(' &nbsp;&middot;&nbsp; ')}</div>`
              : ''
          }
        </td>
        <td valign="top" align="right" style="padding:14px 0 14px 16px;border-top:1px solid ${CONFIRM.rule};color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:15px;font-weight:600;white-space:nowrap;">${escapeHtml(formatMoney(item.amountTotal, currency))}</td>
      </tr>`
    })
    .join('')

  const line = (label: string, value: string, first = false) => `<tr>
    <td style="padding:${first ? '14px' : '4px'} 0 4px;${first ? `border-top:1px solid ${CONFIRM.rule};` : ''}color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:14px;">${escapeHtml(label)}</td>
    <td align="right" style="padding:${first ? '14px' : '4px'} 0 4px;${first ? `border-top:1px solid ${CONFIRM.rule};` : ''}color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:14px;white-space:nowrap;">${escapeHtml(value)}</td>
  </tr>`

  const subtotal = summary.subtotal
  const total = summary.total
  const discount = subtotal != null && total != null && subtotal > total ? subtotal - total : 0
  const lines = [
    discount && subtotal != null ? ['Subtotal', formatMoney(subtotal, currency)] : null,
    discount ? ['Discount', `-${formatMoney(discount, currency)}`] : null,
    ['Shipping', 'Free'],
  ].filter(Boolean) as Array<[string, string]>
  const totals = lines.map(([label, value], index) => line(label, value, index === 0)).join('')
  const totalRow =
    total != null
      ? `<tr>
    <td style="padding:12px 0 0;border-top:1px solid ${CONFIRM.rule};color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:15px;font-weight:700;">Total paid</td>
    <td align="right" style="padding:12px 0 0;border-top:1px solid ${CONFIRM.rule};color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:20px;font-weight:700;white-space:nowrap;">${escapeHtml(formatMoney(total, currency))}</td>
  </tr>`
      : ''

  return `<tr><td style="padding:0 32px;">
    ${confirmHeading('Order summary')}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${items}${totals}<tr><td colspan="2" style="height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>${totalRow}</table>
  </td></tr>`
}

function renderConfirmationAddresses(summary: OrderEmailSummary) {
  const shipping = summary.shippingAddress
  const billing = summary.billingAddress
  const panels: Array<[string, string]> = []
  if (shipping) panels.push(['Shipping to', shipping])
  if (billing && billing !== shipping) panels.push(['Billing address', billing])
  if (!panels.length) return ''
  const cells = panels
    .map(
      ([label, value]) => `<td valign="top" width="${panels.length > 1 ? '50%' : '100%'}">
        <div style="color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:13px;line-height:1.4;">${escapeHtml(label)}</div>
        <div style="margin-top:6px;color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:14px;line-height:1.6;">${escapeHtml(value).replaceAll('\n', '<br />')}</div>
      </td>`
    )
    .join('<td width="20" style="font-size:0;">&nbsp;</td>')
  return `<tr><td style="padding:32px 32px 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>${cells}</tr></table>
  </td></tr>`
}

export function renderOrderConfirmationEmail({
  preview,
  summary,
  content,
}: {
  preview: string
  summary: OrderEmailSummary
  content: OrderConfirmationContent
}) {
  const name = firstName(content.customerName ?? summary.customerName)
  const reference = shortOrderReference(summary.orderNumber)
  const prescription = hasPrescriptionItem(summary)
  const intro = content.needsMeasurements
    ? 'Your payment is in and your loupe configuration is reserved. One step remains before we start building.'
    : 'Your payment is in and your light is being prepared for shipping. Lights are not custom-built, so there is nothing you need to send us. We will email you when it ships.'
  const reassurance = content.needsMeasurements
    ? prescription
      ? 'Your order stays fully refundable until custom production begins.'
      : 'Your order stays fully refundable until custom production begins. Non-prescription pairs can also be returned within 30 days of delivery.'
    : 'Questions about mounting the light on your frame or choosing a battery? Reply to this email and our team will help.'

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Your HeliosX order is confirmed</title>
  </head>
  <body style="margin:0;padding:0;background:${CONFIRM.page};font-family:${FONT_STACK};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${CONFIRM.page};border-collapse:collapse;">
      <tr><td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:${CONFIRM.card};border:1px solid ${CONFIRM.line};border-radius:16px;border-collapse:separate;">
          <tr><td style="padding:28px 32px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>
              <td valign="middle"><a href="${HELIOSX_SITE_URL}" style="text-decoration:none;"><img src="${EMAIL_LOGO_URL}" width="118" height="45" alt="HeliosX" style="display:block;border:0;width:118px;height:45px;" /></a></td>
              ${
                reference
                  ? `<td valign="middle" align="right" style="color:${CONFIRM.muted};font-family:${FONT_STACK};font-size:13px;line-height:1.5;">Order <span style="color:${CONFIRM.heading};font-weight:600;">#${escapeHtml(reference)}</span><br />${escapeHtml(formatLongDate(summary.paidAt))}</td>`
                  : ''
              }
            </tr></table>
          </td></tr>

          <tr><td style="padding:40px 32px 36px;">
            <h1 style="margin:0 0 12px;color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:30px;line-height:1.2;font-weight:600;letter-spacing:-.02em;">${escapeHtml(name ? `Thank you, ${name}.` : 'Thank you for your order.')}<br /><span style="color:${CONFIRM.mint};">Your order is confirmed.</span></h1>
            <p style="margin:0 0 28px;color:${CONFIRM.text};font-family:${FONT_STACK};font-size:15px;line-height:1.65;">${escapeHtml(intro)}</p>
            ${renderProgress(content.needsMeasurements)}
          </td></tr>

          ${content.needsMeasurements ? renderMeasurementStep(content, prescription) : ''}
          ${renderConfirmationReceipt(summary)}
          ${renderConfirmationAddresses(summary)}

          <tr><td style="padding:32px 32px 32px;">
            <p style="margin:0 0 14px;color:${CONFIRM.text};font-family:${FONT_STACK};font-size:14px;line-height:1.65;">${escapeHtml(reassurance)}</p>
            <p style="margin:0;color:${CONFIRM.text};font-family:${FONT_STACK};font-size:14px;line-height:1.65;">Questions about fit, magnification or your order? Reply to this email and our team will answer.</p>
            <p style="margin:18px 0 0;color:${CONFIRM.heading};font-family:${FONT_STACK};font-size:14px;font-weight:600;">Team HeliosX</p>
          </td></tr>

          <tr><td style="padding:20px 32px 24px;border-top:1px solid ${CONFIRM.line};color:${CONFIRM.faint};font-family:${FONT_STACK};font-size:12px;line-height:1.7;">
            Surgical precision, finally accessible.<br />
            <a href="${HELIOSX_SITE_URL}" style="color:${CONFIRM.muted};text-decoration:none;">heliosxvision.com</a> &nbsp;&middot;&nbsp; <a href="${HELIOSX_SITE_URL}/returns" style="color:${CONFIRM.muted};text-decoration:none;">Returns</a> &nbsp;&middot;&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:${CONFIRM.muted};text-decoration:none;">Warranty</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

export function renderOrderConfirmationText(summary: OrderEmailSummary, content: OrderConfirmationContent) {
  const currency = summary.currency ?? 'usd'
  const name = firstName(content.customerName ?? summary.customerName)
  const reference = shortOrderReference(summary.orderNumber)
  const prescription = hasPrescriptionItem(summary)
  const lines = [
    name ? `Thank you, ${name}. Your order is confirmed.` : 'Thank you. Your order is confirmed.',
    reference ? `Order #${reference}` : '',
    '',
    ...(content.needsMeasurements
      ? [
          'YOUR NEXT STEP: SEND YOUR FIT MEASUREMENTS',
          '1. Pupillary distance (PD): use two of the three tools in our guide, three readings on each.',
          '2. Working distance: from your eyes to the surgical field in your usual operating posture.',
          prescription
            ? '3. Prescription: a photo or screenshot of your current glasses prescription.'
            : '3. Fit notes (optional): anything our team should review.',
          content.measurementUrl ? `Submit your measurements: ${content.measurementUrl}` : '',
          `How to measure your PD: ${PD_GUIDE_URL}`,
          'Or reply to this email with screenshots of your results.',
          '',
        ]
      : ['Your light is being prepared for shipping. Nothing else is needed from you.', '']),
    'ORDER SUMMARY',
    ...(summary.items ?? []).map((item) => {
      const details = item.details?.length ? ` (${item.details.join(', ')})` : ''
      const qty = (item.quantity ?? 1) > 1 ? ` x ${item.quantity}` : ''
      return `- ${item.name}${details}${qty}: ${formatMoney(item.amountTotal, currency)}`
    }),
    summary.total != null ? `Total paid: ${formatMoney(summary.total, currency)}` : '',
    '',
    summary.shippingAddress ? `Shipping to:\n${summary.shippingAddress}` : '',
    !summary.shippingAddress && summary.billingAddress ? `Billing address:\n${summary.billingAddress}` : '',
    '',
    'Questions? Reply to this email.',
    'Team HeliosX',
  ]
  return lines
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n')
    .trim()
}
