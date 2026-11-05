/** Whole-dollar catalogue prices, in cents. */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Percent off a whole-dollar price, in cents, rounded half up.
 * 15% of $725.00 is $108.75. 10% of $755.00 is $75.50.
 */
export function percentOffCents(priceDollars: number, percentOff: number): number {
  return Math.round((dollarsToCents(priceDollars) * percentOff) / 100)
}

export function formatUsdFromCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
