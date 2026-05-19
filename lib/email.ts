import { Resend } from 'resend'

let resend: Resend | null = null

const HELIOSX_SITE_URL = 'https://heliosxloupes.com'
export const PDCHECK_AR_IOS_URL = 'https://apps.apple.com/us/app/pdcheck-ar/id1563806777'
export const HELIOSX_SUPPORT_EMAIL = 'heliosxloupes@gmail.com'

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
    subject,
    replyTo: HELIOSX_SUPPORT_EMAIL,
    text: body,
    html: renderHeliosEmail({
      preview: preview ?? subject,
      eyebrow,
      title: title ?? subject,
      body,
      cta,
      secondaryCta,
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

function renderHeliosEmail({
  preview,
  eyebrow,
  title,
  body,
  cta,
  secondaryCta,
}: {
  preview: string
  eyebrow: string
  title: string
  body: string
  cta?: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
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
                  <span style="color:#cbd5e1;"> · </span>
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
