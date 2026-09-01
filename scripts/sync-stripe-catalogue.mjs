import { readFileSync } from 'node:fs'

import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY
const shouldArchivePlaceholders = process.argv.includes('--archive-placeholders')
const shouldArchiveOldPrices = process.argv.includes('--archive-old-prices')

if (!stripeKey) {
  console.error('Missing STRIPE_SECRET_KEY.')
  process.exit(1)
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-06-20',
})

const pricing = JSON.parse(
  readFileSync(new URL('../lib/pricing.json', import.meta.url), 'utf8')
)

// Descriptions are catalogue copy; every AMOUNT comes from lib/pricing.json.
// (These tables previously drifted ~58% below the live site's real prices.)
const descriptions = {
  medusa: 'Real-time adjustable working distance surgical loupes.',
  apollo: 'High-magnification ergonomic surgical loupes.',
  galileo: 'General-purpose surgical loupes.',
  newton: 'Lightweight surgical loupes.',
  kepler: 'High-magnification surgical loupes.',
  'prescription-lenses': 'Prescription lens add-on for HeliosX loupes.',
  'extended-warranty': 'Extended warranty add-on for HeliosX loupes.',
}

const products = Object.entries(pricing.products).map(([slug, entry]) => ({
  slug,
  name: entry.name.replace(/ Surgical Loupes$/, ''),
  description: descriptions[slug] ?? entry.name,
  prices: entry.prices,
}))

const addOns = Object.entries(pricing.addOns).map(([slug, entry]) => ({
  slug: slug.replaceAll('-', '_'),
  name: entry.name,
  description: descriptions[slug] ?? entry.name,
  prices: { standard: entry.price },
}))

function lookupKey(slug, variant) {
  return `heliosx_${slug}_${variant.replaceAll('.', '_').toLowerCase()}`
}

async function findProductBySlug(slug, fallbackName) {
  const bySearch = await stripe.products.search({
    query: `metadata['heliosx_slug']:'${slug}'`,
    limit: 1,
  })

  if (bySearch.data[0]) return bySearch.data[0]

  const existing = await stripe.products.list({ active: true, limit: 100 })
  return existing.data.find((product) => product.name.toLowerCase() === fallbackName.toLowerCase())
}

async function upsertProduct(item) {
  const existing = await findProductBySlug(item.slug, item.name)

  if (existing) {
    const updated = await stripe.products.update(existing.id, {
      name: item.name,
      description: item.description,
      metadata: {
        ...existing.metadata,
        heliosx_slug: item.slug,
        heliosx_catalogue: 'true',
      },
    })
    console.log(`product updated: ${updated.name} (${updated.id})`)
    return updated
  }

  const created = await stripe.products.create({
    name: item.name,
    description: item.description,
    metadata: {
      heliosx_slug: item.slug,
      heliosx_catalogue: 'true',
    },
  })
  console.log(`product created: ${created.name} (${created.id})`)
  return created
}

async function upsertPrice(product, slug, variant, usd) {
  const key = lookupKey(slug, variant)
  const amount = Math.round(usd * 100)
  const existing = await stripe.prices.list({
    lookup_keys: [key],
    limit: 10,
    active: true,
  })

  const matching = existing.data.find(
    (price) => price.unit_amount === amount && price.currency === 'usd'
  )

  if (matching) {
    console.log(`price ok: ${key} ${usd} USD (${matching.id})`)
    return matching
  }

  for (const price of existing.data) {
    await stripe.prices.update(price.id, { active: false })
    console.log(`price archived due to amount mismatch: ${key} (${price.id})`)
  }

  const created = await stripe.prices.create({
    product: product.id,
    currency: 'usd',
    unit_amount: amount,
    lookup_key: key,
    nickname: `${product.name} ${variant}`,
    metadata: {
      heliosx_slug: slug,
      heliosx_variant: variant,
      heliosx_catalogue: 'true',
    },
  })
  console.log(`price created: ${key} ${usd} USD (${created.id})`)
  return created
}

async function archiveOldProductPrices(product, item, keptPriceIds) {
  const expected = new Set(
    Object.entries(item.prices).map(([variant, usd]) => `${lookupKey(item.slug, variant)}:${Math.round(usd * 100)}`)
  )
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 })

  for (const price of prices.data) {
    const key = `${price.lookup_key ?? ''}:${price.unit_amount ?? 0}`
    if (keptPriceIds.has(price.id) || expected.has(key)) continue

    await stripe.prices.update(price.id, { active: false })
    console.log(`old price archived: ${product.name} ${price.unit_amount / 100} ${price.currency.toUpperCase()} (${price.id})`)
  }
}

async function archivePlaceholderPrices() {
  const allProducts = await stripe.products.list({ active: true, limit: 100 })
  const placeholderName = /^(medusa|apollo|galileo|newton|kepler)\s*\d/i

  for (const product of allProducts.data) {
    const isPlaceholderProduct =
      placeholderName.test(product.name) ||
      (product.metadata?.heliosx_catalogue !== 'true' &&
        /^(medusa|apollo|galileo|newton|kepler)$/i.test(product.name) === false &&
        /(medusa|apollo|galileo|newton|kepler)/i.test(product.name))

    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 })
    const zeroPrices = prices.data.filter((price) => price.unit_amount === 0)

    if (!isPlaceholderProduct && !zeroPrices.length) continue

    for (const price of zeroPrices) {
      if (product.default_price === price.id) {
        await stripe.products.update(product.id, { default_price: '' })
        console.log(`placeholder default price cleared: ${product.name} (${price.id})`)
      }
      await stripe.prices.update(price.id, { active: false })
      console.log(`placeholder price archived: ${product.name} (${price.id})`)
    }
  }
}

async function main() {
  const account = await stripe.accounts.retrieve()
  const mode = stripeKey.startsWith('sk_test_') ? 'test' : 'live'
  console.log(`Syncing Stripe catalogue for ${account.id} in ${mode} mode.`)

  for (const item of [...products, ...addOns]) {
    const product = await upsertProduct(item)
    const keptPriceIds = new Set()
    for (const [variant, usd] of Object.entries(item.prices)) {
      const price = await upsertPrice(product, item.slug, variant, usd)
      keptPriceIds.add(price.id)
    }

    const defaultVariant = Object.keys(item.prices)[0]
    const defaultPrice = await stripe.prices.list({
      lookup_keys: [lookupKey(item.slug, defaultVariant)],
      active: true,
      limit: 1,
    })
    if (defaultPrice.data[0]) {
      await stripe.products.update(product.id, { default_price: defaultPrice.data[0].id })
      console.log(`default price set: ${product.name} (${defaultPrice.data[0].id})`)
    }

    if (shouldArchiveOldPrices) {
      await archiveOldProductPrices(product, item, keptPriceIds)
    }
  }

  if (shouldArchivePlaceholders) {
    await archivePlaceholderPrices()
  } else {
    console.log('Skipping placeholder archive. Re-run with --archive-placeholders to archive obvious $0 prices.')
  }

  console.log('Stripe catalogue sync complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
