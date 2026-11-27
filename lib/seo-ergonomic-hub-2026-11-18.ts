import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { LIGHT_BUNDLE_PERCENT_OFF, TRAINEE_PERCENT_OFF, magnificationPriceByProduct } from './pricing'
import { photo } from './seo-bofu-pages'

// Nov 18 2026: one page for every ergonomic-loupe search.
//
// Search Console, Aug 17 to Nov 16: "ergo" searches were spread over about
// eight HeliosX pages. The brand roundups and the hygiene page took most of
// them, and /ergonomic-loupe-comparison fell from #4–6 (Sep) to #45+ (from
// Oct 19). This rebuild makes this page the one answer for "ergonomic loupes",
// "best ergonomic loupes", "best ergonomic dental loupes", "ergonomic surgical
// loupes", "ergonomic loupes price/cost", "buy ergonomic loupes", "ergo loupes"
// and "deflection loupes". /ergonomic-loupes-price is merged here with a 301
// (lib/seo-redirects.json).
//
// Layout copies /best-surgical-loupe-brands, the page with the most search
// clicks on the site (246 since June) and #7.5 for "best surgical loupes"
// (Oct 1 to Nov 16). It climbed from #66 in June to #15 overall after the
// Sep 14 push made it the one page for that search and the Oct 17 push added
// "by specialty" answers that link down. Same parts here: a short answer, the
// HeliosX shortlist, "the shortlist in one minute", "by type of work", "by
// specialty" (dental and surgical), the naming section, "where HeliosX fits",
// one H2 per brand, then evidence, price and FAQs. One addition: the price
// table from the merged price page, because /dental-loupes-price shows a price
// table holds page 1–2 for price searches.
//
// Competitor facts come only from sources already checked in this repo:
// LumaDent store (Nov 16), Q-Optics retail page (Nov 15), and the brand pages
// cited in seo-editorial.ts. Studies are each linked to the paper itself.
// Nothing here says a loupe prevents or treats pain.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const prices = (model: string) => Object.values(magnificationPriceByProduct[model])
const from = (model: string) => usd(Math.min(...prices(model)))
const top = (model: string) => usd(Math.max(...prices(model)))
const range = (model: string) => `${from(model)}–${top(model)}`
const at = (model: string, mag: string) => usd(magnificationPriceByProduct[model][mag])
const section = (
  title: string,
  body: string,
  bullets: string[] = [],
  sourceHref?: string,
  sourceLabel?: string,
): ContentSection => ({ title, body, bullets, ...(sourceHref ? { sourceHref, sourceLabel } : {}) })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })

// Same figures as the LumaDent and Q-Optics price pages (seo-bofu-pages-2026-11-16.ts).
const luma = {
  ergoAirTiVario: { '3.0x': 1395, '4.0x': 1695, '5.0x': 1995 },
  ergoAirTiTtl: { '3.0x': 1995, '4.0x': 2295, '8.0x': 3195 },
}
const qoErgo = { '3.0x': 2090, '4.0x': 2590, '4.5x': 2690 }

const fan2024 = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10803506/'
const colak2025 = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12738782/'

export const ergonomicHub: Partial<SeoLandingPage> = {
  title: 'Best ergonomic loupes for dentists and surgeons',
  metaTitle: 'Best Ergonomic Loupes 2026 for Dentists & Surgeons | HeliosX',
  description: `The best ergonomic loupes for dentists, hygienists and surgeons: 9 brands compared by price, weight and magnification, with the posture research. From ${from('apollo')}.`,
  heroKicker: 'Ergonomic loupes',
  heroImage: {
    src: photo.medusa.src,
    alt: 'Best ergonomic loupes: HeliosX Medusa ergonomic prismatic loupes with adjustable working distance, bronze barrels on a metal frame',
    caption: `Medusa · Ergonomic prismatic, adjustable 300–600 mm · From ${from('medusa')} USD`,
  },
  primaryKeyword: 'ergonomic loupes',
  relatedKeywords: [
    'best ergonomic loupes',
    'best ergonomic dental loupes',
    'ergonomic dental loupes',
    'ergonomic surgical loupes',
    'best ergonomic surgical loupes',
    'ergonomic loupes price',
    'ergonomic loupes cost',
    'buy ergonomic loupes',
    'ergo loupes',
    'ergonomics loupes',
    'ergonomic loupes for hygienists',
    'deflection loupes',
    'ergo prism loupes',
    'lightweight ergonomic loupes',
  ],
  audience: 'Dentists, hygienists, surgeons and trainees choosing ergonomic loupes',
  authorityAudience: 'clinicians',
  answer: `The best ergonomic loupes are prismatic loupes with an angled light path, so you look down with your eyes while your head stays closer to upright. For dentists, the best are 3.0x–4.0x pairs fitted to a seated working distance, such as HeliosX Apollo (${range('apollo')}); hygienists usually choose 3.0x–3.5x. If your working distance changes, between sitting and standing, between cases, or at a table set for someone else, choose ergonomic loupes with an adjustable working distance: HeliosX Medusa adjusts from 300 to 600 mm, reaches 8.5x and weighs from 56 g with frame (${range('medusa')}). Clinicians in more than 110 countries choose HeliosX, custom-built with a lifetime warranty.`,
  intro:
    'The best ergonomic loupes let you see the working field with your head closer to upright, at a weight you can wear all day and a price you can justify. Ergonomic loupes are also called deflection loupes, ergo loupes or ergonomic prismatic loupes. There is no single best brand for every clinician, so below you can match an ergonomic loupe to your work and specialty, then compare every major brand’s ergonomic line, its price, and what the research shows.',
  why: {
    title: 'Why adjustable working distance matters in an ergonomic loupe',
    body: [
      'An ergonomic loupe keeps your head upright only at the working distance it was built for. Move closer or further, and you bend your neck again to find focus. That happens every time you switch from sitting to standing, from one case to another, or work at a table height another surgeon set.',
      'HeliosX Medusa is a new generation of ergonomic prismatic loupe that solves this: its working distance adjusts from 300 to 600 mm, so the focus moves with you instead of your neck. It is ultra-lightweight for an ergonomic prismatic loupe, from 56 g with frame, built with premium optical glass, multi-layer coatings and rigid metal barrels, and reaches 8.5x.',
    ],
  },
  tierChart: undefined,
  quickPicks: undefined,
  items: undefined,
  tips: undefined,
  specTable: {
    title: 'Ergonomic loupes compared: brands, magnification and price',
    lead: 'Every major ergonomic line, with the price each brand publishes. Where a brand quotes through representatives, ask for an itemized quote at the same magnification.',
    columns: ['Ergonomic loupe', 'Design', 'Magnification', 'Working distance', 'Weight with frame', 'Price'],
    rows: [
      ['HeliosX Apollo', 'Ergonomic prismatic, through the lens', '3.0x–6.0x', 'Fixed: 420, 450, 500 or 550 mm', '55–58 g', `${range('apollo')}, published`],
      ['HeliosX Medusa', 'Ergonomic prismatic, through the lens', '3.0x–8.5x', 'Adjustable 300–600 mm', '56–65 g', `${range('medusa')}, published`],
      ['LumaDent Ergo Air Ti', 'Ergonomic prismatic, TTL or Vario mount', '3.0x–8.0x', 'Variable', '—', `TTL ${usd(luma.ergoAirTiTtl['3.0x'])}–${usd(luma.ergoAirTiTtl['8.0x'])}; Vario ${usd(luma.ergoAirTiVario['3.0x'])}–${usd(luma.ergoAirTiVario['5.0x'])}`],
      ['Q-Optics ErgoAngle', 'Fitted viewing angle', '3.0x–4.5x', 'Fitted', '—', `${usd(qoErgo['3.0x'])}–${usd(qoErgo['4.5x'])} retail`],
      ['Orascoptic Ergo Series', 'Ergonomic', 'Ask the dealer', 'Ask the seller', '—', 'Dealer quote'],
      ['SurgiTel Ergo IQ / ErgoDeflection', 'Ergonomic deflection', '3.0x, 3.5x, 4.5x (Ergo IQ)', 'Ask the seller', '—', 'Representative quote'],
      ['ExamVision Kepler Reflekt', 'Ergonomic prismatic', '4.0x and 6.0x', 'Ask the seller', '—', 'Dealer quote'],
      ['Admetec Ergo V', 'Ergonomic, three settings in one loupe', 'Three settings', 'Ask the seller', '—', 'Quote'],
      ['Designs for Vision Infinity VUE', 'Ergonomic', '3.0x–4.5x', 'Ask the seller', '—', 'Quote'],
    ],
    note: 'HeliosX prices in USD, worldwide shipping included. LumaDent: lumadent.com store, checked November 16, 2026. Q-Optics: q-optics.com retail offer page, checked November 15, 2026. Other brands from their own sites, which publish no prices. Loupe only; lights are extra at every brand.',
  },
  procedureRows: [
    { procedure: 'General and restorative dentistry', magnification: '3.0x–4.0x', distance: '350–450 mm, measured seated', pick: `/product/apollo at 3.0x–4.0x, ${at('apollo', '3.0x')}–${at('apollo', '4.0x')}` },
    { procedure: 'Dental hygiene, full recall days', magnification: '3.0x–3.5x', distance: '350–450 mm, measured in your chair', pick: '/product/apollo at 3.0x' },
    { procedure: 'Endodontics', magnification: '4.0x–6.0x', distance: '350–450 mm', pick: '/product/medusa at 4.0x–6.0x' },
    { procedure: 'Implant placement', magnification: '3.0x–4.0x', distance: '350–450 mm, seated', pick: '/product/apollo at 4.0x' },
    { procedure: 'General surgery, long open cases', magnification: '3.0x', distance: '450–550 mm, standing', pick: '/product/apollo at 3.0x' },
    { procedure: 'Spine and cardiac surgery', magnification: '3.5x–5.0x', distance: '400–500 mm, standing', pick: '/product/medusa at 4.0x' },
    { procedure: 'Sitting for some cases, standing for others', magnification: '3.0x–6.0x', distance: '300–600 mm, adjustable', pick: '/product/medusa, adjustable' },
    { procedure: 'Fine detail short of a microscope', magnification: '6.0x–8.5x', distance: '350–600 mm', pick: '/product/medusa at 6.0x–8.5x' },
  ],
  comparisonRows: [
    { feature: 'Head position', heliosx: 'Apollo and Medusa angle the view down inside the barrel, so your eyes do the looking and your head stays closer to upright.', other: 'A conventional loupe looks straight along the barrel. The steeper the declination, the further your eyes or neck must tilt to reach the field.' },
    { feature: 'Optics', heliosx: 'Ergonomic prismatic: a prism folds and redirects the light path, giving a sharp, flat image from 3.0x to 8.5x.', other: 'Galilean (2.5x–3.5x) is lighter but stops around 3.5x. Conventional prismatic, such as HeliosX Kepler, reaches 6.0x without redirecting your view.' },
    { feature: 'Weight with frame', heliosx: 'Apollo 55–58 g, Medusa 56–65 g.', other: 'Newton (Galilean) 40–50 g; Kepler (conventional prismatic) 68–85 g.' },
    { feature: 'Price', heliosx: `Apollo ${range('apollo')}, Medusa ${range('medusa')}.`, other: `Newton from ${from('newton')}, Galileo from ${from('galileo')}, Kepler from ${from('kepler')}.` },
  ],
  competitorName: 'Conventional loupes',
  verdict: 'Choose ergonomic prismatic loupes if your work keeps you in one bent posture for long stretches. Choose a Galilean pair if your cases are short and you work at 3.5x or below.',
  proofPoints: [
    `Ergonomic prismatic from ${from('apollo')}`,
    'Working distance adjustable 300–600 mm on Medusa',
    'Custom-built to your measurements',
    'Every price published, lifetime warranty',
  ],
  recommendedProducts: ['Medusa', 'Apollo', 'Galileo'],
  sections: [
    section(
      'The shortlist in one minute',
      'Choose the feature you need first.',
      [
        'Ultra-lightweight ergonomic loupes with an adjustable working distance: HeliosX Medusa, 300–600 mm, 3.0x–8.5x, from 56 g with frame.',
        `Ergonomic at one fixed working distance: HeliosX Apollo, from ${from('apollo')}.`,
        `Magnification above 6x in an ergonomic loupe: HeliosX Medusa up to 8.5x (${at('medusa', '8.5x')}).`,
        'Several magnifications in one ergonomic loupe: compare Admetec Ergo V.',
        'A demonstration before you buy: Orascoptic, SurgiTel and Designs for Vision sell through representatives.',
      ],
    ),
    section(
      'Ergonomic loupes with adjustable working distance: HeliosX Medusa',
      `Ergonomic loupes with an adjustable working distance let you refocus by turning the loupe, not by bending your neck. HeliosX Medusa adjusts from 300 to 600 mm while keeping its ergonomic prismatic view, from 3.0x to 8.5x, at ${range('medusa')}. Few ergonomic loupes adjust at all (LumaDent lists a variable working distance on Ergo Air Ti); most are built for one distance.`,
      [
        'Premium build: optical glass with multi-layer coatings, rigid metal barrels and reinforced mounts.',
        'Ultra-lightweight for its class: 56 g with frame at 3.0x–4.0x and 65 g at 8.0x–8.5x, against 68–85 g for conventional prismatic loupes such as HeliosX Kepler.',
        'Wide view at low power: 80 mm field of view and 110 mm depth of field at 3.0x–4.0x; 50 mm and 40 mm at 8.0x–8.5x.',
        'At each magnification both HeliosX ergonomic models offer, Medusa costs the same as Apollo or less.',
        'Specifications, frames and prices: /product/medusa.',
      ],
    ),
    {
      ...section(
        'A plastic surgery resident on ergonomic loupes',
        'An unpaid review from a surgeon who works with both an ergonomic pair and a conventional Galilean pair, in the surgeon’s own words, lightly edited for length.',
      ),
      // Owner-supplied review, Nov 27 2026: unpaid, no connection to HeliosX (owner-confirmed).
      quote: {
        heading: '“Night and day for downward-looking cases.”',
        paragraphs: [
          'Switching to ergonomic loupes was life-changing. On cases where I look down, such as rhinoplasty, palate and other intraoral surgery, facial surgery and blepharoplasty, my neck pain dropped dramatically. I still keep a traditional Galilean pair for cases where I look straight ahead or operate seated, but when I wear them I feel a strain on my neck that I don’t feel at all with the ergonomic pair. For that reason alone, I recommend them.',
          'I shopped around, and most brands charge very high prices for loupes. HeliosX Medusa is fairly priced, with a high-quality titanium frame and adjustable working distance. As surgeons we aren’t always standing: sometimes we sit, and attendings or colleagues prefer a different table height, so we adjust to the team. In those situations they’re a lifesaver.',
        ],
        name: 'Iakov Efimenko, MD',
        role: 'PGY-5, Plastic Surgery',
        disclosure: 'Unpaid review. One clinician’s experience; results vary.',
      },
    },
    section(
      'One ergonomic loupe for every table height on your team',
      'In a shared operating room the table is usually set for the lead surgeon. Assistants, residents and fellows of different heights then work at a distance their loupes were not built for, and lean in or stoop to find focus. A fixed-distance loupe cannot follow; Medusa’s working distance can be turned to match the table you are given, case by case.',
      [
        'Assisting at a table set lower or higher than you would choose: adjust Medusa instead of your posture.',
        'Rotating between attendings, rooms or hospitals with different setups: one pair covers 300–600 mm.',
        'Training years, when your role at the table changes often: one pair that adjusts as you move from assisting to operating.',
      ],
    ),
    section(
      'Sitting for one case, standing for the next',
      'Many surgeons and dentists change position between procedures, and each position has its own working distance. Hand surgery is usually done seated at an arm table; cleft palate repair is commonly done seated at the head of the table, looking down into the mouth; open abdominal, cardiac and spine cases are done standing, further from the field. Dentists work seated, but the distance changes between operatories, chairs and procedures.',
      [
        'In a 2024 study of three hand surgeons, wearing loupes was the main factor linked to poor posture, and the surgeons spent about 40% of operating time slouched. Fit and working distance decide posture.',
        'Palate surgery: surgical references recommend loupes at 2.5x–4x, and the seated head-of-table position brings strong neck flexion, so an upright ergonomic view matters most there.',
        'Medusa lets one pair cover the seated, close distance and the standing, longer one without a second pair of loupes.',
      ],
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC7647538/',
      'Cleft palate surgery positioning and surgeon ergonomics, PubMed Central PMC7647538',
    ),
    section(
      'Best ergonomic loupes by type of work',
      'Start with the work, then shortlist the design that suits it. These pairings are starting points; compare the view at your own working distance before you buy.',
      [
        `Long days in one seated posture (dentistry, hygiene): ergonomic prismatic at 3.0x–4.0x. HeliosX Apollo, ${at('apollo', '3.0x')} at 3.0x.`,
        'Long standing cases (spine, cardiac, general surgery): ergonomic prismatic at 3.0x–5.0x, built to your standing working distance.',
        'Moving between sitting and standing: HeliosX Medusa, because the working distance adjusts.',
        'Fine detail at 6.0x–8.5x without tipping your head: HeliosX Medusa.',
        `Short cases at 3.5x or below: a Galilean pair may be enough. HeliosX Newton from ${from('newton')} or Galileo from ${from('galileo')}.`,
      ],
    ),
    section(
      'Best ergonomic dental loupes',
      `The best ergonomic dental loupes are ergonomic prismatic loupes at 3.0x–4.0x, built to your seated working distance: HeliosX Apollo is ${at('apollo', '3.0x')} at 3.0x and ${at('apollo', '4.0x')} at 4.0x. They pay off most on long restorative, endodontic and implant days spent leaning over the chair; for endodontics at 4.0x–6.0x, Medusa adds a working distance you can change between seated positions.`,
      [
        'Hygienists: 3.0x–3.5x keeps a wide field over a full day of recalls; measure working distance in your own chair position. /loupes-for-dental-hygiene.',
        'Endodontics: 4.0x–6.0x; Medusa lets you change working distance between seated positions. /loupes-for-endodontics.',
        'Implant placement: 3.0x–4.0x, seated; Apollo at 4.0x. /loupes-for-dental-implants.',
        `Dental students and residents: an ergonomic pair can be the one you keep into practice; verified trainees get ${TRAINEE_PERCENT_OFF}% off. /student-loupe-comparison.`,
        'Every dental loupe brand compared: /best-dental-loupe-brands.',
      ],
    ),
    section(
      'Best ergonomic loupes for dental hygienists',
      `The best ergonomic loupes for hygienists are light 3.0x–3.5x pairs with the viewing angle fitted to your own chair position, so you can scale with your head closer to upright: HeliosX Apollo at 3.0x is ${at('apollo', '3.0x')} and weighs 55–58 g with frame. Hygiene holds one seated posture for hours, which is where ergonomic optics help most.`,
      [
        'In a 2021 study of 24 dental hygiene students hand scaling with loupes, every student exceeded 20° of forward neck flexion and half reported neck pain (Journal of Dental Hygiene). A loupe fitted to your posture stops you leaning in to find focus.',
        'Keep magnification at 3.0x–3.5x for a wide field across a full day of recalls.',
        'Choose a light whose battery lasts your whole day: /dental-hygiene-loupes-with-light.',
        'The full hygiene guide: /loupes-for-dental-hygiene.',
      ],
      'https://pubmed.ncbi.nlm.nih.gov/33875531/',
      'Evaluating the Prevalence of Musculoskeletal Neck Pain in Dental Hygiene Students. J Dent Hyg. 2021;95(2):58–62',
    ),
    section(
      'Best ergonomic surgical loupes',
      `The best ergonomic surgical loupes are ergonomic prismatic loupes at 3.0x–5.0x, built to your standing working distance. Surgeons need them most in long cases, deep fields and anything done standing for hours. Apollo suits surgeons who work at one measured distance. Medusa suits surgeons who sit for some cases and stand for others, because its working distance adjusts from 300 to 600 mm, and it reaches 8.5x for fine work short of the microscope.`,
      [
        'Neurosurgery and spine: 4.0x–5.0x for decompression; Medusa at 4.0x. /neurosurgery-loupes.',
        'Cardiac and vascular surgery: 3.5x–4.5x for anastomosis, standing. /cardiac-surgery-loupes and /vascular-surgery-loupes.',
        'ENT and head and neck: Apollo at 3.0x keeps the head upright through long thyroid and parotid dissections. /ent-otolaryngology-loupes.',
        'General surgery: 3.0x for long open cases, measured standing. /general-surgery-loupes.',
        'Every surgical loupe brand compared: /best-surgical-loupe-brands.',
      ],
    ),
    section(
      'Ergonomic, deflection and ergo prism loupes',
      'These names describe the same idea. Every loupe points your eyes down toward the work, and the declination angle sets how far. Ergonomic loupes go further: a prism inside the telescope bends the light path, so the view angles downward while your head stays closer to upright.',
      [
        'Declination alone: available on most loupes, limited by how far your eyes can comfortably look down.',
        'Ergonomic prismatic (deflection): the optics do more of the work. HeliosX Apollo and Medusa use this design.',
        'Prismatic does not automatically mean ergonomic: HeliosX Kepler is prismatic but keeps the usual head tilt.',
      ],
      '/education/galilean-vs-prismatic-loupes',
      'Galilean, prismatic and ergonomic prismatic loupes compared',
    ),
    section(
      'How to choose ergonomic loupes',
      'Choose ergonomic loupes in this order: your posture, your working distance, the magnification your work needs, then weight, light and price. Brand comes last, because the same brand sells several ergonomic designs.',
      [
        'Posture: if you hold one bent position for long stretches, ergonomic prismatic optics are worth the extra cost.',
        'Working distance: measure it in your real seated or standing position; the viewing angle is set around it. /education/working-distance-for-loupes.',
        'Magnification: 3.0x–3.5x for hygiene and general work, 4.0x–6.0x for fine detail, up to 8.5x on Medusa. /education/loupe-magnification-guide.',
        'Weight: compare the weight with frame, not the barrels alone.',
        'Light: decide before you order, because the mount is fitted to the frame.',
        'Price and terms: compare the same magnification and mounting, and ask what the warranty and returns cover.',
      ],
    ),
    section(
      'Lightweight ergonomic loupes',
      'Ergonomic loupes weigh a little more than Galilean loupes because of the prism glass, but less than conventional prismatic loupes. Weights with frame across the HeliosX range:',
      [
        'HeliosX Apollo (ergonomic prismatic): 55–58 g.',
        'HeliosX Medusa (ergonomic prismatic, adjustable working distance): 56–65 g.',
        'HeliosX Newton (Galilean, not ergonomic): 40–50 g.',
        'HeliosX Kepler (conventional prismatic, not ergonomic): 68–85 g.',
        'Most other brands do not publish weights with frame; ask for the figure in writing.',
      ],
    ),
    section(
      'Ergonomic loupes with a light',
      `Most clinicians pair ergonomic loupes with an LED headlight, and the light should be chosen before the loupe is built because its mount is fitted to the frame. HeliosX lights are ${LIGHT_BUNDLE_PERCENT_OFF}% off when ordered with loupes.`,
      [
        'Dental: /dental-loupes-with-light.',
        'Surgical: /surgical-loupes-with-light.',
      ],
    ),
    section(
      'Where HeliosX fits',
      'HeliosX exists because surgical optics should not be overpriced or gatekept. Apollo and Medusa are ergonomic prismatic loupes custom-built to your measured pupillary distance and working distance, with the price of every model and magnification published before you order.',
      [
        `Apollo: built at one working distance (420, 450, 500 or 550 mm), 3.0x–6.0x, 55–58 g with frame, ${range('apollo')}. /product/apollo.`,
        `Medusa: working distance adjustable from 300 to 600 mm, 3.0x–8.5x, 56–65 g with frame, ${range('medusa')}. /product/medusa.`,
        'At each magnification both models offer, Medusa costs the same or less.',
        'Worldwide shipping included, 30-day returns on non-prescription pairs, and a lifetime warranty.',
      ],
    ),
    section(
      'LumaDent Ergo Air Ti',
      `LumaDent publishes its prices. Ergo Air Ti is ${usd(luma.ergoAirTiTtl['3.0x'])} at 3.0x through the lens, up to ${usd(luma.ergoAirTiTtl['8.0x'])} at 8.0x, and its Vario mount is a different mounting from ${usd(luma.ergoAirTiVario['3.0x'])}. Its specification lists variable working distance.`,
      [
        `At 3.0x through the lens, HeliosX Apollo is ${usd(luma.ergoAirTiTtl['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} less.`,
        'LumaDent sells lights separately; price the loupe and light together. /lumadent-loupes-price.',
      ],
      'https://www.lumadent.com/products/ergo-air-ti-ttl-loupes',
      'LumaDent official product page; checked November 16, 2026',
    ),
    section(
      'Q-Optics ErgoAngle',
      `Q-Optics describes ErgoAngle as individually customized for viewing angle, width, loupe height and working distance. Its retail price runs from ${usd(qoErgo['3.0x'])} at 3.0x to ${usd(qoErgo['4.5x'])} at 4.5x.`,
      [
        `At 3.0x, HeliosX Apollo is ${usd(qoErgo['3.0x'] - magnificationPriceByProduct.apollo['3.0x'])} less than ErgoAngle at retail.`,
        'Line by line: /q-optics-loupes-price.',
      ],
      'https://q-optics.com/products/ergoangle',
      'Q-Optics official product page; retail price checked November 15, 2026',
    ),
    section(
      'Orascoptic Ergo Series',
      'Orascoptic sells its Ergo Series through dealers and does not publish prices. It offers demonstrations and a student program with its own trial terms.',
      [
        'Ask for an itemized quote and the trial conditions in writing, then compare the total with a complete HeliosX order.',
        'Line by line: /orascoptic-loupes-price.',
      ],
      'https://www.orascoptic.com/en-us/students',
      'Orascoptic official information',
    ),
    section(
      'SurgiTel Ergo IQ and ErgoDeflection',
      'SurgiTel sells several ergonomic families rather than one design, including ErgoDeflection and Ergo IQ at 3x, 3.5x and 4.5x, priced through a representative.',
      [
        'Ask for the fitted viewing angle, working-distance options and the cost of later adjustments in writing.',
        'Line by line: /surgitel-loupes-price.',
      ],
      'https://www.surgitel.com/loupes/',
      'SurgiTel official information',
    ),
    section(
      'ExamVision Kepler Reflekt',
      'ExamVision’s ergonomic line, Kepler Reflekt, comes at 4x and 6x and is priced by dealer quote. Its Kepler Advanced switches between 4.0x and 7.0x in one loupe, which is a different proposition from choosing one magnification at order.',
      ['Line by line: /examvision-loupes-price.'],
      'https://examvision.com/loupes-lights/loupes/kepler-advanced/',
      'ExamVision official information',
    ),
    section(
      'Admetec Ergo V',
      'Admetec Ergo V provides three magnification settings in one ergonomic loupe. HeliosX builds each pair at one magnification; Medusa changes working distance, not magnification.',
      ['Confirm regional pricing and support with the authorized seller.'],
      'https://www.admetec.com/ergo-v-loupes/',
      'Admetec official information',
    ),
    section(
      'Designs for Vision Infinity VUE',
      'Designs for Vision builds loupes to each buyer’s measurements in New York, offers a 45-day free trial, and sells Infinity VUE ergonomic loupes at 3.0x, 3.5x and 4.5x. Prices are not published; you request a quote or a demonstration.',
      ['Ask for a written quote at the same magnification and compare it with a complete HeliosX order.'],
      'https://www.designsforvision.com/DentHtml/D-Infinity.htm',
      'Designs for Vision official information',
    ),
    section(
      'What the research shows: surgeons',
      'In a randomized crossover trial, 19 surgeons performed simulated surgical tasks with their usual loupes and with two prismatic designs. High-tilt prismatic loupes reduced head inclination by 22–26° and neck muscle activity by 32–42% compared with traditional loupes, with no significant difference in errors, although some tasks took slightly longer.',
      [
        'The authors note the limits: simulated tasks, short exposure and little time to adapt.',
        'In a 2024 survey of 93 ophthalmologists (Saudi Journal of Ophthalmology), 87% reported neck pain over 12 months, which is why posture belongs in the choice of optics.',
        'These studies did not test HeliosX loupes, and none shows that a loupe prevents or treats neck pain.',
      ],
      fan2024,
      'Fan X et al. Frontiers in Public Health, 2024',
    ),
    section(
      'What the research shows: dentistry and hygiene',
      'A 2025 crossover study in Scientific Reports scored the posture of 10 periodontology clinicians during non-surgical periodontal therapy, with and without 3x prism flip-up loupes. With loupes, the overall posture score improved from 13.0 to 10.6 (lower is better), and the head and neck score from 4.2 to 3.0. Shoulders and trunk also improved; wrists did not change. The loupes were not custom-made, so a fitted pair may do better, but that was not tested.',
      [
        'A 2021 pilot study of hygienists while scaling (International Journal of Dental Hygiene) found that a declination angle custom-fitted to the clinician changed posture, while an off-the-shelf angle did not. Fit decides most of the benefit.',
        'A 2020 survey of 400 dental students and dentists (International Journal of Dentistry) found loupe users reported less neck pain over the past week than non-users, 18% vs 34%. A survey shows an association, not proof.',
        'A 2019 systematic review in the Journal of the American Dental Association concluded that magnification has a positive effect on musculoskeletal symptoms, while noting small samples and no long-term data.',
        'More on posture and neck strain: /education/ergonomic-loupes-neck-pain.',
      ],
      colak2025,
      'Çolak R et al. Scientific Reports, 2025',
    ),
    section(
      'Ergonomic loupes price: what you will pay',
      `Ergonomic loupes cost ${from('apollo')} to over $3,000 through the lens where brands publish prices: HeliosX Apollo ${range('apollo')} and Medusa ${range('medusa')} with shipping included, LumaDent Ergo Air Ti ${usd(luma.ergoAirTiTtl['3.0x'])}–${usd(luma.ergoAirTiTtl['8.0x'])}, and Q-Optics ErgoAngle ${usd(qoErgo['3.0x'])}–${usd(qoErgo['4.5x'])} at retail. They cost more than Galilean loupes because the prism is extra precision glass and its angle has to be set for your posture.`,
      [
        `Compare the same magnification and the same mounting: LumaDent Ergo Air Ti at 3.0x is ${usd(luma.ergoAirTiVario['3.0x'])} on its Vario mount and ${usd(luma.ergoAirTiTtl['3.0x'])} through the lens.`,
        'Ask representatives for an itemized quote: loupe, light, prescription, shipping and any fitting fee, in writing.',
        `Verified students, residents and fellows get ${TRAINEE_PERCENT_OFF}% off HeliosX loupes. Monthly cost by model: /loupes-payment-plans.`,
        'Every brand’s dental prices in one place: /dental-loupes-price.',
      ],
    ),
    section(
      'Buy ergonomic loupes fitted to you',
      'Most ergonomic brands sell through representatives, dealers or school fairs, and the price arrives after a fitting appointment. HeliosX sells directly, with the price of every ergonomic model and magnification published.',
      [
        'Order online, then send your measurements; they are reviewed before production: /measurements.',
        'Custom production typically takes 1–2 weeks after your measurements are approved. Standard worldwide shipping is included.',
        'Non-prescription pairs can be returned within 30 days of delivery for a full refund. Every pair has a lifetime warranty.',
      ],
    ),
    section(
      'Getting used to ergonomic loupes',
      'Looking down through an angled light path feels different at first, so expect a short adjustment period. Wear them for shorter cases or appointments first and build up. Measure your working distance carefully in your real posture, because the viewing angle is set around it.',
      ['Working distance guide: /education/working-distance-for-loupes.'],
    ),
  ],
  faqs: [
    faq(
      'What are the best ergonomic loupes?',
      `The best ergonomic loupes are prismatic loupes with an angled light path, fitted to your working distance. HeliosX Apollo (${range('apollo')}) and Medusa (${range('medusa')}) are ergonomic prismatic loupes with published prices and a lifetime warranty. Other established lines include LumaDent Ergo Air Ti, Q-Optics ErgoAngle, Orascoptic Ergo Series, SurgiTel Ergo IQ and ExamVision Kepler Reflekt.`,
    ),
    faq(
      'What are the best ergonomic dental loupes?',
      `For most dentists, ergonomic prismatic loupes at 3.0x–4.0x measured to a seated posture: HeliosX Apollo from ${from('apollo')}. Hygienists usually stay at 3.0x–3.5x. For endodontics and implants at 4.0x–6.0x, Medusa adds an adjustable working distance.`,
    ),
    faq(
      'What are the best ergonomic loupes for hygienists?',
      `Light ergonomic prismatic loupes at 3.0x–3.5x, with the viewing angle fitted to your chair position. HeliosX Apollo at 3.0x is ${at('apollo', '3.0x')} and weighs 55–58 g with frame.`,
    ),
    faq(
      'What magnification should ergonomic dental loupes be?',
      'Most dentists choose 3.0x–4.0x and most hygienists 3.0x–3.5x. Endodontics usually needs 4.0x–6.0x. Choose the lowest magnification that shows the detail your work needs.',
    ),
    faq(
      'What are the lightest ergonomic loupes?',
      'Among HeliosX ergonomic models, Apollo is the lightest at 55–58 g with frame; Medusa is 56–65 g. Galilean loupes are lighter (Newton 40–50 g) but do not redirect your view.',
    ),
    faq(
      'What are the best ergonomic surgical loupes?',
      `Surgeons in long or deep cases usually choose ergonomic prismatic loupes at 3.0x–6.0x. HeliosX Medusa adjusts working distance from 300 to 600 mm and reaches 8.5x; Apollo is built at one measured working distance. Both start at ${from('apollo')}.`,
    ),
    faq(
      'Are there ergonomic loupes with adjustable working distance?',
      `Yes, though few brands offer them. HeliosX Medusa is an ergonomic prismatic loupe whose working distance adjusts from 300 to 600 mm, from 3.0x to 8.5x, at ${range('medusa')}. LumaDent also lists a variable working distance on Ergo Air Ti.`,
    ),
    faq(
      'Can one pair of loupes work sitting and standing?',
      'Only if the working distance adjusts. A fixed-distance loupe is in focus at one distance, so changing position means bending your neck to refocus. HeliosX Medusa adjusts from 300 to 600 mm, so one pair covers seated and standing work.',
    ),
    faq(
      'What are the best loupes when the operating table is set for someone else?',
      'Loupes with an adjustable working distance. In a shared operating room the table is set for the lead surgeon; HeliosX Medusa lets assistants and residents refocus to that table instead of stooping.',
    ),
    faq(
      'How much do ergonomic loupes cost?',
      `HeliosX Apollo costs ${range('apollo')} and Medusa ${range('medusa')}. LumaDent publishes Ergo Air Ti from ${usd(luma.ergoAirTiTtl['3.0x'])} at 3.0x through the lens, and Q-Optics lists ErgoAngle from ${usd(qoErgo['3.0x'])} at retail. Orascoptic, SurgiTel and ExamVision quote through dealers or representatives.`,
    ),
    faq(
      'Why are ergonomic loupes more expensive?',
      'The prism that angles the view is extra precision glass, and the angle has to be set accurately for your posture. That adds cost and some weight compared with a Galilean pair.',
    ),
    faq(
      'Are ergonomic loupes worth it?',
      'They are worth it when your work holds you in one bent posture for long stretches, as in hygiene, restorative dentistry and long surgical cases. In a randomized crossover trial, high-tilt prismatic loupes reduced surgeons’ head inclination by 22–26°. If your cases are short and you work at 3.5x or below, a Galilean pair may be enough.',
    ),
    faq(
      'Where can I buy ergonomic loupes?',
      `Most brands sell through representatives or dealers. HeliosX sells Apollo and Medusa directly online at published prices from ${from('apollo')}, custom-built to your measurements, with worldwide shipping included and 30-day returns on non-prescription pairs.`,
    ),
    faq(
      'Do ergonomic loupes help with neck pain?',
      'They reduce how far you bend your neck while you work, which lowers the load on your neck muscles. That is different from treating neck pain, and the research so far comes from short studies. Persistent pain needs a clinical assessment.',
    ),
    faq(
      'What is the difference between ergonomic and prismatic loupes?',
      'Prismatic describes the optics; ergonomic describes the viewing angle. HeliosX Kepler is prismatic but not ergonomic. Apollo and Medusa are both.',
    ),
    faq(
      'What are deflection loupes?',
      'Deflection loupes are ergonomic loupes: the optics deflect your line of sight downward so your head can stay closer to upright. HeliosX Apollo and Medusa use an angled prismatic light path to do this.',
    ),
    faq(
      'Are ergonomic loupes heavier than Galilean loupes?',
      'Yes, slightly, because of the prism glass. Apollo weighs 55–58 g and Medusa 56–65 g with frame, against 40–50 g for Newton (Galilean) and 68–85 g for Kepler (conventional prismatic).',
    ),
    faq(
      'How long does it take to get used to ergonomic loupes?',
      'Expect a short adjustment period. Start with shorter cases or appointments and build up.',
    ),
  ],
  dateModified: '2026-11-18',
}

export function applyErgonomicHub(pages: SeoLandingPage[]) {
  // The hub moves to /ergonomic-loupes so the URL matches the H1 and the main
  // search. The May page that used that slug was merged away on Oct 2; drop it
  // so the hub owns the slug. /ergonomic-loupe-comparison 301s here.
  const old = pages.findIndex((p) => p.slug === 'ergonomic-loupes')
  if (old >= 0) pages.splice(old, 1)
  const page = pages.find((p) => p.slug === 'ergonomic-loupe-comparison')
  if (page) Object.assign(page, ergonomicHub, { slug: 'ergonomic-loupes' })
}
