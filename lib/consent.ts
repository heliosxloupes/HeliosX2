// Tracking consent rules, shared by the privacy banner and checkout.
//
// US visitors: Google Analytics and Meta Pixel run by default (opt-out model).
// They can turn tracking off from "Privacy choices" in the footer, and a
// browser Global Privacy Control signal turns it off automatically.
//
// Everyone else, and anyone whose country is unknown: nothing runs until the
// visitor accepts the banner (opt-in model).
//
// The country comes from the hx_geo cookie, which middleware.ts sets from
// Vercel's x-vercel-ip-country header. An explicit choice saved from the
// banner always wins over the defaults.

export const CONSENT_KEY = 'heliosx_analytics_consent'
export const GEO_COOKIE = 'hx_geo'

const OPT_OUT_COUNTRIES = new Set(['US'])

export type ConsentChoice = 'granted' | 'denied'
export type EffectiveConsent = ConsentChoice | 'unset'

export function readStoredConsent(): ConsentChoice | null {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY)
    return saved === 'granted' || saved === 'denied' ? saved : null
  } catch {
    return null
  }
}

export function visitorCountry(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${GEO_COOKIE}=([A-Za-z]{2})(?:;|$)`))
  return match ? match[1].toUpperCase() : null
}

export function isOptOutRegion(): boolean {
  const country = visitorCountry()
  return country !== null && OPT_OUT_COUNTRIES.has(country)
}

export function hasGlobalPrivacyControl(): boolean {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
}

export function getEffectiveConsent(): EffectiveConsent {
  const stored = readStoredConsent()
  if (stored) return stored
  if (hasGlobalPrivacyControl()) return 'denied'
  return isOptOutRegion() ? 'granted' : 'unset'
}
