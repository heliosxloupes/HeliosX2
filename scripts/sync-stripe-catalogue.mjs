import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY
const shouldArchivePlaceholders = process.argv.includes('--archive-placeholders')

if (!stripeKey) {
  console.error('Missing STRIPE_SECRET_KEY.')
  process.exit(1)
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-06-20',
})

const products = [
  {
    slug: 'medusa',
    name: 'Medusa',
    description: 'Real-time adjustable working distance surgical loupes.',
    prices: {
      '3.0x': 710,
      '4.0x': 765,
      '5.0x': 830,
      '6.0x': 890,
      '8.0x': 980,
      '8.5x': 1090,
    },
  },
  {
    slug: 'apollo',
    name: 'Apollo',
    description: 'High-magnification ergonomic surgical loupes.',
    prices: {
      '3.0x': 740,
      '4.0x': 830,
      '5.0x': 970,
      '6.0x': 1115,
    },
  },
  {
    slug: 'galileo',
    name: 'Galileo',
    description: 'General-purpose surgical loupes.',
    prices: {
      '2.5x': 270,
      '3.0x': 285,
      '3.5x': 300,
    },
  },
  {
    slug: 'newton',
    name: 'Newton',
    description: 'Lightweight surgical loupes.',
    prices: {
      '2.5x': 270,
      '3.0x': 285,
      '3.5x': 300,
    },
  },
  {
    slug: 'kepler',
    name: 'Kepler',
    description: 'High-magnification surgical loupes.',
    prices: {
      '4.0x': 460,
      '5.0x': 490,
      '6.0x': 520,
    },
  },
]

const addOns = [
  {
    slug: 'prescription_lenses',
    name: 'Prescription Lenses',
    description: 'Prescription lens add-on for HeliosX loupes.',
    prices: { standard: 129 },
  },
  {
    slug: 'extended_warranty',
    name: 'Extended Warranty',
    description: 'Extended warranty add-on for HeliosX loupes.',
    prices: { standard: 79 },
  },
]

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
    for (const [variant, usd] of Object.entries(item.prices)) {
      await upsertPrice(product, item.slug, variant, usd)
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
