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

async function loadInlineImages(files: readonly string[]) {
  const loaded = await Promise.all(
    files.map(async (file) => {
      try {
        const response = await fetch(`${HELIOSX_SITE_URL}/email/${file}`)
        if (!response.ok) return null
        return {
          filename: file,
          content: Buffer.from(await response.arrayBuffer()),
          contentId: file.replace(/[^a-z0-9]/gi, '-'),
        }
      } catch {
        return null
      }
    })
  )
  return loaded.filter((image): image is NonNullable<typeof image> => image !== null)
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

  // The confirmation embeds its logo and progress bar so they show even when
  // the inbox blocks remote images. If a fetch fails, the hosted URL is used.
  // Only the images this email shows: an unreferenced inline image can surface as a stray attachment.
  const inline = confirmation
    ? await loadInlineImages(
        CONFIRMATION_INLINE_IMAGES.filter((file) =>
          file.startsWith('progress-')
            ? file === (confirmation.needsMeasurements ? 'progress-measurements.gif' : 'progress-lights.gif')
            : true
        )
      )
    : []
  const confirmationContent = confirmation
    ? { ...confirmation, imageSrc: Object.fromEntries(inline.map((image) => [image.filename, `cid:${image.contentId}`])) }
    : undefined
  const attachments = [
    ...(supplierInvoice
      ? [
          {
            filename: `${supplierInvoice.poNumber}.html`,
            content: Buffer.from(renderSupplierInvoiceDocument(supplierInvoice), 'utf8'),
          },
        ]
      : []),
    ...inline,
  ]

  return client.emails.send({
    from,
    to,
    bcc,
    subject,
    replyTo,
    attachments: attachments.length ? attachments : undefined,
    text:
      confirmation && orderSummary
        ? renderOrderConfirmationText(orderSummary, confirmation)
        : `${renderTextEmail(body, orderSummary)}${cta ? `\n\n${cta.label}: ${cta.url}` : ''}${supplierText}`,
    html: confirmation && orderSummary
      ? renderOrderConfirmationEmail({ preview: preview ?? subject, summary: orderSummary, content: confirmationContent ?? confirmation })
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
//
// Light stone layout, matching the customer-reply template. Every background
// is decorative: Gmail and some clients strip them, so all text stays dark on
// light and the button reads as a button even without its fill.
// ---------------------------------------------------------------------------

/** What the customer confirmation needs beyond the receipt itself. */
export type OrderConfirmationContent = {
  /** Image sources keyed by asset file name, e.g. cid: references for inline images. */
  imageSrc?: Record<string, string>
  customerName?: string
  /** False for lights-only orders: nothing is custom-built. */
  needsMeasurements: boolean
  /** Secure per-order measurement page. Without it, the customer replies by email. */
  measurementUrl?: string
}

const FONT_STACK = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`
const EMAIL_ASSET_URL = `${HELIOSX_SITE_URL}/email`

const STONE = {
  page: '#f3efeb',
  card: '#faf8f5',
  band: '#e7e1db',
  panel: '#f3efeb',
  line: '#e1d9d0',
  bandLine: '#d6cdc3',
  ink: '#11161c',
  text: '#383733',
  muted: '#6f675e',
  green: '#0b6b53',
  greenInk: '#084c3b',
  greenWash: '#dcece4',
}

/** Product photography per loupe model, served from /public/email. */
const MODEL_HEADERS: Array<{ model: string; file: string; path: string }> = [
  { model: 'Medusa', file: 'medusa.jpg', path: '/product/medusa' },
  { model: 'Galileo', file: 'galileo.jpg', path: '/product/galileo' },
  { model: 'Newton', file: 'newton.jpg', path: '/product/newton' },
  { model: 'Apollo', file: 'apollo.jpg', path: '/product/apollo' },
]

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

function orderedModel(summary: OrderEmailSummary) {
  for (const item of summary.items ?? []) {
    const match = MODEL_HEADERS.find(({ model }) => new RegExp(`\\b${model}\\b`, 'i').test(item.name))
    if (match) return match
  }
  return undefined
}

function formatLongDate(value?: string | null) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
}

function sectionLabel(text: string) {
  return `<p style="margin:0 0 12px;font-family:${FONT_STACK};font-size:11px;line-height:16px;letter-spacing:2.2px;color:${STONE.muted};text-transform:uppercase;">${escapeHtml(text)}</p>`
}

/** Inline (cid:) source when the sender attached the image, else the hosted URL. */
function assetSrc(content: OrderConfirmationContent, file: string) {
  return content.imageSrc?.[file] ?? `${EMAIL_ASSET_URL}/${file}`
}

/** Images embedded in the confirmation so they show even when a client blocks remote images. */
export const CONFIRMATION_INLINE_IMAGES = ['heliosx-mark.png', 'progress-measurements.gif', 'progress-lights.gif'] as const

function renderProgress(needsMeasurements: boolean, content: OrderConfirmationContent) {
  const steps: Array<{ label: string; state: 'done' | 'current' | 'next' }> = needsMeasurements
    ? [
        { label: 'Paid', state: 'done' },
        { label: 'Measurements', state: 'current' },
        { label: 'We build your loupes', state: 'next' },
        { label: 'Shipping', state: 'next' },
      ]
    : [
        { label: 'Paid', state: 'done' },
        { label: 'Preparing', state: 'current' },
        { label: 'Shipping', state: 'next' },
      ]
  // The bar itself is an animated GIF (Gmail ignores CSS animation but plays GIFs).
  // Labels stay as live text underneath so they read, translate and scale.
  const width = `${Math.floor(100 / steps.length)}%`
  const gif = needsMeasurements ? 'progress-measurements.gif' : 'progress-lights.gif'
  const alt = `Order progress: ${steps.map((s) => s.label).join(', ')}. Current step: ${steps.find((s) => s.state === 'current')?.label}.`
  const cells = steps
    .map((step) => {
      const color = step.state === 'next' ? STONE.muted : STONE.ink
      return `<td width="${width}" valign="top" style="padding:8px 6px 0 0;">
        <div style="font-family:${FONT_STACK};font-size:12px;line-height:1.4;color:${color};font-weight:${step.state === 'current' ? 700 : 400};">${escapeHtml(step.label)}${
          step.state === 'current' ? `<br /><span style="color:${STONE.green};font-weight:600;">You are here</span>` : ''
        }</div>
      </td>`
    })
    .join('')
  return `<img src="${assetSrc(content, gif)}" width="548" alt="${escapeHtml(alt)}" style="display:block;width:100%;max-width:548px;height:auto;border:0;" />
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>${cells}</tr></table>`
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
      const border = index ? `border-top:1px solid ${STONE.line};` : ''
      return `<tr>
        <td valign="top" width="36" style="padding:14px 0;${border}">
          <div style="width:24px;height:24px;line-height:24px;border:1px solid ${STONE.green};border-radius:12px;text-align:center;font-family:${FONT_STACK};font-size:12px;font-weight:700;color:${STONE.green};">${index + 1}</div>
        </td>
        <td valign="top" style="padding:14px 0;${border}">
          <div style="font-family:${FONT_STACK};font-size:15px;line-height:1.4;font-weight:600;color:${STONE.ink};">${escapeHtml(label)}</div>
          <div style="margin-top:3px;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:${STONE.text};">${escapeHtml(detail)}</div>
        </td>
      </tr>`
    })
    .join('')

  const button = content.measurementUrl
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin-top:22px;"><tr>
        <td align="center" bgcolor="#fbfdfc" style="background-color:rgba(255,255,255,.72);border:1px solid ${STONE.green};border-radius:999px;">
          <a href="${escapeHtml(content.measurementUrl)}" style="display:block;padding:15px 24px;text-align:center;font-family:${FONT_STACK};font-size:15px;line-height:20px;font-weight:600;letter-spacing:0.2px;color:${STONE.green};text-decoration:none;">Submit your measurements</a>
        </td>
      </tr></table>`
    : ''
  const replyLine = content.measurementUrl
    ? 'Prefer email? Reply with screenshots of your results.'
    : 'Reply to this email with screenshots of your results.'

  return `<tr><td class="inset" style="padding:8px 36px 32px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="${STONE.panel}" style="border-collapse:separate;background-color:${STONE.panel};background-image:linear-gradient(150deg,#e3f0e9 0%,#f3efeb 55%,#f6efe6 100%);border:1px solid #d9e3dc;border-radius:14px;box-shadow:0 18px 40px -24px rgba(11,107,83,.35);">
      <tr><td style="padding:24px 24px 22px;">
        <h2 style="margin:0 0 6px;font-family:${FONT_STACK};font-size:20px;line-height:1.3;font-weight:600;color:${STONE.ink};">Your next step: send your fit measurements</h2>
        <p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${STONE.text};">Every pair is built to your measurements. Production starts as soon as we have them.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${list}</table>
        ${button}
        <p style="margin:14px 0 0;text-align:center;font-family:${FONT_STACK};font-size:13px;line-height:1.7;color:${STONE.muted};"><a href="${PD_GUIDE_URL}" style="color:${STONE.green};font-weight:600;text-decoration:underline;">How to measure your PD</a><br />${escapeHtml(replyLine)}</p>
      </td></tr>
    </table>
  </td></tr>`
}

function renderConfirmationReceipt(summary: OrderEmailSummary) {
  const currency = summary.currency ?? 'usd'
  const cell = (extra = '') => `font-family:${FONT_STACK};${extra}`
  const items = (summary.items ?? [])
    .map((item, index) => {
      const details = item.details?.filter(Boolean) ?? []
      const quantity = item.quantity ?? 1
      const border = index ? `border-top:1px solid ${STONE.line};` : ''
      return `<tr>
        <td valign="top" style="padding:16px 18px;${border}${cell(`font-size:15px;line-height:1.4;font-weight:600;color:${STONE.ink};`)}">${escapeHtml(item.name)}${
          quantity > 1 ? `<span style="font-weight:400;color:${STONE.muted};"> &times; ${quantity}</span>` : ''
        }${
          details.length
            ? `<div style="margin-top:4px;font-size:13px;line-height:1.5;font-weight:400;color:${STONE.muted};">${details.map(escapeHtml).join(' &nbsp;&middot;&nbsp; ')}</div>`
            : ''
        }</td>
        <td valign="top" align="right" style="padding:16px 18px;${border}white-space:nowrap;${cell(`font-size:15px;font-weight:600;color:${STONE.ink};`)}">${escapeHtml(formatMoney(item.amountTotal, currency))}</td>
      </tr>`
    })
    .join('')

  const subtotal = summary.subtotal
  const total = summary.total
  const discount = subtotal != null && total != null && subtotal > total ? subtotal - total : 0
  const lines: Array<[string, string, string?]> = []
  if (discount && subtotal != null) lines.push(['Subtotal', formatMoney(subtotal, currency)])
  if (discount) lines.push(['Discount', `-${formatMoney(discount, currency)}`, STONE.green])
  lines.push(['Shipping', 'Included', STONE.green])
  lines.push(['Limited lifetime warranty', 'Included', STONE.green])
  const extra = lines
    .map(
      ([label, value, color]) => `<tr>
        <td style="padding:11px 18px;border-top:1px solid ${STONE.line};${cell(`font-size:14px;color:${STONE.muted};`)}">${escapeHtml(label)}</td>
        <td align="right" style="padding:11px 18px;border-top:1px solid ${STONE.line};white-space:nowrap;${cell(`font-size:14px;font-weight:600;color:${color ?? STONE.ink};`)}">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('')
  const totalRow =
    total != null
      ? `<tr>
        <td style="padding:15px 18px;border-top:1px solid ${STONE.bandLine};${cell(`font-size:15px;font-weight:700;color:${STONE.ink};`)}">Total paid</td>
        <td align="right" style="padding:15px 18px;border-top:1px solid ${STONE.bandLine};white-space:nowrap;${cell(`font-size:19px;font-weight:700;color:${STONE.ink};`)}">${escapeHtml(formatMoney(total, currency))}</td>
      </tr>`
      : ''

  return `<tr><td class="inset" style="padding:0 36px;">
    ${sectionLabel('Your order')}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-collapse:collapse;background-color:#ffffff;border:1px solid ${STONE.line};">${items}${extra}${totalRow}</table>
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
        ${sectionLabel(label)}
        <div style="font-family:${FONT_STACK};font-size:14px;line-height:1.65;color:${STONE.ink};">${escapeHtml(value).replaceAll('\n', '<br />')}</div>
      </td>`
    )
    .join('<td width="20" style="font-size:0;">&nbsp;</td>')
  return `<tr><td class="inset" style="padding:28px 36px 0;">
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
  const model = orderedModel(summary)
  const headline = content.needsMeasurements
    ? model
      ? `Your ${model.model} loupes are reserved.`
      : 'Your loupes are reserved.'
    : 'Your light is being prepared.'
  const welcome =
    'Thank you for trusting us with your vision. HeliosX exists to bring elite surgical loupes and instruments to clinicians around the world at a fair price, with no gatekeeping and no sales-chain markup. We will be here for you long after your pair arrives.'
  const intro = content.needsMeasurements
    ? 'Your payment is in and your configuration is held for you. Only one small step remains before we start building your pair.'
    : 'Your payment is in and your light is being prepared for shipping. Lights are not custom-built, so there is nothing you need to send us. We will email you a tracking number as soon as it is on its way.'
  const reassurance = content.needsMeasurements
    ? prescription
      ? 'Your order stays fully refundable until custom production begins.'
      : 'Your order stays fully refundable until custom production begins. Non-prescription pairs can also be returned within 30 days of delivery.'
    : 'Questions about mounting the light on your frame or choosing a battery? Just reply to this email.'


  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Your HeliosX order is confirmed</title>
<style>
@media only screen and (max-width:480px) {
  .outer { padding:0 !important; }
  .inset { padding-left:22px !important; padding-right:22px !important; }
  .headline { font-size:26px !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${STONE.page};color:${STONE.ink};font-family:${FONT_STACK};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${STONE.page}" style="width:100%;border-collapse:collapse;background-color:${STONE.page};">
<tr><td class="outer" align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="620"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${STONE.card}" style="width:100%;max-width:620px;border-collapse:collapse;background-color:${STONE.card};border:1px solid ${STONE.line};">

<tr><td bgcolor="${STONE.band}" style="padding:0;background-color:${STONE.band};background-image:linear-gradient(155deg,#dcebe3 0%,#ebe6df 42%,#f1e6d8 78%,#f4e2cf 100%);border-bottom:1px solid ${STONE.bandLine};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
  <tr><td class="inset" style="padding:28px 36px 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
      <td valign="middle">
        <a href="${HELIOSX_SITE_URL}" style="color:${STONE.ink};text-decoration:none;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
          <td width="34" valign="middle"><img src="${assetSrc(content, 'heliosx-mark.png')}" width="27" height="31" alt="HeliosX logo" style="display:block;border:0;width:27px;height:31px;" /></td>
          <td valign="middle" style="padding-left:10px;font-family:${FONT_STACK};font-size:18px;line-height:22px;font-weight:700;letter-spacing:3px;color:${STONE.ink};">HELIOSX<span style="display:block;font-size:8px;line-height:13px;font-weight:400;letter-spacing:2.6px;">SURGICAL &amp; DENTAL LOUPES</span></td>
        </tr></table></a>
      </td>
      ${
        reference
          ? `<td valign="middle" align="right" style="font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${STONE.muted};">Order <strong style="color:${STONE.ink};">#${escapeHtml(reference)}</strong><br />${escapeHtml(formatLongDate(summary.paidAt))}</td>`
          : ''
      }
    </tr></table>
  </td></tr>
  <tr><td class="inset" style="padding:40px 36px 34px;">
    <h1 class="headline" style="margin:0 0 18px;font-family:${FONT_STACK};font-size:32px;line-height:1.18;font-weight:400;letter-spacing:-0.6px;color:${STONE.ink};">${escapeHtml(name ? `Welcome to the family, ${name}.` : 'Welcome to the HeliosX family.')}<br /><span style="color:${STONE.green};">${escapeHtml(headline)}</span></h1>
    <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:15px;line-height:1.75;color:${STONE.text};">${escapeHtml(welcome)}</p>
    <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.75;color:${STONE.text};">${escapeHtml(intro)}</p>
  </td></tr>
  </table>
</td></tr>
<tr><td class="inset" style="padding:30px 36px 30px;">${renderProgress(content.needsMeasurements, content)}</td></tr>

${content.needsMeasurements ? renderMeasurementStep(content, prescription) : ''}
${renderConfirmationReceipt(summary)}
${renderConfirmationAddresses(summary)}

<tr><td class="inset" style="padding:30px 36px 32px;font-family:${FONT_STACK};font-size:15px;line-height:1.75;color:${STONE.text};">
  <p style="margin:0 0 14px;">${escapeHtml(reassurance)}</p>
  <p style="margin:0 0 22px;">Questions about fit, magnification or your order? Just reply to this email. A real person on our team reads every message.</p>
  <p style="margin:0;">Warm regards,<br /><strong style="font-weight:600;color:${STONE.ink};">The HeliosX Team</strong><br /><a href="${HELIOSX_SITE_URL}" style="color:#514940;text-decoration:underline;">heliosxvision.com</a></p>
</td></tr>

<tr><td class="inset" bgcolor="${STONE.band}" style="padding:19px 36px;background-color:${STONE.band};border-top:1px solid ${STONE.bandLine};">
  <p style="margin:0;font-family:${FONT_STACK};font-size:10px;line-height:18px;letter-spacing:2px;color:#5b5650;">SURGICAL PRECISION, FINALLY ACCESSIBLE.</p>
  <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:11px;line-height:18px;color:${STONE.muted};"><a href="${HELIOSX_SITE_URL}/returns" style="color:#5b5650;text-decoration:underline;">Returns</a> &nbsp;&middot;&nbsp; <a href="${HELIOSX_SITE_URL}/warranty" style="color:#5b5650;text-decoration:underline;">Warranty</a> &nbsp;&middot;&nbsp; <a href="${HELIOSX_SITE_URL}/shipping" style="color:#5b5650;text-decoration:underline;">Shipping</a></p>
</td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
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
    'YOUR ORDER',
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
    'Questions? Just reply to this email.',
    'The HeliosX Team',
  ]
  return lines
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n')
    .trim()
}
