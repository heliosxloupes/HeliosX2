const DEFAULT_SITE_URL = 'https://heliosxvision.com'

/** Clean and validate the site origin before using it in Stripe or email links. */
export function getSiteUrl(fallback = DEFAULT_SITE_URL) {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || fallback
  const cleaned = raw.replace(/\\r\\n|\\r|\\n/g, '').trim().replace(/\/+$/, '')
  try {
    const url = new URL(cleaned)
    if (!['http:', 'https:'].includes(url.protocol)) return fallback
    return cleaned
  } catch {
    return fallback
  }
}
