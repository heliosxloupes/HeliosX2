import type {
  ContentSection,
  ContentFaq,
  SeoLandingPage,
  EducationGuide,
} from './seo-content'
import { magnificationPriceByProduct, PRESCRIPTION_PRICE } from './pricing'

// Reviewed commercial content. Keep facts separate from brand preference;
// competitor details below were checked against primary sources on 2026-09-10.
const reviewed = '2026-09-10'
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

for (const [slug, title] of [
  ['student-loupe-comparison', 'Student loupe comparison: what to buy first'],
  ['student-loupes-discount', 'Student loupes: compare the final price'],
  ['loupes-for-dental-students', 'Loupes for dental students'],
  ['loupes-for-medical-students', 'Loupes for medical students'],
]) {
  revisions[slug] = {
    title,
    metaTitle: `${slug.includes('discount') ? 'Student Loupe Prices' : title.split(':')[0]} | HeliosX`,
    description:
      'Compare first-pair loupes, published prices, school requirements, and student-program tradeoffs. Newton starts at $695; ergonomic models from $1,695.',
    intro:
      'Before buying your first loupes, check your program’s requirements and try the magnification your instructors recommend. Then compare the complete cost and fitting support. HeliosX Newton starts at $695 without requiring a student discount code.',
    recommendedProducts: ['Newton', 'Galileo', 'Apollo'],
    comparisonRows: undefined,
    verdict: undefined,
    sections: [
      section(
        'Check these three things with your program',
        'Avoid buying a configuration you cannot use in clinic. School rules, required lights, and fitting schedules can matter more than a promotion.',
        [
          'Is there a required magnification, frame, light, or approved supplier?',
          'When do you need the completed loupes, and when can measurements be taken?',
          'Will your clinical posture or prescription change before you start using them?',
        ],
      ),
      section(
        'Choose a first pair you can actually use',
        'Newton and Galileo offer 2.5x–3.5x Galilean configurations. Apollo is an ergonomic prismatic option from $1,695. Do not choose higher magnification simply because a classmate did.',
        [
          'Newton: ' + range('newton') + '. Galileo: ' + range('galileo') + '.',
          'Compare Apollo if redirected ergonomic viewing is a priority.',
          'Keep room in the budget for prescription needs and illumination.',
        ],
      ),
      section(
        'Compare student benefits with the complete HeliosX price',
        'Orascoptic publishes student benefits including a 45-day trial, subject to eligibility and purchase terms. Ask your representative which benefits apply to your order. HeliosX offers published pricing and a different custom-production policy.',
        [
          'Compare your actual eligible quote, not a claimed retail discount percentage.',
          'Confirm returns, fit corrections, and prescription-change costs before paying.',
        ],
        'https://www.orascoptic.com/en-us/students',
        'Orascoptic student program; checked September 10, 2026',
      ),
      fit,
    ],
    faqs: [
      faq(
        'Do I need a code for HeliosX’s entry price?',
        'No. Newton’s $695 starting price is the published 2.5x price. Other magnifications and optional extras change the total.',
      ),
      faq(
        'Should a medical student buy loupes before residency?',
        'Check with your program first. If you will not use them during your current rotations, it may be better to wait until your procedural work and fitting needs are clear.',
      ),
      ...baseFaqs,
    ],
  }
}

for (const [slug, title] of [
  ['loupes-for-dental-hygiene', 'Loupes for dental hygiene'],
  ['loupes-for-hygienists', 'Loupes for hygienists'],
]) {
  revisions[slug] = {
    title,
    metaTitle: 'Dental Hygiene Loupes: Fit, Magnification & Price | HeliosX',
    description:
      'Choose hygiene loupes around seated posture, field of view, weight, and lighting. Compare Newton, Galileo, and ergonomic Apollo with clear prices.',
    intro:
      'For dental hygiene, choose loupes around the view you need for instrumentation and the posture you can maintain through repeated appointments. Start by comparing a lightweight Galilean pair with ergonomic prismatic viewing—not by chasing the highest magnification.',
    recommendedProducts: ['Galileo', 'Newton', 'Apollo'],
    comparisonRows: undefined,
    verdict: undefined,
    sections: [
      section(
        'Magnification: check the view during instrumentation',
        'Compare a 2.5x–3.5x Galilean option if you want a broad starting view. If you are considering an ergonomic design, assess it separately: the viewing direction and adaptation feel different.',
        [
          'Check the tooth and surrounding landmarks you need to see together.',
          'Practice looking between the working field, instruments, and patient.',
          'Ask your program about magnification requirements before ordering.',
        ],
      ),
      section(
        'Weight and posture are separate decisions',
        'A light frame can help with wearability, but low weight alone does not redirect the view. Newton and Galileo are Galilean systems. Apollo and Medusa use ergonomic prismatic viewing; Medusa also adjusts working distance.',
        [
          'Compare the total fitted weight, including prescription and any light.',
          'Measure while seated with your usual stool and patient setup.',
          'Loupes are not a treatment for neck pain or a guarantee of comfortable posture.',
        ],
      ),
      section(
        'Do you need a loupe light?',
        'Compare illumination alongside magnification. A headlight is a separate purchase decision: confirm the mount, beam alignment, battery runtime, and total worn weight for the setup you plan to use.',
        [
          'Ask us about the specific light and mount you already own before assuming compatibility.',
          'Keep the beam centered on your working field.',
          'Compare a complete loupe-and-light total when evaluating another brand’s bundle.',
        ],
      ),
      fit,
    ],
    faqs: [
      faq(
        'Which HeliosX model is the lowest-cost hygiene option?',
        'Newton starts at $695 for 2.5x. Galileo starts at $795. Both are Galilean systems; compare Apollo from $1,695 if you want ergonomic prismatic viewing.',
      ),
      faq(
        'Will ergonomic loupes prevent neck pain?',
        'No product can guarantee that. Ergonomic viewing changes the line of sight, but fit, seating, patient positioning, and work habits still matter. Persistent symptoms need appropriate clinical assessment.',
      ),
      ...baseFaqs,
    ],
  }
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
}
