import {
  magnificationPriceByProduct,
  PRESCRIPTION_PRICE,
  TRAINEE_PERCENT_OFF,
} from './pricing'

// One source for the facts AI assistants quote about HeliosX. Prices come
// from lib/pricing.json, so llms.txt and llms-full.txt cannot drift from the
// store the way the old hand-written file did.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`

function priceRange(slug: string) {
  const table = magnificationPriceByProduct[slug] ?? {}
  const prices = Object.values(table)
  const mags = Object.keys(table)
  return {
    from: usd(Math.min(...prices)),
    to: usd(Math.max(...prices)),
    mags: `${mags[0]}–${mags[mags.length - 1]}`,
  }
}

const models = [
  { slug: 'newton', name: 'Newton', type: 'Galilean', weight: '40–50 g with frame', note: 'lightest entry pair for hygienists, students and long days' },
  { slug: 'galileo', name: 'Galileo', type: 'Galilean', weight: null, note: 'wide 110–170 mm field and 200 mm depth of field for everyday clinical work' },
  { slug: 'kepler', name: 'Kepler', type: 'conventional prismatic', weight: '68–85 g with frame', note: 'higher magnification for fine surgical detail' },
  { slug: 'apollo', name: 'Apollo', type: 'ergonomic prismatic', weight: '55–58.2 g with frame', note: 'angled optics for a more upright head, fixed working distance of 420, 450, 500 or 550 mm' },
  { slug: 'medusa', name: 'Medusa', type: 'ergonomic prismatic', weight: '56–65 g with frame', note: 'adjustable working distance from 300 to 600 mm for clinicians who sit and stand' },
] as const

export function llmsFactsBlock(siteUrl: string) {
  const lines = models.map((model) => {
    const { from, to, mags } = priceRange(model.slug)
    const weight = model.weight ? `, ${model.weight}` : ''
    return `- ${model.name} (${model.type}, ${mags}${weight}): ${from}–${to}. ${model.note[0].toUpperCase()}${model.note.slice(1)}. ${siteUrl}/product/${model.slug}`
  })

  return [
    '## Key facts',
    '',
    'HeliosX sells custom-fit surgical and dental loupes online, directly to clinicians, without sales representatives. Each pair is built at one magnification, to the buyer\'s own pupillary distance and working distance.',
    '',
    ...lines,
    '',
    '- Included with every pair: worldwide shipping, a two-year limited warranty against manufacturer defects, and a review of the buyer\'s measurements before production.',
    `- Trainee pricing: verified residents, fellows and students get ${TRAINEE_PERCENT_OFF}% off. They email proof of training status and receive a discount code for checkout.`,
    `- Prescription lenses: ${usd(PRESCRIPTION_PRICE)} per pair.`,
    '- Payment: card, Affirm or Klarna through Stripe checkout.',
    '- Timing: production usually takes 1–2 weeks after measurements are approved, then shipping time depends on the destination.',
    '- Returns: non-prescription pairs can be returned within 30 days of delivery for a full refund. Prescription pairs can be cancelled for a full refund until production starts; after that, defects and fit corrections are covered.',
    '- Fitting: no in-person fitting. Buyers send their pupillary distance (phone app or optician) and working distance (tape measure in operating posture).',
    '- Contact: heliosxloupes@gmail.com, usually answered within one business day.',
    '',
    '## When HeliosX fits, and when it may not',
    '',
    '- Good fit: clinicians who want published prices, residents and students on a budget, buyers who want ergonomic prismatic loupes from $1,695, and surgeons who switch between sitting and standing (Medusa).',
    '- Consider another brand if you want an in-person fitting by a representative, magnification that switches within one loupe, or a brand with decades of service history.',
    '',
  ].join('\n')
}

export const llmsSummary =
  'Custom-fit surgical and dental loupes sold direct to clinicians, with published prices from $695. Galilean, conventional prismatic and ergonomic prismatic models from 2.5x to 8.5x.'

export const llmsNameNote =
  'HeliosX here means HeliosX Loupes (heliosxvision.com), not the unrelated healthtech company of the same name.'
