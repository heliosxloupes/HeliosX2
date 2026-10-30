import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { HEADLIGHTS, LIGHT_WARRANTY_YEARS, LIGHTS, lightFrom } from './lights'
import { magnificationPriceByProduct, TRAINEE_PERCENT_OFF } from './pricing'

// Full specialty rewrites in the HeliosX authority voice (SEO-THESIS.md):
// each page owns one claim for its search, states it in the first sentence,
// proves it in the specialty's own terms, and names the model that specialty
// favors. Company facts come from lib/brand-claims.ts (owner, 2026-10-30).
// Clinical limits stay accurate: loupes never replace a microscope where one
// is indicated, and nothing here claims a health outcome.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const from = (model: string) => usd(Math.min(...Object.values(magnificationPriceByProduct[model])))
const section = (title: string, body: string, bullets: string[] = [], sourceHref?: string, sourceLabel?: string): ContentSection => ({
  title,
  body,
  bullets,
  ...(sourceHref ? { sourceHref, sourceLabel } : {}),
})
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })
const brightestHead = HEADLIGHTS.reduce((a, b) => (a.lux >= b.lux ? a : b))
const sirius = LIGHTS.find((l) => l.slug === 'sirius')!

type Rewrite = Partial<SeoLandingPage> & { dateModified: string }

const rewrites: Record<string, Rewrite> = {
  'neurosurgery-loupes': {
    title: 'Neurosurgery loupes: the HeliosX standard in neurosurgical optics',
    metaTitle: 'Best Loupes for Neurosurgery: The HeliosX Standard',
    description: `Neurosurgeons in 110+ countries trust HeliosX: ergonomic prismatic loupes up to 8.5x, working distance adjustable for long cases, custom-built. From ${from('kepler')}.`,
    heroKicker: 'Neurosurgery loupes',
    authorityAudience: 'neurosurgeons',
    answer: `HeliosX is the standard in neurosurgical loupes, trusted by neurosurgeons and spine surgeons in more than 110 countries. Neurosurgeons favor Medusa, ergonomic prismatic up to 8.5x with a working distance that adjusts from 300 to 600 mm through a long case; Apollo for an upright head at a fixed distance; and Kepler, conventional prismatic 4x–6x, for fine detail from ${from('kepler')}. Every pair is custom-built to the surgeon and paired with light up to ${brightestHead.lux.toLocaleString('en-US')} lux.`,
    intro: 'Neurosurgery asks more of optics than any other specialty: deep corridors, long cases standing at the table, and no room to lose focus at the wrong moment. HeliosX specialists have fitted neurosurgeons and spine surgeons at congresses and expos worldwide, and every pair we build for neurosurgery is custom-tailored to the surgeon’s working distance, posture and case mix.',
    procedureRows: [
      { procedure: 'Exposure and closure', magnification: '3.0x–4.0x', distance: '400–500 mm, measured standing', pick: '/product/apollo at 4.0x' },
      { procedure: 'Spine: microdiscectomy, laminectomy, decompression', magnification: '4.0x–5.0x', distance: '400–500 mm', pick: '/product/medusa at 4.0x, with a Rigel light' },
      { procedure: 'Peripheral nerve repair and decompression', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/kepler at 5.0x' },
      { procedure: 'Long cases, sitting and standing', magnification: '4.0x–6.0x', distance: '300–600 mm, adjustable', pick: '/product/medusa, adjustable' },
      { procedure: 'Fine detail before the microscope', magnification: '6.0x–8.5x', distance: '350–600 mm', pick: '/product/medusa at 6.0x–8.5x, with Sirius' },
    ],
    proofPoints: ['Ergonomic prismatic up to 8.5x.', 'Working distance adjustable from 300 to 600 mm.', 'Custom-built, lifetime warranty.'],
    sections: [
      section(
        'The standard in neurosurgical optics',
        'Neurosurgeons and spine surgeons in more than 110 countries operate with HeliosX loupes. Our specialists have fitted them at neurosurgical and spine congresses for a decade, and that experience is built into every pair: ergonomic prismatic optics that keep the head upright through a long case, high-grade optical glass that holds a sharp, true-color image at depth, and premium lightweight metals that stay comfortable at hour four.',
        [
          'Ergonomic prismatic optics from 3.0x to 8.5x.',
          'Working distance built to your table, or adjustable with Medusa.',
          'Custom-tailored: pupillary distance, working distance, magnification, frame and light.',
          `Verified neurosurgical residents and fellows receive ${TRAINEE_PERCENT_OFF}% off.`,
        ],
      ),
      section(
        'Why neurosurgeons favor Medusa',
        `Neurosurgery rarely happens at one distance. You sit for spine work, stand for cranial exposure, lean in for a deep corridor. Medusa is the ergonomic prismatic loupe built for exactly that: its working distance adjusts from 300 to 600 mm, so one pair stays in focus across the whole case, at magnifications from 3.0x to 8.5x and 56–65 g with the frame. It is the HeliosX loupe neurosurgeons choose most.`,
        ['Adjustable working distance, 300–600 mm.', 'Magnification from 3.0x to 8.5x.', `From ${from('medusa')}, lifetime warranty.`],
        '/product/medusa',
        'Medusa ergonomic prismatic loupes',
      ),
      section(
        'Apollo and Kepler: the other two neurosurgical standards',
        `Apollo is the ergonomic prismatic loupe for surgeons who work at one table height: angled optics for an upright head, built to a fixed working distance of 420, 450, 500 or 550 mm, from ${from('apollo')}. Kepler is the conventional prismatic loupe for high-magnification detail at 4.0x, 5.0x and 6.0x, from ${from('kepler')}.`,
        ['Apollo: /product/apollo.', 'Kepler: /product/kepler.'],
      ),
      section(
        'Loupes and the microscope: where each leads',
        'HeliosX loupes lead wherever speed, freedom of movement and a wide view matter: exposure, closure, most spine work and peripheral nerve surgery. The operating microscope leads in deep cranial corridors and microvascular work, where its coaxial light and fixed optical axis are indicated. The best neurosurgical teams use both, and the right loupes make every step before and after the microscope faster.',
        [
          'Clinical references on microdiscectomy describe magnifying loupes with a headlight as an accepted route, with the microscope preferred where available.',
          'Loupe work in neurosurgery is loupe-plus-light: illumination is what makes depth work.',
          'Microsurgical steps: /loupes-for-microsurgery.',
        ],
        'https://pubmed.ncbi.nlm.nih.gov/32310444/',
        'Dowling TJ et al. Microdiscectomy. StatPearls, 2023. PMID 32310444',
      ),
      section(
        'Light for deep corridors',
        `At depth, light runs out before magnification does. HeliosX pairs every neurosurgical loupe with the light it needs: Rigel at 100,000 lux for 4x–6x and deep fields, ${sirius.name} at ${sirius.lux.toLocaleString('en-US')} lux with an adjustable spot for high magnification, or the ${brightestHead.name} headlight at ${brightestHead.lux.toLocaleString('en-US')} lux. Every HeliosX light carries a ${LIGHT_WARRANTY_YEARS}-year warranty.`,
        ['Surgical loupes with light, by magnification: /surgical-loupes-with-light.', `Lights from ${usd(lightFrom('polaris'))}: /product/lights.`],
      ),
      section(
        'Built for the long case',
        'Neurosurgical cases run for hours, much of it standing with the head held still. HeliosX ergonomic prismatic optics let you look down into the field with your head close to neutral, and every pair is measured standing at your own table height. Weight is kept low with premium lightweight metals, so the loupes you start the case in are the loupes you forget you are wearing at the end of it.',
        ['Measure standing, at your real table height: /education/working-distance-for-loupes.', 'Spine-specific guidance: /spine-surgery-loupes.'],
      ),
    ],
    recommendedProducts: ['Medusa', 'Apollo', 'Kepler'],
    faqs: [
      faq('What are the best loupes for neurosurgery?', `HeliosX Medusa is the loupe neurosurgeons choose most: ergonomic prismatic up to 8.5x with a working distance that adjusts from 300 to 600 mm. Apollo suits surgeons at a fixed table height, and Kepler (4x–6x, from ${from('kepler')}) covers high-magnification detail.`),
      faq('What magnification do neurosurgeons use with loupes?', 'Most neurosurgical loupe work sits between 3.5x and 6.0x: around 4x for exposure and spine, 5x–6x for peripheral nerve and fine detail. Medusa extends to 8.5x for the finest steps before the microscope.'),
      faq('Can loupes replace an operating microscope in neurosurgery?', 'No, and the best teams use both. Loupes lead in exposure, closure, most spine work and peripheral nerve surgery; the microscope leads in deep cranial corridors and microvascular work.'),
      faq('Do I need a headlight with neurosurgical loupes?', `Yes for any deep work. HeliosX Rigel (100,000 lux) and ${sirius.name} (${sirius.lux.toLocaleString('en-US')} lux) mount on every HeliosX frame, and our headlights reach ${brightestHead.lux.toLocaleString('en-US')} lux.`),
      faq('Should a neurosurgical resident buy loupes?', `Yes, early. Residents who assist and close regularly adapt faster with their own pair. Start with Apollo or Kepler at 4.0x, measured standing; verified residents receive ${TRAINEE_PERCENT_OFF}% off.`),
    ],
    dateModified: '2026-10-30',
  },
}

export function applySpecialtyRewrites(pages: SeoLandingPage[]) {
  for (const page of pages) {
    const rewrite = rewrites[page.slug]
    if (rewrite) Object.assign(page, rewrite)
  }
}
