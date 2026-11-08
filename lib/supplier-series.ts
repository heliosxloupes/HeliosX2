/**
 * Internal supplier series numbers. SERVER ONLY: these must never appear on
 * the website. Import this file only from server code (API routes, order
 * emails), never from a component or page.
 *
 * Matching is by product name. Longer names come first so "Canopus XL" wins
 * over "Canopus".
 */
const SUPPLIER_SERIES: Array<[name: string, series: string]> = [
  // Loupes (Apollo has no series yet)
  ['Medusa', 'AENM series'],
  ['Galileo', '21NM series'],
  ['Kepler', 'GNHM series'],
  ['Newton', 'Sport Frame'],

  // Lights
  ['Canopus XL', 'MB JD2000'],
  ['Canopus', 'MA JD2000'],
  ['Arcturus', 'MA JD2900'],
  ['Antares', 'JD2600'],

  // Loupe-mounted lights
  ['Nova', 'MH JD2100 (New Wireless Type)'],
  ['Polaris', 'MB JD2100'],
  ['Vega', 'MC JD2100'],
  ['Rigel', 'MD JD2100'],
  ['Sirius', 'ME JD2100'],
]

export function getSupplierSeries(productName: string) {
  const name = productName.toLowerCase()
  const match = SUPPLIER_SERIES.find(([product]) =>
    new RegExp(`\\b${product.toLowerCase().replace(/\s+/g, '\\s+')}\\b`).test(name)
  )
  return match?.[1] ?? ''
}
