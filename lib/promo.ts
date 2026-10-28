/**
 * Seasonal promotion label. It changes no prices: it marks the current
 * catalogue prices as the promotional ones. Prices go up on 1 Dec 2026, so the
 * label must disappear at that moment. Keep `endsAt` in step with that rise.
 */
export const PROMO = {
  name: 'Early-Bird Black Friday',
  /** First moment the label is gone: midnight starting 1 Dec 2026, US Eastern. */
  endsAt: '2026-12-01T00:00:00-05:00',
  /** Last day of pricing, as shown to customers. */
  lastDay: 'Nov 30',
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
