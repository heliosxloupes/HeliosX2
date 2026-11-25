/**
 * Seasonal promotion. It changes no prices and adds no codes: the current
 * catalogue prices ARE the Black Friday prices, and the regular price is
 * `regularMarkupPercent` higher. Display only; checkout still charges
 * lib/pricing.json. Everything (badge, sitewide dock, struck regular prices)
 * removes itself at `endsAt`.
 */
export const PROMO = {
  name: 'Early-Bird Black Friday',
  /** First moment the promotion is gone: midnight starting 1 Dec 2026, US Eastern. */
  endsAt: '2026-12-01T00:00:00-05:00',
  /** Last day of pricing, as shown to customers. */
  lastDay: 'Nov 30',
  /** The regular price is this much above the current (Black Friday) price. */
  regularMarkupPercent: 20,
}

const DAY = 86_400_000

export function promoActive(now = Date.now()) {
  return now < Date.parse(PROMO.endsAt)
}

/** "Ends in 34 days", "Ends tomorrow", "Ends tonight". */
export function promoCountdown(now = Date.now()) {
  const days = Math.ceil((Date.parse(PROMO.endsAt) - now) / DAY)
  if (days <= 1) return 'Ends tonight'
  if (days === 2) return 'Ends tomorrow'
  return `Ends in ${days - 1} days`
}

/**
 * Regular price for a Black Friday price: +20%, rounded to the nearest $5 so it
 * reads like the rest of the catalogue (1695 -> 2035, 810 -> 970).
 */
export function regularPrice(price: number) {
  return Math.round((price * (1 + PROMO.regularMarkupPercent / 100)) / 5) * 5
}

/** Time left, split for the countdown. All zero once the promotion has ended. */
export function promoTimeLeft(now = Date.now()) {
  const ms = Math.max(0, Date.parse(PROMO.endsAt) - now)
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}
