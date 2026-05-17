import { Resend } from 'resend'

let resend: Resend | null = null

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
}: {
  to: string
  subject: string
  body: string
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
    text: body,
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
