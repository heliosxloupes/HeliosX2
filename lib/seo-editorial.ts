import type {
  ContentSection,
  ContentFaq,
  SeoLandingPage,
  EducationGuide,
} from './seo-content'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE } from './pricing'

// Reviewed commercial content. Keep facts separate from brand preference;
// competitor details below were checked against primary sources on 2026-09-10.
const reviewed = '2026-09-20'
const dollars = (value: number) => `$${value.toLocaleString('en-US')}`
const range = (model: string) => {
  const prices = Object.values(magnificationPriceByProduct[model])
  return `${dollars(Math.min(...prices))}–${dollars(Math.max(...prices))}`
}
const section = (
  title: string,
  body: string,
  bullets: string[] = [],
  sourceHref?: string,
  sourceLabel?: string,
): ContentSection => ({
  title,
  body,
  bullets,
  ...(sourceHref ? { sourceHref, sourceLabel } : {}),
})
const faq = (question: string, answer: string): ContentFaq => ({
  question,
  answer,
})
const fit = section(
  'Know what happens after checkout',
  'Your loupes are made to your configuration. After checkout, we collect your measurements and review them before custom production. Ask about your working distance, prescription, or frame before ordering if any of those choices are uncertain.',
  [
    'Measure in the posture you actually use at work: /measurements.',
    'Cancellation is fully refundable before production begins. After production, non-defective orders are not refundable.',
    'Defective-product returns and authorized fit or configuration exchanges are subject to review: /returns.',
  ],
)
const optics = section(
  'Choose the optical design before the brand',
  'Galilean loupes are a practical starting point for lower magnification. Conventional prismatic loupes offer higher magnification. Ergonomic prismatic systems redirect your view so you can look toward the working field with a more upright head position. Those are different features; the word “prismatic” alone does not mean ergonomic.',
  [
    'Newton and Galileo: Galilean, 2.5x–3.5x.',
    'Kepler: conventional prismatic, 4.0x–6.0x.',
    'Apollo: ergonomic prismatic, 3.0x–6.0x. Medusa: ergonomic prismatic, 3.0x–8.5x, with adjustable working distance.',
  ],
  '/education/galilean-vs-prismatic-loupes',
  'How Galilean and prismatic optics differ',
)
const compareFit = section(
  'Compare at your working distance',
  'A magnification label cannot tell you how a loupe will feel in use. Compare field of view, depth of field, frame balance, and the fitted working distance. If you can attend a demonstration, use your normal posture and the same task for every pair.',
  [
    'Check whether you can see the instrument tips and enough surrounding anatomy.',
    'Confirm the quoted weight includes the frame, optics, prescription, and any light you will wear.',
    'Ask what happens if the fit needs a correction, and get the answer in writing.',
  ],
)
const costs = section(
  'Compare the finished order, not a headline price',
  `HeliosX model prices run from ${range('newton')} for Newton to ${range('medusa')} for Medusa. Prescription lenses add ${dollars(PRESCRIPTION_PRICE)}. Compare an equivalent magnification and optical design, then account for lights, shipping, taxes, service, and return terms. A lower price does not establish equal optical performance.`,
  [
    'Request an itemized quote from any brand you are considering.',
    'Use an eligible student or event quote, rather than undiscounted retail, when that is what you would actually pay.',
    'Check light and mount compatibility separately; a loupe price is not a loupe-and-light bundle.',
  ],
  '/how-much-do-surgical-loupes-cost',
  'HeliosX prices and buying costs',
)
const baseFaqs = [
  faq(
    'Can I get help before placing an order?',
    'Yes. Email heliosxloupes@gmail.com with your specialty, current magnification, typical procedures, and budget. Ask us to help narrow the configuration before you pay.',
  ),
  faq(
    'Can I return loupes if I change my mind?',
    'You can cancel for a full refund before custom production begins. Once production begins, non-defective orders are not refundable. Defective-product returns and approved fit or configuration exchanges require authorization. Read /returns before ordering.',
  ),
]

type Brand = {
  name: string
  slug: string
  source: string
  detail: string
  check: string
  price: string
  distinction: string
  products: string[]
  /**
   * Hygiene-specific version of `detail`, used by `hygienistBrandProfiles` on
   * the dental hygiene page. Where a brand publishes its own hygienist landing
   * page, `hygieneSource` points at it instead of the general product page.
   */
  hygieneNote?: string
  hygieneSource?: string
}
const brands: Brand[] = [
  {
    name: 'LumaDent',
    slug: 'lumadent',
    source: 'https://www.lumadent.com/products/ergo-air-ti-ttl-loupes',
    detail:
      'LumaDent publishes Ergo Air Ti prices starting at $1,995 for 3.0x. Its specification table lists variable working distance, so adjustment is not exclusive to HeliosX.',
    check:
      'Compare the actual frame and magnification: LumaDent offers several frame choices and sells headlights separately.',
    price: 'Ergo Air Ti 3.0x: $1,995 published starting price.',
    distinction:
      'Ergo Air Ti has variable working distance; compare frame and magnification options.',
    products: ['Medusa', 'Apollo', 'Newton'],
    hygieneNote:
      'LumaDent sells its headlights separately from its loupes. For hygiene that matters more than it might sound, because the light is what you notice on a long list of recall appointments. Price the loupe and the light together before comparing it with anything else.',
  },
  {
    name: 'Orascoptic',
    slug: 'orascoptic',
    source: 'https://www.orascoptic.com/en-us/students',
    detail:
      'Orascoptic offers student programs and demonstrations. Its student page lists a 45-day trial and benefits with eligibility conditions. Confirm the terms on your specific quote.',
    check:
      'If a trial or local fitting appointment matters to you, include it in the decision. Compare your eligible student package with the complete HeliosX order.',
    price: 'Request an itemized quote; student benefits depend on eligibility.',
    distinction:
      'Student program and demonstration route. Confirm applicable trial and service terms.',
    products: ['Newton', 'Galileo', 'Apollo'],
    hygieneNote:
      'Orascoptic runs a hygienist section of its own and offers in-person demonstrations. If you want to look through a pair before you commit, that route is worth using. Ask which trial and service terms apply to your quote, since eligibility varies.',
    hygieneSource: 'https://www.orascoptic.com/en-us/hygienists',
  },
  {
    name: 'SurgiTel',
    slug: 'surgitel',
    source: 'https://www.surgitel.com/loupes/',
    detail:
      'SurgiTel offers several ergonomic loupe families, including ErgoDeflection, and a demonstration route. Compare a specific SurgiTel model with Apollo or Medusa, rather than treating the whole brand as one optical design.',
    check:
      'Ask about the fitted viewing angle, working-distance options, and the cost of later adjustments. We do not have a verified general US retail price to quote here.',
    price: 'Request a model-specific quote and demonstration.',
    distinction:
      'Several ergonomic families; compare the specified viewing angle and fitting options.',
    products: ['Apollo', 'Medusa', 'Kepler'],
    hygieneNote:
      'SurgiTel publishes a hygiene section and sells several ergonomic families rather than one design. Compare a named model against Apollo or Medusa. Ask what the fitted viewing angle will be and what a later adjustment costs, because those answers differ by model.',
    hygieneSource: 'https://www.surgitel.com/hygiene/',
  },
  {
    name: 'Q-Optics',
    slug: 'q-optics',
    source: 'https://q-optics.com/products/ergoangle',
    detail:
      'Q-Optics describes ErgoAngle as individually customized for the viewing angle, width, loupe height, and working distance. Compare that fitting approach with the configuration available on the HeliosX model you want.',
    check:
      'Get the price and service terms for the exact configuration, including any student eligibility and light bundle.',
    price: 'Confirm a current quote for your configuration and eligibility.',
    distinction: 'ErgoAngle emphasizes individualized ergonomic fitting.',
    products: ['Apollo', 'Medusa', 'Galileo'],
    hygieneNote:
      'Q-Optics builds ErgoAngle around an individually set viewing angle, width, loupe height, and working distance. Hygiene work is done from a narrower set of seated positions than restorative dentistry, so ask how the angle is measured and what happens if your chair position changes.',
  },
  {
    name: 'ExamVision',
    slug: 'examvision',
    source: 'https://examvision.com/loupes-lights/loupes/kepler-advanced/',
    detail:
      'ExamVision Kepler Advanced includes four magnifications in one loupe: 4.0x, 5.0x, 6.0x, and 7.0x. HeliosX models are ordered at one magnification. Medusa adjusts working distance, not magnification.',
    check:
      'If switching magnification during your day is essential, Kepler Advanced offers a feature HeliosX does not currently provide. If one magnification fits your work, compare Kepler, Apollo, and Medusa by optical design and price.',
    price: 'Request a regional quote with fitting and service included.',
    distinction:
      'Kepler Advanced switches between four magnifications in one system.',
    products: ['Kepler', 'Medusa', 'Apollo'],
    hygieneNote:
      'ExamVision Kepler Advanced covers 4.0x to 7.0x in one loupe. That range sits above what most hygiene instrumentation calls for, so it is worth considering only if you also do work that needs high magnification. For hygiene alone you would be paying for range you rarely use.',
  },
  {
    name: 'Admetec',
    slug: 'admetec',
    source: 'https://www.admetec.com/ergo-v-loupes/',
    detail:
      'Admetec Ergo V provides three magnification settings in one ergonomic loupe. That is different from choosing one HeliosX magnification at purchase. Medusa changes working distance while keeping its ordered magnification.',
    check:
      'If variable magnification is a requirement, compare the Ergo V configuration directly. If you mainly need ergonomic viewing at one magnification, shortlist Apollo and Medusa.',
    price: 'Confirm regional pricing and support with the authorized seller.',
    distinction:
      'Ergo V combines ergonomic viewing with three magnification settings.',
    products: ['Medusa', 'Apollo'],
    hygieneNote:
      'Admetec publishes a hygienist buying guide and recommends 3.0x, 4.0x, and 5.0x for hygiene work. Its Ergo V puts three magnification settings in one ergonomic loupe, which is a different proposition from choosing one HeliosX magnification at purchase.',
    hygieneSource: 'https://www.admetec.com/loupes-for-hygienists/',
  },
]

type Revision = Partial<SeoLandingPage>
const revisions: Record<string, Revision> = {}
for (const brand of brands) {
  for (const alternatives of [false, true]) {
    const slug = alternatives
      ? `${brand.slug}-alternatives`
      : `heliosx-vs-${brand.slug}`
    revisions[slug] = {
      title: alternatives
        ? `${brand.name} alternatives: where HeliosX fits`
        : `HeliosX vs ${brand.name}`,
      metaTitle: alternatives
        ? `${brand.name} Alternatives: Features & Price | HeliosX`
        : `HeliosX vs ${brand.name}: Loupes, Fit & Pricing`,
      description: `Compare HeliosX and ${brand.name} by optical design, price, fitting, and purchase terms. See the differences that matter before ordering custom loupes.`,
      intro: alternatives
        ? `Considering an alternative to ${brand.name}? Start with the feature you need to keep: magnification, ergonomic viewing, fitting support, or service. HeliosX offers published prices and custom configurations, but the systems are not interchangeable.`
        : `Choose between HeliosX and ${brand.name} by comparing the specific loupe, the finished price, and what happens after you order. Here are the features to check, including where the other brand may suit you better.`,
      recommendedProducts: brand.products,
      competitorName: brand.name,
      comparisonRows: [
        {
          feature: 'Price',
          heliosx:
            'Newton from $695; ergonomic Apollo and Medusa from $1,695. USD, before options.',
          other: brand.price,
        },
        {
          feature: 'Optics and adjustment',
          heliosx:
            'Galilean, conventional prismatic, and ergonomic prismatic models. One magnification per order; Medusa working distance is adjustable.',
          other: brand.distinction,
        },
        {
          feature: 'Before purchase',
          heliosx:
            'Online configuration and email guidance. Measurements reviewed after checkout, before production.',
          other:
            'Confirm the fitting process, final specification, service terms, and return eligibility with the seller.',
        },
      ],
      verdict: `Shortlist HeliosX if its optical design meets your needs and you value a published price. ${brand.check}`,
      sections: [
        section(
          `What to know about ${brand.name}`,
          brand.detail,
          [],
          brand.source,
          `${brand.name} official product or program information; checked September 10, 2026`,
        ),
        optics,
        costs,
        compareFit,
        fit,
      ],
      faqs: [
        faq(
          `Is HeliosX the same as ${brand.name}?`,
          'No. These are different brands with different products and support arrangements. We have not performed a controlled optical comparison and do not claim identical optics or clinical outcomes.',
        ),
        faq(
          'Does Medusa switch magnification?',
          'No. Medusa has adjustable working distance from 300–600 mm. Choose one magnification at purchase; it does not turn into several magnifications during use.',
        ),
        ...baseFaqs,
      ],
    }
  }
}

const brandProfiles = brands.map((brand) =>
  section(
    brand.name,
    brand.detail,
    [brand.check],
    brand.source,
    `${brand.name} official information`,
  ),
)
// Same six brands, rewritten for hygiene work. Several of them publish their
// own hygienist pages and rank for these terms, so the comparison has to speak
// to hygiene rather than repeat the general dental copy.
const hygienistBrandProfiles = brands
  .filter((brand) => brand.hygieneNote)
  .map((brand) =>
    section(
      brand.name,
      brand.hygieneNote!,
      [brand.check],
      brand.hygieneSource ?? brand.source,
      `${brand.name} official information; checked September 20, 2026`,
    ),
  )
for (const [slug, title, context] of [
  [
    'best-surgical-loupe-brands',
    'Best surgical loupe brands: a practical comparison',
    'For surgical loupes, start with the procedure, the working distance, and the view you need around your instruments.',
  ],
  [
    'best-dental-loupe-brands',
    'Best dental loupe brands: how to choose',
    'For dental loupes, start with your daily appointments, the amount of detail you need, and your seated working posture.',
  ],
]) {
  revisions[slug] = {
    title,
    metaTitle: `${slug.includes('surgical') ? 'Best Surgical' : 'Best Dental'} Loupe Brands: Compare 7 Options`,
    description:
      'Compare HeliosX, LumaDent, Orascoptic, SurgiTel, Q-Optics, ExamVision, and Admetec by fit, features, and buying costs. A brand-authored guide.',
    intro: `${context} There is no single best brand for every clinician. Below, compare seven brands by the features and buying terms that can change your decision.`,
    recommendedProducts: ['Newton', 'Apollo', 'Medusa'],
    comparisonRows: undefined,
    verdict: undefined,
    sections: [
      section(
        'The shortlist in one minute',
        'Choose the feature you need first. This is a comparison of published products and buying routes, not a hands-on ranking of optical quality.',
        [
          'Published entry price: HeliosX Newton from $695.',
          'Ergonomic viewing with published pricing: HeliosX Apollo or Medusa from $1,695; LumaDent Ergo Air Ti from $1,995.',
          'Student program and demonstrations: investigate the eligible Orascoptic offer.',
          'Magnification that switches in one loupe: compare ExamVision Kepler Advanced and Admetec Ergo V.',
        ],
      ),
      section(
        'Where HeliosX fits',
        'HeliosX exists to make premium magnification more accessible. Our lineup separates an affordable Galilean entry point, conventional prismatic detail work, and ergonomic prismatic viewing. You can see the price and configuration before ordering.',
        [
          'Newton starts at $695; Galileo starts at $795.',
          'Kepler starts at $1,195; Apollo and Medusa start at $1,695.',
          'Our custom-production return terms differ from a no-obligation trial. Read them before you buy.',
        ],
      ),
      ...brandProfiles,
      compareFit,
    ],
    faqs: [
      faq(
        'Which loupe brand is best?',
        'The strongest choice is the one that meets your optical, fit, and support requirements at a price you can justify. Compare a model and configuration rather than choosing by brand recognition or a “best overall” badge.',
      ),
      faq(
        'Are expensive loupes always better?',
        'A higher price may include different optics, customization, a demonstration, service benefits, or a trial. Ask what is included. Price alone proves neither better optical quality nor better value.',
      ),
      ...baseFaqs,
    ],
  }
}

// Sep 14 2026, page-two push: Search Console shows this page at 19.6 for
// "best surgical loupes" (405 impressions/28d) and 27.1 for "best surgical
// magnifying glasses" (176), while /best-loupes and the residents guide
// compete for the same searches at 44–66. Make this the page that answers
// those searches outright; the competing pages now link here instead.
{
  const surgical = revisions['best-surgical-loupe-brands']
  surgical.title = 'Best surgical loupes: 7 brands compared'
  surgical.metaTitle = 'Best Surgical Loupes 2026: 7 Brands Compared | HeliosX'
  surgical.description =
    'The best surgical loupes (surgical magnifying glasses) depend on your procedures, magnification, and posture. Compare HeliosX, LumaDent, Orascoptic, SurgiTel, Q-Optics, ExamVision, and Admetec by fit, features, and price.'
  surgical.intro =
    'The best surgical loupes show the detail your procedures need, at your working distance, in a posture you can hold for a full list. Surgical loupes are also called surgical magnifying glasses or surgical telescopes. There is no single best brand for every surgeon, so below you can match a type of loupe to your work, then compare seven brands by the features and buying terms that change the decision.'
  surgical.sections = [
    ...(surgical.sections ?? []).slice(0, 1),
    section(
      'Best surgical loupes by type of work',
      'Start with the work, then shortlist the optical design that suits it. These pairings are starting points, not rules; compare the view at your own working distance before you buy.',
      [
        'Residents and general surgical work: Galilean loupes at 2.5x–3.5x keep a wide field of view. HeliosX Newton from $695 or Galileo from $795.',
        'Fine detail such as vascular, hand, or pediatric work: prismatic loupes at 4.0x–6.0x. HeliosX Kepler from $1,195.',
        'Long cases where head posture matters: ergonomic prismatic designs that redirect your view. HeliosX Apollo (3.0x–6.0x) from $1,695.',
        'Moving between sitting and standing: adjustable working distance. HeliosX Medusa (3.0x–8.5x, 300–600 mm) from $1,695.',
        'Microvascular anastomosis: many services use an operating microscope; loupes do not replace one where it is required.',
      ],
      '/education/how-to-choose-surgical-loupes',
      'Step-by-step guide to choosing surgical loupes',
    ),
    section(
      'Surgical magnifying glasses, loupes, and telescopes',
      'These names describe the same kind of device: magnifying optics mounted on a spectacle frame or headband and focused at your working distance. Two things separate them in practice: the optical design (Galilean or prismatic) and whether the optics are fixed in the lens (through-the-lens) or hinge up (flip-up). Everyday reading magnifiers are not surgical loupes; they are not built for a surgical working distance or for hours of wear.',
      [
        'Galilean: lighter, simpler, and typically 2.5x–3.5x.',
        'Prismatic: allows higher magnification; HeliosX prismatic models run from 3.0x to 8.5x.',
        'Ergonomic prismatic: redirects your line of sight so you can work with a more upright head.',
      ],
      '/education/galilean-vs-prismatic-loupes',
      'Galilean vs prismatic loupes',
    ),
    ...(surgical.sections ?? []).slice(1),
  ]
  surgical.faqs = [
    faq(
      'What are the best surgical magnifying glasses?',
      'Surgical magnifying glasses are surgical loupes. The best pair matches your procedures, working distance, and posture: Galilean 2.5x–3.5x for general work and training, prismatic 4.0x–6.0x for fine detail, and ergonomic prismatic designs for long cases. Compare field of view and fit, not only the magnification number.',
    ),
    faq(
      'What magnification is best for surgery?',
      'Many surgeons start at 2.5x–3.5x for a wide field of view, and move to 4.0x–6.0x for fine structures. The best magnification is the lowest one that shows the detail your procedures need.',
    ),
    ...(surgical.faqs ?? []),
  ]
}

// Sep 20 2026: light queries ("best dental loupe light", "best dental loupes
// with light") split between this page, /best-loupes, and the hygiene page,
// with Google rotating between all three. /dental-loupes-with-light now owns
// them, so point there from the shortlist rather than answering here.
{
  const dental = revisions['best-dental-loupe-brands']
  const shortlist = dental.sections?.[0]
  if (shortlist) {
    shortlist.bullets = [
      ...shortlist.bullets,
      'Buying a light at the same time: compare mounts and runtime on /dental-loupes-with-light.',
    ]
  }
}

revisions['how-much-do-surgical-loupes-cost'] = {
  title: 'How much do surgical loupes cost?',
  metaTitle: 'Surgical Loupe Prices: $695–$2,075 | HeliosX',
  description:
    'See every HeliosX loupe price range, prescription costs, and what to compare in another brand’s quote. Galilean, prismatic, and ergonomic options.',
  intro: `HeliosX surgical loupes cost $695–$2,075 before optional extras, shipping, and taxes. The price depends on optical design and magnification. Here is what each model costs and how to compare a complete order.`,
  recommendedProducts: ['Newton', 'Kepler', 'Medusa'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'HeliosX prices by model',
      'These are current configuration prices in USD, drawn from the same price list used at checkout. The lowest price in each range is the entry magnification.',
      [
        `Newton: ${range('newton')} · Galilean, 2.5x–3.5x.`,
        `Galileo: ${range('galileo')} · Galilean, 2.5x–3.5x.`,
        `Kepler: ${range('kepler')} · conventional prismatic, 4.0x–6.0x.`,
        `Apollo: ${range('apollo')} · ergonomic prismatic, 3.0x–6.0x.`,
        `Medusa: ${range('medusa')} · ergonomic prismatic, 3.0x–8.5x, adjustable working distance.`,
      ],
    ),
    section(
      'What might cost extra?',
      `Prescription lenses add ${dollars(PRESCRIPTION_PRICE)}. Shipping and taxes depend on the order and destination and are shown at checkout. If you need illumination, price the light, battery, and compatible mounting hardware separately.`,
      [
        'Do not assume a loupe-only price includes a headlight.',
        'Check any optional warranty upgrade against the included two-year limited warranty.',
        'Confirm the required magnification before comparing prices.',
      ],
    ),
    section(
      'A real ergonomic price comparison',
      'HeliosX Apollo 3.0x and Medusa 3.0x each start at $1,695. LumaDent lists Ergo Air Ti 3.0x at $1,995. That is a $300 difference in published starting prices, not proof of equivalent optical performance or a comparison of complete bundles.',
      [
        'For Orascoptic, SurgiTel, ExamVision, and Admetec, request a current itemized quote.',
        'Compare any student discount, fit service, or trial period that applies to you.',
      ],
      'https://www.lumadent.com/products/ergo-air-ti-ttl-loupes',
      'LumaDent Ergo Air Ti product page; price checked September 10, 2026',
    ),
    section(
      'When is the upgrade worth paying for?',
      'Move up when it solves a defined problem. Choose higher magnification because you need more visible detail; choose ergonomic prismatic viewing because you want a different viewing posture; choose adjustable working distance because your setup changes.',
      [
        'A first Galilean pair does not have to be a temporary purchase if it suits your work.',
        'Prismatic does not automatically mean ergonomic.',
        'Do not pay for a feature you cannot explain how you will use.',
      ],
    ),
    fit,
  ],
  faqs: [
    faq(
      'What is the cheapest HeliosX loupe?',
      `Newton 2.5x starts at $695. Newton configurations range from ${range('newton')} before optional extras, shipping, and taxes.`,
    ),
    faq(
      'How much do ergonomic loupes cost at HeliosX?',
      `Apollo costs ${range('apollo')} and Medusa costs ${range('medusa')}, depending on magnification. Both start at $1,695.`,
    ),
    ...baseFaqs,
  ],
}

revisions['best-loupes'] = {
  title: 'Best loupes for your work and budget',
  metaTitle: 'Best Loupes: Choose by Optics, Fit & Budget | HeliosX',
  description:
    'Choose Galilean, prismatic, or ergonomic loupes by the work you do. Compare five HeliosX models, prices, and tradeoffs before ordering.',
  intro:
    'The best loupes let you see the detail you need at a comfortable working distance, without paying for features you will not use. Start with the optical design, then narrow your magnification and fit.',
  recommendedProducts: ['Newton', 'Kepler', 'Medusa'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    optics,
    section(
      'Which HeliosX model should you shortlist?',
      'Start with one of these three paths, then compare its closest alternative.',
      [
        'Lowest entry cost: Newton from $695. Compare Galileo from $795 for another lightweight Galilean option.',
        'Conventional prismatic detail: Kepler from $1,195.',
        'Ergonomic viewing: Apollo from $1,695 for fixed working distance, or Medusa from $1,695 for adjustable working distance.',
        'Comparing brands for the operating room: see the best surgical loupes compared: /best-surgical-loupe-brands.',
        'Comparing brands for dentistry: /best-dental-loupe-brands.',
      ],
    ),
    compareFit,
    costs,
    fit,
  ],
  faqs: [
    faq(
      'Should I buy the highest magnification I can afford?',
      'Only if the task needs it. Check that you still have enough field of view and focusing tolerance for your work. Higher magnification is not automatically a better first pair.',
    ),
    ...baseFaqs,
  ],
}
revisions['loupe-comparisons'] = {
  ...revisions['best-loupes'],
  title: 'Compare loupes by design, price, and fit',
  metaTitle: 'Compare Loupes & Brands | HeliosX Buying Guides',
  sections: [
    section(
      'Pick the comparison you need',
      'Start with optical design if you are choosing your first pair. Start with the brand guides if you already have a quote.',
      [
        'Brand shortlist: /best-surgical-loupe-brands and /best-dental-loupe-brands.',
        'Buying for school: /student-loupe-comparison.',
        'Ergonomic designs: /ergonomic-loupe-comparison.',
        'Conventional and ergonomic prisms: /prismatic-loupe-comparison.',
        'Costs and extras: /how-much-do-surgical-loupes-cost.',
      ],
    ),
    optics,
    compareFit,
  ],
}

revisions['student-loupe-comparison'] = {
  title: 'Student loupes compared: what to buy first',
  metaTitle: 'Student Loupes: Compare Brands & Prices | HeliosX',
  description:
    'Compare student loupes across six brands by price, magnification, and what you actually get. Newton starts at $695 with no discount code required.',
  intro:
    'Your first pair of loupes is bought under the worst conditions: limited budget, no experience of what you will prefer, and a deadline set by your program. The good news is that the decision is narrower than the marketing suggests. Confirm what your school requires, pick a magnification you can adapt to, then compare the finished price rather than the advertised one.',
  recommendedProducts: ['Newton', 'Galileo', 'Apollo'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'The shortlist in one minute',
      'Most student buyers land in one of three places. Find yours and skip the rest.',
      [
        'Lowest published entry price: HeliosX Newton from $695 at 2.5x, no code needed.',
        'You want a trial and an in-person fitting: look at the Orascoptic student program and confirm your eligibility.',
        'You will keep this pair into practice: compare ergonomic prismatic viewing from $1,695 before buying twice.',
      ],
    ),
    section(
      'Check with your program before you compare anything',
      'Every year students buy a configuration they cannot use in clinic. Programs vary more than you would expect, and a rule about magnification or an approved supplier will override any price comparison you have done.',
      [
        'Is a specific magnification, frame, light, or supplier required?',
        'When do the loupes need to be in your hands, and when can measurements be taken?',
        'Will your prescription or your clinical posture change before you start using them?',
      ],
    ),
    section(
      'Choose a first pair you can actually adapt to',
      'Higher magnification is the most common first-pair mistake. A narrower field and shorter depth of focus are harder to learn on, and the pair a classmate recommends was chosen for their work and their eyes. Newton and Galileo cover 2.5x to 3.5x as Galilean systems, which is where most students start. Apollo is the ergonomic prismatic option if you already know you want a redirected line of sight.',
      [
        'Newton: ' + range('newton') + '. Galileo: ' + range('galileo') + '.',
        'Leave room in the budget for prescription lenses and a light.',
        'If you can look through a pair before ordering, do it, even if you buy elsewhere.',
      ],
    ),
    section(
      'Compare the finished price, not the discount',
      'Student pricing is where comparison gets difficult, because a percentage off an unpublished retail price tells you nothing. Orascoptic publishes student benefits including a 45-day trial, subject to eligibility and purchase terms. Ask your representative which of those apply to your actual quote. HeliosX publishes its prices instead, so the number you see is the number you pay before options.',
      [
        'Compare your eligible quote against a complete HeliosX order, line by line.',
        'Confirm what a fit correction or a prescription change costs after delivery.',
        'Check whether a quoted price includes the light, the mount, and shipping.',
      ],
      'https://www.orascoptic.com/en-us/students',
      'Orascoptic student program; checked September 10, 2026',
    ),
    ...brandProfiles,
    compareFit,
    fit,
  ],
  faqs: [
    faq(
      'Do I need a student code for the HeliosX entry price?',
      'No. Newton’s $695 starting price is the published price at 2.5x and it applies to everyone. Other magnifications and optional extras change the total.',
    ),
    faq(
      'What magnification should a student buy first?',
      'Most students are best served between 2.5x and 3.5x. Lower magnification gives a wider field and more depth of focus, which makes it easier to learn on. Check whether your program specifies a figure before deciding.',
    ),
    faq(
      'Is it worth buying loupes as a student, or waiting?',
      'If you will use them in clinic this year, buying early builds the habit while your technique is still forming. If your procedural work has not started, waiting until your fitting needs are clear is reasonable.',
    ),
    ...baseFaqs,
  ],
}

revisions['loupes-for-dental-students'] = {
  title: 'Loupes for dental students',
  metaTitle: 'Best Loupes for Dental Students: Prices Compared | HeliosX',
  description:
    'What dental students need from a first pair of loupes: school requirements, magnification for preclinical and clinic work, and published prices from $695.',
  intro:
    'Dental school is where most clinicians form their working posture, which makes the first pair of loupes more consequential than its price suggests. You will use them in preclinical lab work before you use them on a patient, and those two settings ask for slightly different things.',
  recommendedProducts: ['Newton', 'Galileo', 'Apollo'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'Start with your school’s requirements',
      'Dental programs are more prescriptive than medical ones. Some specify magnification, some require a light from the first clinical year, and some run an approved supplier list that limits your choice entirely. Find out before you compare prices.',
      [
        'Is there a required magnification or an approved supplier list?',
        'Is a loupe light required, and from which year?',
        'When is the fitting window, and what is the deadline for clinic?',
      ],
    ),
    section(
      'Preclinical lab and clinic ask for different things',
      'Typodont work on the bench lets you set your own position, so you can tolerate a narrower field. Clinic does not, because the patient is in the chair and the access is whatever it is. A pair chosen purely for lab work can feel restrictive once you start treating. Choosing for the harder of the two settings is usually the safer call.',
      [
        'Most dental students do well between 2.5x and 3.5x for general clinic work.',
        'Consider the working distance you will use seated at a chair, not at a bench.',
        'If you already know you want endodontics, read /loupes-for-endodontics before choosing magnification.',
      ],
    ),
    section(
      'Buy once if you can',
      'A second pair in third year is a common and expensive outcome. It usually happens because the first pair was bought on price alone, or because magnification was chosen before any chairside experience. If the budget allows, an ergonomic prismatic pair you keep into practice costs less over five years than two Galilean pairs.',
      [
        'Newton: ' + range('newton') + '. Galileo: ' + range('galileo') + '.',
        'Apollo starts at $1,695 for ergonomic prismatic viewing.',
        'Prescription lenses are a separate line. Include them before comparing totals.',
        'Compare brand by brand on /best-dental-loupe-brands.',
      ],
    ),
    section(
      'Compare the finished price against any student offer',
      'Orascoptic publishes student benefits including a 45-day trial, subject to eligibility and purchase terms. Confirm what applies to your quote rather than to the advertised program. HeliosX publishes prices for everyone, so there is no code to chase.',
      [
        'Compare an itemized quote against a complete HeliosX order.',
        'Ask what a fit correction costs if your posture changes during the program.',
      ],
      'https://www.orascoptic.com/en-us/students',
      'Orascoptic student program; checked September 10, 2026',
    ),
    section(
      'When in the program to buy',
      'Earlier is usually better, within reason. Loupes change how you position yourself, and the habits you form in preclinical lab work are the ones you carry into clinic. Buying after those habits have set means unlearning them. The argument for waiting is prescription stability and knowing your specialty, which matters more for some students than others.',
      [
        'If your program requires them by a particular term, work backwards from that date and allow for production time.',
        'If your prescription is still changing, tell us at the measurement stage so the order accounts for it.',
        'A pair bought in first year and used daily is better value than a better pair bought in fourth.',
      ],
    ),
    section(
      'Do you need a light as a dental student?',
      'Many programs require one from the first clinical year, and clinic lighting in a teaching environment is rarely ideal. The mount is fitted to the loupe, so this is a decision to make now rather than later. If the budget is tight, a lower magnification with a light usually beats a higher magnification without one.',
      [
        'Check your program requirement before deciding it is optional.',
        'Mounts and runtime are covered on /dental-loupes-with-light.',
      ],
    ),
    compareFit,
    fit,
  ],
  faqs: [
    faq(
      'What are the best loupes for dental students?',
      'The best first pair is one you can use in clinic, at a magnification you can adapt to, from a supplier your program allows. Most dental students are well served between 2.5x and 3.5x. Newton starts at $695 and Galileo at $795.',
    ),
    faq(
      'What magnification do dental students need?',
      'Between 2.5x and 3.5x covers most preclinical and clinical work. Check your program first, because some specify a figure. Higher magnification narrows the field and is harder to learn on.',
    ),
    faq(
      'Do dental students need a loupe light?',
      'Many programs require one from the first clinical year. The light mounts to the loupe, so it is worth deciding before you order rather than adding it later.',
    ),
    ...baseFaqs,
  ],
}

revisions['loupes-for-medical-students'] = {
  title: 'Loupes for medical students',
  metaTitle: 'Loupes for Medical Students: When to Buy | HeliosX',
  description:
    'Whether to buy loupes as a medical student, what magnification suits surgical rotations, and how to choose a pair you keep into residency. From $695.',
  intro:
    'Medical students face a question dental students do not: whether to buy at all yet. Most of medical school involves no magnification, and the rotations that do are short. The answer usually turns on when your procedural work starts and how certain you are about your specialty.',
  recommendedProducts: ['Newton', 'Galileo', 'Kepler'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'Buy now or wait until residency?',
      'If you are heading into a surgical specialty and have procedural rotations ahead, buying as a student gets you through the adaptation period before it costs you anything. If your specialty is undecided, waiting is defensible. Working distance and magnification differ enough between surgical fields that a pair bought speculatively may not suit the work you end up doing.',
      [
        'Buying early makes sense if you have surgical rotations this year or next.',
        'Waiting makes sense if your specialty is open and your procedural exposure is limited.',
        'Either way, check whether your program or rotation site specifies anything.',
      ],
    ),
    section(
      'Magnification for surgical rotations',
      'Surgical work is generally done at a longer working distance than dentistry, because you are standing at a table rather than seated at a chair. That changes the fit more than the magnification figure does. Most students on surgical rotations do well between 2.5x and 3.5x, which keeps enough field to see the instrument and the surrounding anatomy together.',
      [
        'Measure standing, at the table height you actually work at.',
        'A longer working distance means a heavier optical assembly for the same magnification.',
        'Higher magnification is worth it only when the work genuinely demands it.',
      ],
    ),
    section(
      'Choosing a pair you keep into residency',
      'Residency is when loupes get worn for long cases, and that is when fit problems become expensive. A pair bought for a student budget can carry you into your first year, though it is worth knowing what you would upgrade to. Kepler covers the higher-magnification path if you are heading toward microsurgical work.',
      [
        'Newton: ' + range('newton') + '. Galileo: ' + range('galileo') + '.',
        'Kepler starts at $1,195 for conventional prismatic detail work.',
        'More on the residency decision in /education/best-loupes-for-residents.',
      ],
    ),
    section(
      'Loupes do not replace the microscope',
      'This trips up students choosing magnification on ambition rather than need. Services that require an operating microscope require it regardless of what you are wearing, and buying 6.0x loupes will not change that. Loupes cover the open, exposure, and assisting work that fills most of a rotation. Pick for that, and let the specialty decide the rest later.',
      [
        'Microvascular anastomosis is done under a microscope on most services.',
        'Higher magnification narrows the field, which makes assisting harder rather than easier.',
        'If you are heading toward microsurgical work, read /loupes-for-microsurgery before committing.',
      ],
    ),
    section(
      'Budget honestly, including what comes after',
      'A student budget has to cover more than the loupe. Prescription lenses are a separate line, a light is the most common addition, and both are easier to plan for now than to find money for later. There is no code to chase on HeliosX prices, so the published figure is the one to build the budget around.',
      [
        'Prescription lenses add ' + dollars(PRESCRIPTION_PRICE) + ' to the order.',
        'Decide about a light before production, because the mount is fitted to the loupe.',
        'Compare a complete order against any quoted student package, line by line.',
      ],
    ),
    compareFit,
    fit,
  ],
  faqs: [
    faq(
      'Should a medical student buy loupes before residency?',
      'Check with your program first. If you will not use them during your current rotations, waiting until your procedural work and fitting needs are clear is usually the better call. If you have surgical rotations ahead, buying early gets the adaptation done before it matters.',
    ),
    faq(
      'What magnification do medical students need?',
      'Most students on surgical rotations do well between 2.5x and 3.5x. Working distance matters more than the magnification figure, because surgical work is done standing at a table rather than seated.',
    ),
    faq(
      'Are surgical loupes different from dental loupes?',
      'The optics are the same technology, but the fit differs. Surgical loupes are usually built for a longer working distance and a standing posture. A pair fitted for seated dental work may not suit the table.',
    ),
    ...baseFaqs,
  ],
}

revisions['loupes-for-dental-hygiene'] = {
  title: 'Dental hygiene loupes: how to choose your pair',
  metaTitle: 'Dental Hygiene Loupes: Magnification, Light & Price | HeliosX',
  description:
    'Choose dental hygienist loupes by seated posture, field of view, weight, and lighting. Compare six brands, then see Newton, Galileo, and Apollo with published prices.',
  intro:
    'Hygiene is a different buying problem from restorative dentistry. You work from a narrower set of seated positions, you do it for most of the day, and detection matters as much as detail. Choose the magnification that keeps the tooth and the surrounding tissue in view together, then check that you can wear the result through a full column of recalls.',
  recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'The shortlist in one minute',
      'If you want the short version, start here and read the rest only where it applies to you. This compares published products and buying terms. It is not a hands-on ranking of optical quality.',
      [
        'First pair on a budget: Newton from $695 at 2.5x.',
        'A wider starting view with a bit more room: Galileo from $795.',
        'Ergonomic prismatic viewing, for a more upright head position: Apollo from $1,695.',
        'Already know you want a light: read /dental-loupes-with-light before you choose the loupe, because the mount comes with it.',
      ],
    ),
    section(
      'Magnification for hygiene instrumentation',
      'Most hygiene work sits between 2.5x and 4.0x. Lower magnification gives you a wider field, which helps when you are moving along an arch rather than staying on one tooth. Higher magnification narrows the field and shortens your depth of field, so small movements take the target out of focus. Admetec recommends 3.0x to 5.0x for hygienists on its own buying guide, which is a reasonable range to compare against rather than a rule to follow.',
      [
        'Check that you can see the tooth, the margin, and the surrounding tissue at the same time.',
        'Scaling and calculus detection reward field of view more than raw magnification.',
        'If you are new to loupes, 2.5x is easier to adapt to than 3.5x.',
        'Ask your employer or program whether a magnification or supplier is specified before you order.',
      ],
    ),
    section(
      'Posture across a full day of recalls',
      'Hygiene exposes fit problems that a short procedure would hide. You are seated, often leaning, and repeating the same head position for hours. A lighter frame helps you tolerate the pair, though weight alone does not change where you have to look. That is what a declination angle does. Galilean loupes like Newton and Galileo point you down toward the field; ergonomic prismatic systems like Apollo and Medusa redirect the view so your head stays closer to neutral. Which one suits you depends on your chair, your patient positioning, and what you can adapt to.',
      [
        'Weigh the finished pair, including prescription lenses and any light you plan to wear.',
        'Take your measurements seated at your own operatory, in the posture you actually hold.',
        'Loupes are not a treatment for neck pain and cannot guarantee comfortable posture. If you have persistent symptoms, get them assessed properly.',
      ],
      '/education/ergonomic-loupes-neck-pain',
      'What the evidence does and does not show on loupes and neck pain',
    ),
    section(
      'Light matters more in hygiene than most buyers expect',
      'Sub-gingival work, distal surfaces, and anything in the posterior are all limited by what reaches the field, and the overhead unit light rarely gets there once your head is in the way. A loupe-mounted light solves that, and it also adds weight to the frame and a battery pack to your day. Treat it as part of the same purchase rather than something to add later, because the mount is fitted to the loupe.',
      [
        'Price the loupe and the light together when you compare brands. A bundle and a loupe-only price are not the same number.',
        'Check the beam sits centered in your field at your working distance, not just straight ahead.',
        'If you place composite, ask about an orange filter so the light does not start curing before you are ready.',
        'We cover runtime, mounts, and filters in detail on /dental-loupes-with-light.',
      ],
    ),
    section(
      'Where HeliosX fits',
      'HeliosX exists to make premium magnification more accessible, so the prices are published and the configuration is visible before you order. For hygiene the choice is usually between a Galilean pair you can afford immediately and an ergonomic prismatic pair you buy once.',
      [
        'Newton: ' + range('newton') + '. Galileo: ' + range('galileo') + '.',
        'Apollo is the ergonomic prismatic option from $1,695. Medusa adds adjustable working distance.',
        'Prescription lenses are a separate line on the order. Factor them in before comparing totals.',
      ],
    ),
    ...hygienistBrandProfiles,
    compareFit,
    fit,
  ],
  faqs: [
    faq(
      'What magnification do dental hygienists use?',
      'Most hygienists work between 2.5x and 4.0x. Lower magnification gives a wider field, which suits moving along an arch and detecting calculus. Higher magnification narrows the field and the depth of focus. If this is your first pair, 2.5x is the easier place to start.',
    ),
    faq(
      'Which HeliosX model is the lowest-cost hygiene option?',
      'Newton starts at $695 for 2.5x. Galileo starts at $795. Both are Galilean systems. Compare Apollo from $1,695 if you want ergonomic prismatic viewing.',
    ),
    faq(
      'Are dental hygienist glasses the same as loupes?',
      'Usually yes. Hygienists searching for glasses are almost always looking for loupes, which are magnifying telescopes mounted in a frame. Safety eyewear and prescription glasses are separate items, though a prescription can be built into a loupe.',
    ),
    faq(
      'Do I need a light with hygiene loupes?',
      'Not always, but it is the most common upgrade and it is worth deciding early. The overhead unit light is often blocked by your own head during sub-gingival and posterior work. The mount is fitted to the loupe, so adding a light later can mean sending the pair back.',
    ),
    faq(
      'Will ergonomic loupes prevent neck pain?',
      'No product can guarantee that. Ergonomic viewing changes the line of sight, which can help you work with a more upright head position. Fit, seating, patient positioning, and work habits still matter. Persistent symptoms need appropriate clinical assessment.',
    ),
    ...baseFaqs,
  ],
}

revisions['orthopedic-surgery-loupes'] = {
  title: 'Orthopedic surgery loupes: choose for your case mix',
  metaTitle: 'Orthopedic Surgery Loupes: Magnification & Fit | HeliosX',
  description:
    'Compare loupes for open orthopedic work, detail tasks, and changing working positions. See HeliosX optical designs, starting prices, and fitting guidance.',
  intro:
    'For orthopedic work, start with the open procedures where you use magnification and the space you need around your instruments. Your working distance and operating position are more useful selection criteria than a specialty label alone.',
  recommendedProducts: ['Apollo', 'Medusa', 'Galileo'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'Separate open work from screen-based visualization',
      'Loupes and a video display solve different viewing tasks. Think about the cases where you look directly into the field, then define the smallest detail you need to see and the surrounding view you need to retain.',
      [
        'Check field of view during instrument use, not only on a stationary target.',
        'Discuss task-specific magnification with your supervising or operating team.',
        'A loupe is not automatically a substitute for a microscope when the procedure requires one.',
      ],
    ),
    section(
      'Measure with your actual operating setup',
      'Standing height, table height, and your reach all affect working distance. A number measured while sitting at a desk may not describe your operating position.',
      [
        'Apollo suits a fixed configured working distance.',
        'Medusa allows working-distance adjustment from 300–600 mm, at one ordered magnification.',
        'If posture is consistent and you need a lower-magnification view, compare Galileo.',
      ],
    ),
    compareFit,
    fit,
  ],
  faqs: [
    faq(
      'Does Medusa change magnification when I adjust focus?',
      'No. Working-distance adjustment changes where you focus. You choose the magnification at purchase.',
    ),
    ...baseFaqs,
  ],
}

for (const [slug, title] of [
  ['prismatic-loupe-comparison', 'Prismatic loupe comparison'],
  ['ergonomic-loupe-comparison', 'Ergonomic loupe comparison'],
  ['prismatic-loupes', 'Prismatic loupes'],
  ['ergonomic-loupes', 'Ergonomic loupes'],
]) {
  revisions[slug] = {
    title,
    metaTitle: `${title}: Optics, Fit & Price | HeliosX`,
    description:
      'Compare conventional and ergonomic prismatic loupes. See Apollo, Medusa, and Kepler differences, prices, and working-distance options.',
    intro:
      'First decide whether you need conventional prismatic magnification or an ergonomic design that redirects your view. Then compare working distance and magnification. An adjustable working distance is a different feature from adjustable magnification.',
    recommendedProducts: ['Apollo', 'Medusa', 'Kepler'],
    comparisonRows: undefined,
    verdict: undefined,
    sections: [
      optics,
      section(
        'Apollo, Medusa, or Kepler?',
        'Apollo and Medusa are the HeliosX ergonomic prismatic options. Kepler is the conventional prismatic option for 4.0x–6.0x.',
        [
          'Apollo: fixed configured working distance, ' + range('apollo') + '.',
          'Medusa: adjustable 300–600 mm working distance, ' +
            range('medusa') +
            '.',
          'Kepler: conventional prismatic viewing, ' + range('kepler') + '.',
          'All three are ordered at one magnification.',
        ],
      ),
      section(
        'Compare what “adjustable” means',
        'Ask which variable changes and whether you can change it during use. Medusa adjusts working distance. ExamVision Kepler Advanced switches magnification. Neither feature implies that the other is included.',
        [],
        'https://examvision.com/loupes-lights/loupes/kepler-advanced/',
        'ExamVision Kepler Advanced product specification',
      ),
      compareFit,
      fit,
    ],
    faqs: [
      faq(
        'Are all prismatic loupes ergonomic?',
        'No. Conventional prismatic optics and redirected ergonomic prismatic viewing are different designs. At HeliosX, Apollo and Medusa are ergonomic prismatic; Kepler is conventional prismatic.',
      ),
      ...baseFaqs,
    ],
  }
}

revisions['are-surgical-loupes-worth-it'] = {
  title: 'Are surgical loupes worth it?',
  metaTitle: 'Are Surgical Loupes Worth It? Costs & Tradeoffs | HeliosX',
  description:
    'Decide whether loupes solve a real problem in your work. Compare the benefits, limits, fitting needs, and cost before investing in a pair.',
  intro:
    'Loupes can be worth the cost when direct-view magnification is useful in your regular work and the pair fits your working distance. They are a less clear investment when your work rarely needs them, your program has not set requirements, or you have not settled on a configuration.',
  recommendedProducts: ['Newton', 'Apollo', 'Medusa'],
  comparisonRows: undefined,
  verdict: undefined,
  sections: [
    section(
      'What problem would this pair solve?',
      'Name the task before choosing a product. You may want more visible detail, a different viewing posture, or a replacement for a pair that no longer fits. These lead to different purchase decisions.',
      [
        'More detail: evaluate the required magnification and field of view.',
        'Different viewing posture: compare ergonomic prismatic designs.',
        'Poor focus or fit: first check measurements and whether your existing pair can be adjusted.',
      ],
    ),
    section(
      'When waiting makes sense',
      'Do not buy because a sale timer or a classmate makes the decision feel urgent. Wait if the clinical requirement, prescription, or working distance is unresolved.',
      [
        'Check school and workplace requirements.',
        'Try a relevant configuration if a demonstration is available.',
        'Loupes do not guarantee faster procedures, better outcomes, or relief from pain.',
      ],
    ),
    costs,
    fit,
  ],
  faqs: [
    faq(
      'Can a cheaper loupe be enough?',
      'Yes, if its optical design, magnification, and fit meet your actual needs. There is no reason to pay for high magnification or adjustment features you will not use.',
    ),
    ...baseFaqs,
  ],
}
revisions['heliosx-loupes-review'] = {
  ...revisions['best-loupes'],
  title: 'HeliosX loupes: models, prices, and limitations',
  metaTitle: 'HeliosX Loupes: Brand Overview, Prices & Fit',
  intro:
    'Looking for a HeliosX review? This is our own overview of the lineup, prices, and purchase terms. It is not an independent hands-on review. Use it to decide which specifications to investigate and which questions to ask before buying.',
}
for (const [slug, title] of [
  ['affordable-loupes', 'Affordable loupes: spend on what you need'],
  ['cheap-loupes', 'Cheap loupes: what to check before buying'],
  ['surgical-loupes', 'Surgical loupes'],
  ['dental-loupes', 'Dental loupes'],
]) {
  revisions[slug] = {
    ...revisions['best-loupes'],
    title,
    metaTitle: `${title.split(':')[0]} from $695 | HeliosX`,
    intro: slug.includes('cheap')
      ? 'A low price is useful only if the loupes fit and show the detail you need. Compare the optical design, measurements, and support before judging value. HeliosX starts at $695 for Galilean loupes, with conventional and ergonomic prismatic options above that.'
      : 'Choose HeliosX loupes by optical design, magnification, and fit. Newton starts at $695 for Galilean optics; Kepler starts at $1,195 for conventional prismatic optics; Apollo and Medusa start at $1,695 for ergonomic prismatic viewing.',
  }
}

// Sep 20 2026: /dental-loupes inherited its body from /best-loupes, which left
// six pages sharing one set of sections and none of them indexed. Give the
// dental hub its own routing content and let it pass authority downward.
{
  const dentalHub = revisions['dental-loupes']
  dentalHub.metaTitle = 'Dental Loupes: Compare Models & Prices from $695 | HeliosX'
  dentalHub.description =
    'Dental loupes for dentists, hygienists, and students. Compare Galilean and ergonomic prismatic models, magnification, lighting, and published prices from $695.'
  dentalHub.intro =
    'Dentistry is not one job, and loupes that suit a restorative day are not automatically right for a hygiene column or a dental school clinic. Start with the optical design and the magnification, then check the fit against the posture you actually hold.'
  dentalHub.sections = [
    ...(dentalHub.sections ?? []),
    section(
      'Where to go next by role',
      'The right magnification for one kind of dental work is wrong for another. These pages cover the specifics rather than repeating general advice.',
      [
        'Hygiene, where weight and a full day of recalls decide the choice: /loupes-for-dental-hygiene.',
        'Adding a light, which has to be settled before the loupe is made: /dental-loupes-with-light.',
        'Choosing a first pair in dental school: /loupes-for-dental-students.',
        'Canal location and access at higher magnification: /loupes-for-endodontics.',
        'Brand-by-brand comparison with published prices: /best-dental-loupe-brands.',
      ],
    ),
  ]
}

export function applyEditorialRevisions(
  pages: SeoLandingPage[],
  guides: EducationGuide[],
) {
  for (const page of pages) {
    const revision = revisions[page.slug]
    if (revision) Object.assign(page, revision, { dateModified: reviewed })
    else if (page.comparisonRows?.length) {
      // The old specialty tables compared against unnamed "legacy" products
      // with unverifiable prices and specifications. Keep the specialty advice.
      page.comparisonRows = undefined
      page.verdict = undefined
      page.dateModified = reviewed
    }
  }
  // Targeted education revisions are applied after publication metadata.
  const ergonomics = guides.find((g) => g.slug === 'ergonomic-loupes-neck-pain')
  if (ergonomics)
    Object.assign(ergonomics, {
      dateModified: reviewed,
      intro:
        'Ergonomic prismatic loupes redirect the line of sight. Research suggests this can reduce head inclination and neck muscle activity during some tasks, but it does not establish that a particular loupe prevents or treats neck pain.',
      sections: [
        section(
          'What the study actually tested',
          'Fan and colleagues compared traditional and two prismatic loupe designs in 19 surgeons during simulated surgical tasks. The article was published in January 2024 in Frontiers in Public Health. The tested products were not HeliosX loupes.',
          [],
          'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2023.1257365/full',
          'Fan et al. Ergonomics and performance of using prismatic loupes in simulated surgical tasks among surgeons',
        ),
        section(
          'What improved—and what remains uncertain',
          'The prismatic conditions reduced head inclination and neck muscle activity, with no significant difference in surgical errors. Some tasks took longer. These short simulated tasks do not establish long-term pain prevention, benefits for every specialty, or equivalent performance between brands.',
          [
            'The study compared complete loupe conditions, not HeliosX against another brand.',
            'Lower measured workload is not the same outcome as treating a neck disorder.',
            'Adaptation and task demands matter.',
          ],
        ),
        section(
          'Apply the idea to your fitting decision',
          'Compare the viewing direction with your normal stool or table setup. Confirm you can see the task without moving into an awkward position just to find focus.',
          [
            'Check working distance and pupillary-distance alignment.',
            'Include any prescription and headlight in the wearability assessment.',
            'Persistent neck pain or vision symptoms need appropriate clinical assessment.',
          ],
        ),
        section(
          'Where HeliosX fits',
          'Apollo and Medusa are our ergonomic prismatic designs. Apollo uses a configured fixed working distance; Medusa allows working-distance adjustment from 300–600 mm. Neither model comes with a promise to prevent pain.',
          [
            'Compare Apollo: /product/apollo.',
            'Compare Medusa: /product/medusa.',
            'Review the measurement process: /measurements.',
          ],
        ),
      ],
      citations: [
        {
          label:
            'Fan et al. Randomized crossover trial in simulated surgical tasks (published January 2024)',
          href: 'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2023.1257365/full',
        },
      ],
      faqs: [
        faq(
          'Will ergonomic loupes cure my neck pain?',
          'No such result is guaranteed. Ergonomic viewing is one equipment choice; symptoms, fit, positioning, and work habits need separate attention.',
        ),
        faq(
          'Was HeliosX tested in this study?',
          'No. The study tested other loupe designs. It provides context for ergonomic viewing, not product-specific clinical evidence for Apollo or Medusa.',
        ),
        faq(
          'Are lightweight loupes automatically ergonomic?',
          'Low weight and a redirected viewing angle are different features. Compare both, together with fit and working distance.',
        ),
      ],
    })
  const distance = guides.find((g) => g.slug === 'working-distance-for-loupes')
  if (distance)
    Object.assign(distance, {
      dateModified: reviewed,
      intro:
        'Working distance is the distance from your eyes or loupe reference point to the task at which your loupes are configured to focus. Measure in your normal working setup. Do not use height alone or lean forward to match someone else’s number.',
      sections: [
        section(
          'Measure in the position you need to keep',
          'Set up your usual stool or operating position and place a practice target where the patient or working field would be. Have another person help measure while you keep your shoulders relaxed and your head in the intended viewing posture.',
          [
            'Follow the supplier’s reference points and units; different measurement instructions may use different landmarks.',
            'Repeat the measurement to check consistency.',
            'Record seated and standing setups separately if you use both.',
          ],
          '/measurements',
          'HeliosX measurement instructions',
        ),
        section(
          'Working distance is not depth of field',
          'Working distance is the target focus distance. Depth of field is the range around that distance that stays acceptably clear. A generous depth of field does not mean an incorrectly fitted loupe will work at every distance.',
        ),
        section(
          'Fixed or adjustable?',
          'Apollo is configured for a fixed working distance. Medusa adjusts working distance from 300–600 mm. That adjustment can accommodate different setups within its range; it does not change the ordered magnification.',
          [
            'Use your usual position to choose a fixed configuration.',
            'Compare Medusa when you regularly change working positions.',
            'Do not choose a shorter distance just to make a specification look more magnified.',
          ],
        ),
        section(
          'If you keep leaning in to focus',
          'Recheck the working setup and recorded distance before assuming you need higher magnification. If focus, double vision, or fit remains a problem, stop guessing and contact your supplier with the measurements and symptoms.',
          [
            'Check your working height and target position.',
            'Confirm the prescription and pupillary-distance information used for the order.',
            'Discuss unresolved vision symptoms with an appropriate eye-care professional.',
          ],
        ),
      ],
      faqs: [
        faq(
          'Can I calculate working distance from my height?',
          'Height can be a rough starting point, but the actual setup matters. Measure in your working posture and follow the supplier’s instructions.',
        ),
        faq(
          'Does adjustable working distance mean adjustable magnification?',
          'No. Medusa changes working distance while retaining the magnification selected at purchase.',
        ),
        faq(
          'When do I submit HeliosX measurements?',
          'After checkout through the customer measurement process. Measurements and configuration are reviewed before custom production. You can also ask for guidance before ordering.',
        ),
      ],
    })
  const residents = guides.find((g) => g.slug === 'best-loupes-for-residents')
  if (residents)
    Object.assign(residents, {
      dateModified: reviewed,
      intro:
        'For a first resident pair, start with the procedures you actually perform and the magnification your supervising team expects. You need usable detail, enough surrounding view, and a working distance that fits your operating position. The most expensive pair is not automatically the best training choice.',
      sections: [
        section(
          'Ask your program before buying',
          'Requirements differ by service and stage of training. Find out when you will use loupes, whether a particular configuration is required, and whether demonstrations or fitting sessions are available.',
          [
            'What magnification does the team use for the tasks you will perform?',
            'Do you need a light, and how will it mount?',
            'Will you mainly sit, stand, or alternate?',
          ],
        ),
        optics,
        section(
          'A practical HeliosX shortlist',
          'Newton is the lowest-priced Galilean entry at $695. Galileo starts at $795. For ergonomic viewing, compare Apollo and Medusa from $1,695. Kepler offers conventional prismatic 4.0x–6.0x from $1,195.',
          [
            'Buy for your current case mix rather than a hypothetical future specialty.',
            'Higher magnification is useful only when the remaining field of view suits the task.',
            'Ask about fit before ordering a custom pair.',
            'Comparing other brands too? See the best surgical loupes compared: /best-surgical-loupe-brands.',
          ],
        ),
        fit,
      ],
      faqs: [
        faq(
          'Should every resident start at 3.0x?',
          'No single number fits every specialty or training task. Ask your program and evaluate the view at your working distance before selecting magnification.',
        ),
        ...baseFaqs,
      ],
    })
  expandThinGuides(guides)
  expandThinLandingPages(pages)
}

// Sep 14 2026: the compact-template guides rendered under 300 words and
// shared the same generic sections, and several reviewed guides were under
// 500. These add practical, checkable buying guidance. Keep optical and
// clinical statements conservative (see CLAUDE.md, Copywriting).
const expanded = '2026-09-14'

function expandThinGuides(guides: EducationGuide[]) {
  const byslug = (slug: string) => guides.find((g) => g.slug === slug)
  const specialtyTable = (guide: EducationGuide) =>
    guide.sections.filter((s) => s.title === 'Magnification changes by specialty')

  const dentalStudents = byslug('best-loupes-for-dental-students')
  if (dentalStudents)
    Object.assign(dentalStudents, {
      dateModified: expanded,
      metaTitle: 'Best Loupes for Dental Students | Magnification, Fit & Budget',
      description:
        'How dental students can choose a first pair of loupes: program requirements, magnification, working distance, Galilean vs prismatic, prescription, lights, and total cost.',
      intro:
        'A first pair of dental loupes should suit the preclinical and clinical work you are doing now, fit the posture your program teaches, and leave room in a student budget. Start with your program’s requirements, measure your own working distance, and compare the finished order rather than the headline price.',
      sections: [
        section(
          'Check your program’s requirements first',
          'Many dental schools set expectations for when students start using loupes, which magnification is acceptable, and whether a particular light or vendor event is recommended. Ask before you buy so you do not pay twice.',
          [
            'When does your program expect loupes in preclinic and in clinic?',
            'Is a magnification range recommended or required?',
            'Will you need a headlight, and does it have to mount on the frame you choose?',
            'Are there fitting days or group orders through the school?',
          ],
        ),
        section(
          'Choose magnification for the work in front of you',
          'Lower magnification gives a wider field of view and more depth of field, which makes it easier to keep the whole tooth and surrounding area in view while you build skill. Higher magnification shows more detail but narrows the view and makes head movement more noticeable. Buy for your current clinical tasks, not a specialty you might choose years from now.',
          [
            'Newton and Galileo cover 2.5x–3.5x in a lightweight Galilean design.',
            'Apollo (3.0x–6.0x) and Medusa (3.0x–8.5x) are ergonomic prismatic options for students who want a more upright viewing posture.',
            'If you are unsure between two powers, compare the field of view at your working distance, not just the number.',
          ],
          '/education/loupe-magnification-guide',
          'How to choose loupe magnification',
        ),
        section(
          'Measure working distance in your clinic posture',
          'Working distance is the distance from your eyes to the tooth you are treating when you sit the way your program teaches. Taller students do not automatically need a longer distance, and copying a classmate’s number is a common reason loupes feel wrong. Measure seated at the chair with the patient or typodont at your normal height.',
          [
            'Sit upright with relaxed shoulders and your forearms roughly level.',
            'Have someone measure from your eye to the working area, and repeat it.',
            'If you alternate between positions, record each one separately.',
          ],
          '/education/working-distance-for-loupes',
          'How to measure working distance',
        ),
        section(
          'Galilean or prismatic for a first pair?',
          'Galilean loupes are lighter and simpler and are a common starting point at 2.5x–3.5x. Prismatic loupes allow higher magnification. Ergonomic prismatic designs redirect your line of sight so you can look toward the mouth with less forward head tilt. Decide which features matter for your schedule, then compare models.',
          [
            'Long clinic days: compare frame balance and viewing angle, not only weight.',
            `Tight budget: Newton starts at ${range('newton').split('–')[0]}, Galileo at ${range('galileo').split('–')[0]}.`,
            'Planning for endodontics or restorative detail later: an ergonomic prismatic system can grow with you.',
          ],
          '/education/galilean-vs-prismatic-loupes',
          'Galilean vs prismatic loupes',
        ),
        section(
          'Prescription lenses, lights, and the total cost',
          `If you wear glasses for close or intermediate work, prescription lenses can be built into the loupe carrier for ${dollars(PRESCRIPTION_PRICE)} per pair. Lights are sold separately by most brands, so check compatibility before you buy one. HeliosX prices run from ${range('newton')} for Newton to ${range('medusa')} for Medusa, with worldwide shipping included.`,
          [
            'Check student pricing and eligibility: /student-loupes-discount.',
            'Ask for an itemized quote from every brand you compare.',
            'Include taxes, shipping, lights, and warranty terms in the comparison.',
          ],
          '/how-much-do-surgical-loupes-cost',
          'What loupes cost',
        ),
        fit,
      ],
      faqs: [
        faq(
          'What magnification do most dental students start with?',
          'Many students start in the 2.5x–3.5x range because the wider view is easier while building skill, but follow your program’s guidance and compare the view at your own working distance.',
        ),
        faq(
          'Do I need loupes in my first year of dental school?',
          'It depends on your program. Some expect loupes in preclinic, others later. Ask before buying so the configuration matches what you will use.',
        ),
        faq(
          'Can I use loupes if I wear glasses?',
          `Yes. You can order prescription lenses for ${dollars(PRESCRIPTION_PRICE)} per pair and submit your prescription after checkout, or wear contact lenses with standard carrier lenses.`,
        ),
        faq(
          'Is a lighter loupe always better for students?',
          'Weight matters over long clinic days, but so do balance, fit, and viewing angle. A light pair that makes you lean forward is not a comfortable pair.',
        ),
        ...baseFaqs,
      ],
    })

  const prescription = byslug('prescription-loupes-guide')
  if (prescription)
    Object.assign(prescription, {
      dateModified: expanded,
      metaTitle: 'Prescription Loupes Guide | Glasses, Lenses & Ordering',
      description:
        'How prescription lenses work with surgical and dental loupes: who needs them, what information to provide, contact lenses vs prescription carriers, and how HeliosX handles your prescription.',
      intro:
        'If you wear glasses for close or intermediate work, your loupes may need prescription lenses so the magnified view is sharp without wearing glasses underneath. This guide covers who usually needs them, what information to have ready, and how the HeliosX process works after checkout.',
      sections: [
        section(
          'Do you need prescription loupes?',
          'Loupes magnify the image, but they do not correct your vision. If you normally need glasses to see clearly at arm’s length or closer, you will usually want that correction built into the loupe frame. If you only wear glasses for distance, or you wear contact lenses at work, you may not need prescription carriers at all.',
          [
            'Wear glasses for reading or computer work: prescription carriers are worth discussing.',
            'Wear contact lenses in clinic or the OR: standard carriers often work.',
            'Unsure: bring the question to your eye-care professional and tell us your working distance.',
          ],
        ),
        section(
          'What to have ready',
          'A current prescription from a recent eye examination is the starting point. Your working distance and pupillary distance matter as well, because the loupes are aligned for the distance at which you work, not for driving or reading a book.',
          [
            'A current written prescription, including any astigmatism values.',
            'Your working distance, measured in your normal posture: /education/working-distance-for-loupes.',
            'Your pupillary distance (PD): /education/how-to-measure-pupillary-distance.',
          ],
        ),
        section(
          'How prescription lenses fit into the loupes',
          'Most loupes mount the optics on or through a carrier lens in the frame. With a prescription, that carrier lens includes your correction, so you look through your prescription and the loupe optics together. That is why the prescription, PD, and working distance need to be reviewed together before production.',
          [
            'Your everyday glasses prescription may be written for a different distance than your working distance.',
            'Progressive or multifocal prescriptions need extra care; ask before ordering.',
            'Tell us if you have a strong correction so we can review it before you commit.',
          ],
        ),
        section(
          'How HeliosX handles your prescription',
          `Prescription lenses add ${dollars(PRESCRIPTION_PRICE)} per pair. Choose the option at checkout, then submit your prescription with your measurements after ordering. We review the details before custom production and contact you if anything needs clarification.`,
          [
            'Cancellation is fully refundable before production begins.',
            'Production usually takes 1–2 weeks after your measurements are approved.',
            'Standard worldwide shipping is included in the listed price.',
          ],
          '/measurements',
          'HeliosX measurement instructions',
        ),
        section(
          'When your prescription changes',
          'Prescriptions change over time. If your correction changes after you receive your loupes, contact us with the new prescription and your order details so we can discuss the options before you order a replacement pair.',
        ),
      ],
      faqs: [
        faq(
          'Can I wear my glasses under loupes instead?',
          'Some people do, but it usually moves the loupes further from your eyes, which can narrow the view and make fit less comfortable. Prescription carriers or contact lenses are usually better options.',
        ),
        faq(
          'Do I need an eye exam before ordering?',
          'You need a current prescription. If yours is old, or your near vision has changed, an up-to-date exam is the safest starting point.',
        ),
        faq(
          'How much do prescription lenses cost at HeliosX?',
          `${dollars(PRESCRIPTION_PRICE)} per pair, added at checkout.`,
        ),
        faq(
          'When do I send my prescription?',
          'After checkout, together with your measurements. We review everything before production begins.',
        ),
        ...baseFaqs,
      ],
    })

  const howToChoose = byslug('how-to-choose-surgical-loupes')
  if (howToChoose)
    Object.assign(howToChoose, {
      dateModified: expanded,
      metaTitle: 'How to Choose Surgical Loupes | A Step-by-Step Buying Guide',
      description:
        'Choose surgical loupes step by step: procedures, magnification, Galilean vs prismatic, working distance, fit, lights, prescription, total cost, and return terms.',
      intro:
        'The right surgical loupes depend on the work you do, the posture you keep, and the detail you need to see. Work through these decisions in order and you will narrow a confusing market to a short list you can actually compare.',
      sections: [
        section(
          'Step 1: Start with your procedures',
          'List the tasks you do most and how long you wear loupes in a typical day. A general surgery resident closing skin, a hand surgeon repairing tendons, and a dentist doing restorative work need different views. Buy for your current case mix and the next couple of years, not a hypothetical future.',
          [
            'Which tasks do you do most often?',
            'How many hours a day will you wear loupes?',
            'Do you mostly sit, stand, or alternate?',
          ],
        ),
        ...specialtyTable(howToChoose),
        section(
          'Step 2: Choose a magnification range',
          'More magnification shows more detail but gives a narrower field of view and less depth of field, and small head movements become more noticeable. Lower magnification keeps more of the surgical field in view. Choose the lowest magnification that shows the detail your tasks need.',
          [
            '2.5x–3.5x: common for general work and for building skill.',
            '4.0x–6.0x: finer detail, narrower view.',
            'Above 6.0x: specialised detail work; compare field of view carefully.',
          ],
          '/education/loupe-magnification-guide',
          'Loupe magnification guide',
        ),
        optics,
        section(
          'Step 3: Measure your working distance',
          'Working distance is the distance from your eyes to your hands at work. Loupes are built to focus at that distance, so an incorrect number is one of the most common reasons a pair feels wrong. Measure in your normal posture rather than estimating from height.',
          [
            'Measure seated and standing separately if you use both.',
            'If you change positions often, compare an adjustable-distance design such as Medusa (300–600 mm).',
          ],
          '/education/working-distance-for-loupes',
          'How to measure working distance',
        ),
        section(
          'Step 4: Fit, frame, lights, and prescription',
          `Frame fit and balance decide whether you can wear loupes for a full list. Check whether you need a light and whether it mounts on the frame you choose. If you wear glasses for close work, prescription lenses add ${dollars(PRESCRIPTION_PRICE)} per pair at HeliosX.`,
          [
            'Confirm quoted weights include the frame, optics, prescription, and light.',
            'Ask how fit problems are handled after delivery.',
            'Prescription details: /education/prescription-loupes-guide.',
          ],
        ),
        costs,
        section(
          'Step 5: Read the terms before you pay',
          'Custom loupes are made to your measurements, so return terms matter more than for off-the-shelf products. Read the warranty and return policy of every brand you compare, and ask what happens if the fit needs correcting.',
          [
            'HeliosX: fully refundable before production begins; two-year limited warranty.',
            'Returns policy: /returns. Warranty: /warranty.',
          ],
        ),
      ],
      faqs: [
        faq(
          'What is the most important factor when choosing loupes?',
          'Fit to your working distance and posture. The right magnification in the wrong configuration will still feel uncomfortable and hard to use.',
        ),
        faq(
          'Should I buy Galilean or prismatic loupes?',
          'Galilean designs are lighter and a common choice at 2.5x–3.5x. Prismatic designs allow higher magnification; ergonomic prismatic designs also redirect the view for a more upright head position. Choose by magnification and posture needs.',
        ),
        faq(
          'How long does a custom pair take?',
          'At HeliosX, production usually takes 1–2 weeks after your measurements are approved, then the pair ships with worldwide shipping included.',
        ),
        ...baseFaqs,
      ],
    })

  const plastic = byslug('best-loupes-for-plastic-surgery')
  if (plastic)
    Object.assign(plastic, {
      dateModified: expanded,
      metaTitle: 'Best Loupes for Plastic Surgery | Magnification & Fit',
      description:
        'Choosing loupes for plastic and reconstructive surgery: aesthetic, reconstructive, hand, and microsurgery-oriented work, magnification ranges, ergonomics, and HeliosX options.',
      intro:
        'Plastic surgery covers very different tasks, from aesthetic procedures and skin closure to hand and reconstructive work. That range is why there is no single “best” magnification. Choose for the work you do most, and keep the operating microscope in mind for tasks where your service uses one.',
      sections: [
        section(
          'Match the loupe to the type of work',
          'Aesthetic and general reconstructive work often benefits from a wider view of the operative field, while fine hand and nerve work may call for more detail. Many surgeons own one pair for most cases; others keep a second, higher-power pair for detailed tasks.',
          [
            'Aesthetic and skin work: a moderate magnification with a broad field of view.',
            'Hand and reconstructive work: higher magnification for fine structures.',
            'Microvascular anastomosis: many services use an operating microscope; loupes do not replace one where it is required.',
          ],
        ),
        ...specialtyTable(plastic),
        section(
          'Long cases make ergonomics a priority',
          'Plastic surgery lists can be long, and small posture differences add up. Ergonomic prismatic loupes redirect your line of sight so you can look toward the field with less forward head tilt. Research on ergonomic loupes is promising but limited, so treat viewing angle as one part of a good setup rather than a guarantee.',
          [
            'Compare viewing angle together with frame balance and working distance.',
            'Include the weight of any light you will wear.',
          ],
          '/education/ergonomic-loupes-neck-pain',
          'What research says about ergonomic loupes',
        ),
        section(
          'HeliosX options for plastic surgery',
          `Galileo and Newton (2.5x–3.5x) suit general and aesthetic work on a budget. Apollo (3.0x–6.0x, from ${range('apollo').split('–')[0]}) and Medusa (3.0x–8.5x, from ${range('medusa').split('–')[0]}) are ergonomic prismatic systems; Medusa also adjusts working distance from 300–600 mm for surgeons who move between sitting and standing. Kepler offers conventional prismatic 4.0x–6.0x for detailed work.`,
          [
            'Compare Medusa: /product/medusa.',
            'Compare Apollo: /product/apollo.',
            'Compare Kepler: /product/kepler.',
          ],
        ),
        section(
          'Working distance and position changes',
          'Plastic surgeons often change position during a case. A fixed working distance should match the position you use most, while an adjustable design can cover a range. Measure in your usual operating setup.',
          [],
          '/education/working-distance-for-loupes',
          'How to measure working distance',
        ),
        fit,
      ],
      faqs: [
        faq(
          'What magnification do plastic surgeons use?',
          'It depends on the task. Broad aesthetic and closure work often uses lower magnification, while hand and nerve work may need more detail. Ask colleagues in your service and compare the view at your working distance.',
        ),
        faq(
          'Can loupes replace a microscope for microsurgery?',
          'Not where your service requires a microscope. Loupes can help with preparation and many detailed tasks, but they are a different tool.',
        ),
        faq(
          'Should I buy one pair or two?',
          'Many surgeons start with one versatile pair for most cases. A second, higher-magnification pair can make sense if a large share of your work is fine detail.',
        ),
        ...baseFaqs,
      ],
    })

  const distance = byslug('working-distance-for-loupes')
  if (distance) {
    distance.dateModified = expanded
    distance.sections.push(
      section(
        'Step-by-step: measuring your working distance',
        'You need a tape measure, a helper, and your usual working setup. Measure the way you want to work, not the way you currently compensate for a poor fit.',
        [
          'Set your chair, stool, or table height the way you normally work.',
          'Place a target where your hands work: a typodont, a practice pad, or an instrument tip.',
          'Sit or stand upright with relaxed shoulders and look at the target.',
          'Have your helper measure from the outer corner of your eye to the target.',
          'Repeat two or three times and use the consistent value.',
        ],
        '/measurements',
        'HeliosX measurement instructions',
      ),
      section(
        'Seated and standing work',
        'Many clinicians sit for some tasks and stand for others, and the distance to the field often changes between the two. If you work both ways, record both distances. A fixed-distance loupe should be ordered for the position you use most; an adjustable design such as Medusa (300–600 mm) can cover both within its range.',
      ),
      section(
        'Common measurement mistakes',
        'Most working-distance problems come from measuring in the wrong posture or copying someone else’s number.',
        [
          'Leaning forward while measuring, which records a shorter distance than your upright posture.',
          'Estimating from height instead of measuring.',
          'Measuring at a table height you do not actually use.',
          'Using a colleague’s configuration because they recommended it.',
        ],
      ),
    )
    distance.faqs.push(
      faq(
        'What happens if my working distance is wrong?',
        'The image may only be sharp when you lean in or pull back, which pushes you out of a comfortable posture. Contact your supplier with your measurements rather than adapting your posture to the loupes.',
      ),
      faq(
        'Should I measure with my current loupes on?',
        'Measure the posture you want to keep. If your current loupes make you lean, measuring with them on can repeat the same problem.',
      ),
    )
  }

  const ergonomics = byslug('ergonomic-loupes-neck-pain')
  if (ergonomics) {
    ergonomics.dateModified = expanded
    ergonomics.sections.push(
      section(
        'What to compare in an ergonomic loupe',
        'An ergonomic loupe is more than a label. Compare the features that change how you hold your head and shoulders during a case.',
        [
          'Viewing direction: can you see the field with a more upright head?',
          'Working distance: does it match the posture you want to keep?',
          'Frame balance and total weight, including any light and prescription.',
          'Fit around the nose and temples over a full list.',
        ],
      ),
      section(
        'Posture habits that matter with any loupe',
        'Equipment is one part of the picture. Table or chair height, patient position, and breaks during long cases also affect how you feel at the end of the day. These are general ergonomic practices, not treatment for an existing condition.',
        [
          'Adjust table or chair height before you adjust your neck.',
          'Bring the field toward you rather than leaning toward it.',
          'Check posture at natural breaks in a long case.',
          'See an appropriate clinician for persistent pain.',
        ],
      ),
    )
    ergonomics.faqs.push(
      faq(
        'Are Apollo and Medusa both ergonomic?',
        'Yes. Both are ergonomic prismatic designs. Apollo uses a fixed working distance; Medusa adjusts from 300–600 mm.',
      ),
      faq(
        'Do ergonomic loupes take time to get used to?',
        'Some people need a short adjustment period when the viewing direction changes. Start with shorter cases if you can, and contact us if the fit still feels wrong.',
      ),
    )
  }

  const residents = byslug('best-loupes-for-residents')
  if (residents) {
    residents.dateModified = expanded
    residents.sections.push(
      section(
        'When to buy during residency',
        'Buy when you will use them regularly, not months ahead of a rotation that may change. Custom loupes take time: measurements are reviewed before production, and production usually takes 1–2 weeks after approval, plus shipping. Order a few weeks before the rotation where you expect to wear them.',
        [
          'Confirm the rotation start date and any program requirement first.',
          'Measure your working distance in the operating position you use now.',
          'Leave time for a fit question to be answered before your first case.',
        ],
      ),
      section(
        'Budgeting a first pair',
        `A first pair does not need every feature. Newton (${range('newton')}) and Galileo (${range('galileo')}) cover general training at 2.5x–3.5x. Move up to Kepler (${range('kepler')}) for higher magnification or to Apollo or Medusa (from ${range('apollo').split('–')[0]}) for ergonomic viewing when your work needs it. Prescription lenses add ${dollars(PRESCRIPTION_PRICE)}.`,
        [
          'Check resident and student pricing: /student-loupes-discount.',
          'Compare complete orders, including a light if you need one.',
          'A well-fitted first pair can stay useful after you add a second, higher-power pair.',
        ],
        '/how-much-do-surgical-loupes-cost',
        'What loupes cost',
      ),
      section(
        'Questions to ask any seller before you order',
        'The same questions separate a good first purchase from a frustrating one, whichever brand you choose.',
        [
          'What happens if the working distance or fit is wrong?',
          'What does the warranty cover, and for how long?',
          'Is the order refundable before production, and after?',
          'Does the price include shipping, prescription lenses, and a light?',
        ],
      ),
    )
    residents.faqs.push(
      faq(
        'Should residents buy Galilean or prismatic loupes?',
        'Many residents start with Galilean loupes at 2.5x–3.5x because they are lighter and give a wider view. Choose prismatic when your rotations need more magnification, or ergonomic prismatic when long cases make head posture a priority.',
      ),
      faq(
        'How long do custom loupes take to arrive?',
        'At HeliosX, production usually takes 1–2 weeks after your measurements are approved, then the order ships with worldwide shipping included.',
      ),
    )
  }

  const bySpecialty = byslug('intraoperative-magnification-by-specialty')
  if (bySpecialty) {
    bySpecialty.dateModified = expanded
    bySpecialty.sections.push(
      section(
        'Reading a 2004 survey today',
        'The survey is a useful map of how different specialties used magnification, but it is one regional sample of 148 surgeons from 2004. Equipment, training, and service expectations have changed since. Treat it as a reason to ask your own department what they use, not as a current rule.',
        [
          'Ask senior colleagues which magnification they use for your common procedures.',
          'Check whether your service expects loupes or a microscope for specific steps.',
          'Compare the view at your own working distance before committing.',
        ],
        '/research/intraoperative-magnification-who-uses-it.pdf',
        'Jarrett PM. Intraoperative magnification: who uses it? (PDF)',
      ),
      section(
        'Matching magnification to your specialty',
        'Specialty guides turn the general pattern into specific buying advice for common procedures, magnification ranges, and working positions.',
        [
          'Plastic surgery: /education/best-loupes-for-plastic-surgery.',
          'Cardiothoracic: /cardiac-surgery-loupes.',
          'Pediatric surgery: /pediatric-surgery-loupes.',
          'Maxillofacial: /maxillofacial-surgery-loupes.',
          'ENT and otolaryngology: /ent-otolaryngology-loupes.',
          'Ophthalmic surgery: /ophthalmic-surgery-loupes.',
        ],
      ),
      section(
        'Where each HeliosX model fits',
        'Our lineup separates the three needs the survey describes: affordable everyday magnification, higher magnification for fine structures, and ergonomic viewing for long cases.',
        [
          'Everyday magnification: Newton and Galileo, 2.5x–3.5x.',
          'Higher magnification: Kepler, 4.0x–6.0x; Medusa up to 8.5x.',
          'Ergonomic viewing: Apollo and Medusa; Medusa also adjusts working distance from 300–600 mm.',
        ],
      ),
    )
  }

  const research = byslug('research')
  if (research)
    Object.assign(research, {
      dateModified: expanded,
      metaTitle: 'Loupe Research Library | Ergonomics, Measurement & Use',
      description:
        'Plain-language summaries of research on surgical loupes: prismatic loupe ergonomics, smartphone pupillary-distance measurement, and how specialties use intraoperative magnification.',
      intro:
        'This library summarizes the published research we cite across HeliosX guides, in plain language, with each study’s size and limits. Research on loupes is still limited: most studies are small, short, or simulated, and none tested HeliosX products. Use it to ask better questions, not as proof that any loupe will produce a clinical outcome.',
      sections: [
        section(
          'How to read loupe research',
          'Three details decide how much weight a study can carry.',
          [
            'Size: a study of 19 or 44 people can show a pattern, but not how everyone will respond.',
            'Setting: simulated tasks in a lab are not the same as a full operating list.',
            'What was tested: results for one brand or design do not transfer automatically to another.',
          ],
        ),
        section(
          'Prismatic loupes and neck posture',
          'Fan and colleagues ran a randomized crossover trial with 19 surgeons (Frontiers in Public Health, 2024). They compared each surgeon’s usual non-prismatic loupes with low-tilt (15°) and high-tilt (48°) prismatic loupes during three simulated surgical tasks. Prismatic loupes reduced head inclination (by a median of 13–14° for low-tilt and 22–26° for high-tilt) and reduced neck muscle activity. Surgical errors did not differ, high-tilt loupes slowed two of three tasks, and most participants preferred the low-tilt design.',
          [
            'Limits noted by the authors: simulated tasks, short exposure, little training time, and head flexion only.',
            'The study did not test long-term pain prevention or HeliosX products.',
            'Our summary for buyers: /education/ergonomic-loupes-neck-pain.',
          ],
          'https://pmc.ncbi.nlm.nih.gov/articles/PMC10803506/',
          'Fan X et al. Frontiers in Public Health, 2024',
        ),
        section(
          'Measuring pupillary distance with a phone',
          'Han and colleagues compared three smartphone apps with a digital pupilometer in 44 adults (Cureus, 2023). Warby Parker and Eye Measure had a mean absolute error of about 0.5 mm; PDCheck AR averaged about 1.4 mm. The authors noted the small sample and a single examiner.',
          [
            'If you measure with an app, repeat the measurement and compare it with a second method.',
            'An optician or an existing glasses prescription can confirm your pupillary distance.',
            'HeliosX reviews your measurements before production: /education/how-to-measure-pupillary-distance.',
          ],
          'https://pmc.ncbi.nlm.nih.gov/articles/PMC10389117/',
          'Han KD et al. Cureus, 2023',
        ),
        section(
          'Who uses intraoperative magnification',
          'Jarrett surveyed 148 specialists and senior trainees in the west of Scotland (Microsurgery, 2004). Use of loupes and microscopes was consistent within specialties but differed sharply between them, from frequent use in plastic, maxillofacial, ophthalmic, and ENT surgery to more occasional use in general surgery, urology, orthopedics, and gynecology.',
          [
            'Full summary: /education/intraoperative-magnification-by-specialty.',
            'The survey is from 2004; practice has changed since.',
          ],
          '/research/intraoperative-magnification-who-uses-it.pdf',
          'Jarrett PM. Microsurgery, 2004 (PDF)',
        ),
        section(
          'What research does not tell you yet',
          'There is little published evidence comparing loupe brands head to head, on long-term musculoskeletal outcomes, or on how magnification choice affects surgical results in real operating lists. When a seller makes a claim in those areas, ask for the source.',
        ),
      ],
      faqs: [
        faq(
          'Do ergonomic loupes prevent neck pain?',
          'Research shows prismatic loupes can reduce head inclination and neck muscle activity in simulated tasks. It has not shown long-term pain prevention, and it did not test HeliosX products.',
        ),
        faq(
          'How accurate are smartphone pupillary-distance apps?',
          'In one 44-person study, the most accurate apps averaged about 0.5 mm of error and PDCheck AR about 1.4 mm, compared with a digital pupilometer. Repeat any app measurement and confirm it if you can.',
        ),
        faq(
          'Has HeliosX published its own clinical studies?',
          'No. The studies here tested other products or general practice. We cite them for context and say so on each summary.',
        ),
      ],
    })
}

// Sep 14 2026: landing pages that rendered under 500 words.
function expandThinLandingPages(pages: SeoLandingPage[]) {
  const microsurgery = pages.find((p) => p.slug === 'loupes-for-microsurgery')
  if (!microsurgery) return
  microsurgery.dateModified = expanded
  microsurgery.sections.push(
    section(
      'Loupes and the operating microscope',
      'Microsurgery spans tasks that loupes handle well, such as exposure, dissection, and preparation, and tasks where services use an operating microscope, such as microvascular anastomosis. Loupes are portable and quick to use; a microscope provides far higher magnification. Plan your loupe choice around the steps you will actually do under loupes.',
      [
        'Ask your service which steps are done under loupes and which under the microscope.',
        'Very small structures, roughly one to two millimeters and below, may need microscope-level magnification.',
      ],
      '/education/intraoperative-magnification-by-specialty',
      'How specialties use loupes and microscopes',
    ),
    section(
      'Choosing magnification for fine work',
      'Higher magnification shows smaller structures but narrows the field of view and reduces depth of field, so small head movements move the image more. Many surgeons doing fine work use 4.0x–6.0x prismatic loupes; higher powers suit narrower tasks and steadier setups.',
      [
        'Kepler: conventional prismatic, 4.0x–6.0x, from $1,195.',
        'Apollo: ergonomic prismatic, 3.0x–6.0x, from $1,695.',
        'Medusa: ergonomic prismatic up to 8.5x, with working distance adjustable from 300–600 mm.',
      ],
      '/education/loupe-magnification-guide',
      'Loupe magnification guide',
    ),
    section(
      'Stability, posture, and working distance',
      'At high magnification, an accurate working distance and a stable posture matter more than at lower powers. Measure in your operating position, keep the working field at a height you can hold, and consider an ergonomic design if you spend long periods looking down.',
      [
        'Measure working distance in your usual seated or standing position: /education/working-distance-for-loupes.',
        'Include the weight of a headlight if you will wear one.',
      ],
    ),
  )
  microsurgery.faqs.push(
    faq(
      'What magnification do I need for microsurgery?',
      'Loupes at 4.0x–6.0x are common for fine work, with higher powers for narrower tasks. Steps such as microvascular anastomosis are usually done under an operating microscope.',
    ),
    faq(
      'Can loupes replace an operating microscope?',
      'No. Loupes are useful for many detailed steps, but they do not replace a microscope where your service requires one.',
    ),
  )
}
