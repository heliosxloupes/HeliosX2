import type { ContentFaq, ContentSection, SeoLandingPage } from './seo-content'
import { lightFrom } from './lights'
import { magnificationPriceByProduct } from './pricing'

// Nov 2026: customer groups outside surgery and dentistry, added after real
// buyer requests from a permanent makeup artist and hair restoration clinics.
// One search intent per page: estheticians (hub), lash artists, permanent
// makeup and tattoo, hair transplant. Claims stay to what is true for every
// buyer (custom build, published prices, warranty, returns); the "110
// countries" clinician claim is not extended to beauty professionals.

const usd = (value: number) => `$${value.toLocaleString('en-US')}`
const from = (model: string) => usd(Math.min(...Object.values(magnificationPriceByProduct[model])))
const range = (model: string) => {
  const prices = Object.values(magnificationPriceByProduct[model])
  return `${usd(Math.min(...prices))}–${usd(Math.max(...prices))}`
}
const section = (title: string, body: string, bullets: string[] = []): ContentSection => ({ title, body, bullets })
const faq = (question: string, answer: string): ContentFaq => ({ question, answer })

const polaris = `Polaris (50,000 lux, 10 g at the frame, from ${usd(lightFrom('polaris'))})`
const published = '2026-11-12'
const warranty = 'Limited lifetime warranty and 30-day returns on non-prescription pairs.'
const fitSection = (who: string, extra: string[]): ContentSection =>
  section(
    'How HeliosX builds your pair',
    `Every HeliosX loupe is built for one person. You send two numbers, your pupillary distance and the working distance you measure at your own ${who}, and a loupe specialist reviews them before anything is made. Prices are published, frame choices are included, and prescription lenses can be built in for $200.`,
    [
      `Newton: Galilean 2.5x–3.5x, 40–50 g with frame, ${range('newton')}. /product/newton`,
      `Galileo: Galilean 2.5x–3.5x, six frame styles included, ${range('galileo')}. /product/galileo`,
      ...extra,
      'How to measure: /measurements.',
    ],
  )

export const beautyPagesNov2026: SeoLandingPage[] = [
  {
    slug: 'loupes-for-estheticians',
    title: 'Loupes for estheticians: surgical-grade magnification for skin work',
    metaTitle: 'Loupes for Estheticians: Magnification Guide | HeliosX',
    description: `Esthetician loupes for extractions, dermaplaning, electrolysis and brow work: magnification by service, loupes versus a mag lamp, and published prices from ${from('newton')}.`,
    heroKicker: 'Esthetician loupes',
    primaryKeyword: 'loupes for estheticians',
    relatedKeywords: [
      'esthetician loupes',
      'esthetician magnifying glasses',
      'magnifying glasses for estheticians',
      'loupes vs magnifying lamp',
      'electrolysis loupes',
      'dermaplaning magnification',
      'aesthetician loupes',
    ],
    audience: 'estheticians, medical aestheticians, electrologists and skin therapists',
    intro:
      'Estheticians do fine work on skin for hours, usually seated at the head of a treatment table. A mag lamp sits between you and the client and fixes your posture to the lens. Loupes put the magnification on your face instead: the view moves with you, your hands stay free, and the working distance is set to the way you already sit.',
    answer: `Most estheticians do best with 2.5x loupes built to a seated working distance of about 35–45 cm. 2.5x shows pores, vellus hair and blade edge clearly while keeping the whole cheek or brow in view; 3.0x–3.5x suits electrolysis and other single-follicle work. HeliosX Newton starts at ${from('newton')} and Galileo at ${from('galileo')}, each custom-built to your pupillary and working distance, with a lifetime warranty.`,
    procedureRows: [
      { procedure: 'Extractions and facials', magnification: '2.5x', distance: '35–45 cm, seated at the head of the table', pick: `/product/newton at 2.5x, from ${from('newton')}` },
      { procedure: 'Dermaplaning', magnification: '2.5x', distance: '35–45 cm', pick: '/product/galileo at 2.5x, for the wide field' },
      { procedure: 'Electrolysis', magnification: '3.0x–3.5x', distance: '30–40 cm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Microneedling and chemical peels', magnification: '2.5x', distance: '35–45 cm', pick: '/product/newton at 2.5x' },
      { procedure: 'Brow shaping, tweezing and waxing detail', magnification: '2.5x–3.0x', distance: '35–45 cm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Skin analysis', magnification: '2.5x', distance: '35–45 cm', pick: `Any Galilean pair with ${polaris}` },
    ],
    proofPoints: [
      'Built to your seated working distance and pupillary distance.',
      `Galilean loupes from ${from('newton')}, every price published.`,
      warranty,
    ],
    sections: [
      section(
        'Loupes or a mag lamp',
        'A magnifying lamp is a single lens on an arm. It works while your head stays in one spot behind it, and it sits in the space where your hands and tools need to be. Loupes are a pair of telescopes mounted in a frame, focused at one distance and aligned to your eyes, so you see in depth with both eyes and the magnified view follows wherever you look.',
        [
          'Mag lamp: low cost, shared between rooms, but one viewing position and a flat, single-lens image.',
          'Loupes: true depth perception, free hands, and a working distance set to your posture.',
          'Many estheticians keep the lamp for general light and wear loupes for the detailed part of the service.',
          'Clip-on and visor magnifiers focus only a few inches from the skin, which pulls your face down toward the client. Custom loupes focus at arm’s length.',
        ],
      ),
      section(
        'What magnification an esthetician needs',
        'More magnification is not better. Each step up narrows the field of view and the depth that stays in focus. For skin work you want the whole treatment zone visible, so you can see the feature you are working on and the skin around it at the same time.',
        [
          '2.5x: extractions, dermaplaning, peels, microneedling, skin analysis. The right first pair for most estheticians.',
          '3.0x: brow detail and tweezing, where single hairs matter.',
          '3.5x: electrolysis and other single-follicle work.',
          'Above 3.5x the field becomes small for face work; it is rarely useful in a treatment room.',
        ],
      ),
      section(
        'Working distance and posture',
        'Working distance is the gap between your eyes and the skin when you sit the way you want to sit. A loupe is sharp at that one distance. Measured correctly, it lets you work upright instead of leaning in to see. Measured wrong, it does the opposite, so measure it yourself, at your own table and stool height.',
        [
          'Seated esthetic work usually lands between 35 and 45 cm.',
          'Measure from the bridge of your nose to the client’s cheek, in your normal position.',
          `If neck strain is already a problem, Medusa is the ergonomic prismatic option: angled optics for a more upright head, working distance adjustable from 300 to 600 mm, from ${from('medusa')}. /product/medusa`,
          'Loupes support better posture. They are not a treatment for neck or back pain.',
        ],
      ),
      section(
        'Light',
        `Magnification shows more only when there is enough light on the skin. A loupe-mounted light puts the beam on your line of sight, so there is no shadow from your hands or head. ${polaris} suits 2.5x–3.5x work and fits every HeliosX frame.`,
        ['Lights and batteries: /product/lights.', 'Order the light with the loupes: lights are 10% off in the same order.'],
      ),
      section(
        'Loupes for lash, permanent makeup and hair restoration',
        'Each of these fields has its own distances and magnification, so each has its own guide.',
        [
          'Loupes for lash artists: /loupes-for-lash-artists.',
          'Loupes for permanent makeup and microblading: /loupes-for-permanent-makeup.',
          'Hair transplant loupes: /hair-transplant-loupes.',
        ],
      ),
      fitSection('treatment table', [`Medusa: ergonomic prismatic, adjustable working distance, ${range('medusa')}. /product/medusa`]),
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Medusa'],
    faqs: [
      faq('What are the best loupes for estheticians?', `A lightweight Galilean pair at 2.5x, built to your seated working distance. HeliosX Newton (40–50 g with frame, from ${from('newton')}) and Galileo (six frame styles, from ${from('galileo')}) are the two estheticians choose, both custom-built with a lifetime warranty.`),
      faq('What magnification do estheticians use?', '2.5x for extractions, dermaplaning, peels and skin analysis; 3.0x for brow detail; 3.5x for electrolysis. Higher magnification narrows the field too much for face work.'),
      faq('Are loupes better than a magnifying lamp?', 'For detailed work, yes. Loupes give depth perception with both eyes, keep your hands and the space over the client free, and focus at a distance that lets you sit upright. A mag lamp is still useful as general room light.'),
      faq('Can I get esthetician loupes with my prescription?', 'Yes. Prescription lenses can be built into the frame for $200, so you do not wear glasses under the loupes.'),
      faq('Do estheticians need a light on their loupes?', `It helps for extractions, electrolysis and skin analysis, where shadows hide detail. ${polaris} is the light most Galilean wearers choose.`),
      faq('How do I measure for esthetician loupes?', 'Two numbers: pupillary distance, from a phone app or an optician, and working distance, measured with a tape from your eyes to the client’s skin while you sit in your normal position. A HeliosX loupe specialist checks both before production.'),
    ],
    datePublished: published,
    dateModified: published,
  },
  {
    slug: 'loupes-for-lash-artists',
    title: 'Loupes for lash artists: see every lash without leaning in',
    metaTitle: 'Loupes for Lash Artists: Lash Extension Magnification | HeliosX',
    description: `Lash extension loupes for classic, volume and mega volume sets: magnification by set type, working distance at the lash bed, and published prices from ${from('newton')}.`,
    heroKicker: 'Lash artist loupes',
    primaryKeyword: 'loupes for lash artists',
    relatedKeywords: [
      'lash extension magnifying glasses',
      'lash tech loupes',
      'magnifying glasses for lash extensions',
      'lash artist magnifying glasses',
      'lash loupes',
      'glasses for lash techs',
      'eyelash extension loupes',
    ],
    audience: 'lash artists, lash technicians and lash educators',
    intro:
      'A full set is two to three hours of isolating one natural lash at a time, a fraction of a millimetre from the lid, with your head held still over the client. Most lash magnifiers focus a few inches away and pull you down toward the face. Loupes are built the other way round: the focus is set to the distance at which you sit comfortably, and the magnification comes to you.',
    answer: `Most lash artists do best with 2.5x loupes built to a working distance of about 30–40 cm, measured seated at the lash bed. 2.5x separates individual lashes and shows isolation and bonding clearly while both eyes stay in view; 3.0x–3.5x helps with mega volume fans and inner corners. HeliosX Newton weighs 40–50 g with the frame and starts at ${from('newton')}, custom-built to your pupillary and working distance.`,
    procedureRows: [
      { procedure: 'Classic sets', magnification: '2.5x', distance: '30–40 cm, seated at the lash bed', pick: `/product/newton at 2.5x, from ${from('newton')}` },
      { procedure: 'Hybrid and volume sets', magnification: '2.5x–3.0x', distance: '30–40 cm', pick: '/product/galileo at 3.0x' },
      { procedure: 'Mega volume and handmade fans', magnification: '3.0x–3.5x', distance: '30–40 cm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Inner corners and lower lashes', magnification: '3.0x–3.5x', distance: '30–40 cm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Fills, removals and stickie checks', magnification: '2.5x', distance: '30–40 cm', pick: '/product/newton at 2.5x' },
      { procedure: 'Lash lifts and tints', magnification: '2.5x', distance: '30–40 cm', pick: '/product/newton at 2.5x' },
    ],
    proofPoints: [
      'Focused at your own distance from the lash bed, not a few inches from the face.',
      `Newton: 40–50 g with frame, from ${from('newton')}.`,
      warranty,
    ],
    sections: [
      section(
        'Why lash artists move from magnifier glasses to loupes',
        'Clip-on and visor magnifiers are reading lenses. The stronger they are, the closer they focus, so a 2.5x pair has you a hand’s width from the client’s eyes. Loupes are small telescopes: they magnify at a distance. A pair built for 35 cm lets you sit back with your shoulders down and still see each lash as a separate strand.',
        [
          'Reading-lens magnifiers: focus at roughly 10–15 cm at higher powers.',
          'Custom loupes: focus at the distance you measure, usually 30–40 cm for lash work.',
          'Both eyes see the same magnified image in depth, which is what makes isolation easier.',
          'Aligned to your pupillary distance, so there is no double image or eye fatigue from a generic fit.',
        ],
      ),
      section(
        'What magnification for lash extensions',
        'Lash work is about telling one lash from its neighbour and seeing where adhesive sits. 2.5x does that for most artists and keeps the full lash line in view. Step up only if your sets demand it, because higher magnification shows a smaller area and a shallower zone in focus.',
        [
          '2.5x: classic and hybrid sets, fills, removals, lifts. The usual first pair.',
          '3.0x: volume sets and artists who want a closer look at the base of each fan.',
          '3.5x: mega volume, very fine diameters, inner corners.',
          'If 0.03 and 0.05 lashes are your daily work, choose 3.0x or 3.5x.',
        ],
      ),
      section(
        'Weight, because you wear them for hours',
        `A lash artist can spend six or more hours a day looking down through loupes. Weight on the nose is what decides whether you keep them on. Newton is the lightest HeliosX loupe at 40–50 g with the frame; Galileo adds six frame styles so the fit suits your face.`,
        [
          'A retainer strap keeps the loupes steady when you look down: /loupe-accessories.',
          'Prescription lenses can be built in for $200.',
          `For artists whose neck is the limit, Medusa angles the optics so the head stays more upright, with working distance adjustable from 300 to 600 mm, from ${from('medusa')}. /product/medusa`,
        ],
      ),
      section(
        'Light at the lash line',
        `Dark lashes on a dark lash line need light that comes from where your eyes are. A loupe-mounted light removes the shadow your head and tweezers throw under a ring light. ${polaris} has the widest spot in the range, which suits the short distances of lash work.`,
        ['Keep brightness low near the eyes; the client’s eyes stay closed and taped as usual.', 'Lights and batteries: /product/lights.'],
      ),
      fitSection('lash bed', ['Loupes for estheticians, including brow and skin services: /loupes-for-estheticians.', 'Permanent makeup and microblading: /loupes-for-permanent-makeup.']),
    ],
    recommendedProducts: ['Newton', 'Galileo', 'Medusa'],
    faqs: [
      faq('What are the best loupes for lash artists?', `A lightweight 2.5x Galilean pair built to your own working distance. HeliosX Newton (40–50 g with frame, from ${from('newton')}) is the lightest; Galileo (from ${from('galileo')}) offers 2.5x, 3.0x and 3.5x in six frame styles.`),
      faq('What magnification is best for lash extensions?', '2.5x for classic and hybrid sets, 3.0x for volume, 3.5x for mega volume and inner corners. Higher than 3.5x makes the field too small to follow the lash line.'),
      faq('Are loupes better than lash magnifying glasses?', 'Yes for posture and image quality. Magnifying glasses focus a few inches from the client, so you lean in. Loupes focus at the distance you choose, usually 30–40 cm, and give a sharper image with depth.'),
      faq('How far should I sit from the client when lashing with loupes?', 'At whatever distance you are comfortable and upright, typically 30–40 cm from your eyes to the lash line. Measure it at your own lash bed and stool height; the loupes are built to that number.'),
      faq('Can I wear lash loupes with glasses or a prescription?', 'Your prescription can be built into the loupe frame for $200, so you wear one pair instead of two.'),
      faq('Will loupes help my neck and back as a lash tech?', 'Loupes built to the right working distance let you sit more upright because you no longer lean in to see. They are not a treatment for pain, and stool height and client position matter too.'),
    ],
    datePublished: published,
    dateModified: published,
  },
  {
    slug: 'loupes-for-permanent-makeup',
    title: 'Loupes for permanent makeup: precision for brows, lips and liner',
    metaTitle: 'Loupes for Permanent Makeup & Microblading | HeliosX',
    description: `PMU loupes for microblading, powder brows, lip blush and eyeliner, plus fine-line tattooing: magnification by procedure and published prices from ${from('newton')}.`,
    heroKicker: 'Permanent makeup loupes',
    primaryKeyword: 'loupes for permanent makeup',
    relatedKeywords: [
      'PMU magnifying glasses',
      'microblading loupes',
      'magnifying glasses for permanent makeup',
      'PMU loupes',
      'microblading magnifying glasses',
      'tattoo magnifying glasses',
      'loupes for tattoo artists',
      'scalp micropigmentation loupes',
    ],
    audience: 'permanent makeup artists, microblading artists, paramedical tattoo artists and fine-line tattoo artists',
    intro:
      'Permanent makeup is drawn once and worn for years. A hair stroke is a fraction of a millimetre wide, and the difference between crisp and blurred is whether you could see the blade or needle meet the skin. Loupes give you that view with both eyes, in depth, from a distance that keeps your hands free and your back straight.',
    answer: `Most permanent makeup artists do best with 2.5x–3.0x loupes built to a working distance of about 30–40 cm. 2.5x suits powder brows and lip blush, where you need the whole feature in view for symmetry; 3.0x–3.5x suits microblading hair strokes and eyeliner. HeliosX Galileo offers 2.5x, 3.0x and 3.5x from ${from('galileo')}, and Newton starts at ${from('newton')}, each custom-built with a lifetime warranty.`,
    procedureRows: [
      { procedure: 'Microblading and nano hair strokes', magnification: '3.0x–3.5x', distance: '30–40 cm, seated at the head', pick: '/product/galileo at 3.0x' },
      { procedure: 'Powder and ombré brows', magnification: '2.5x', distance: '30–40 cm', pick: `/product/newton at 2.5x, from ${from('newton')}` },
      { procedure: 'Lip blush', magnification: '2.5x', distance: '30–40 cm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Eyeliner and lash enhancement', magnification: '3.0x–3.5x', distance: '30–40 cm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Areola and paramedical tattooing', magnification: '2.5x', distance: '35–45 cm', pick: '/product/galileo at 2.5x' },
      { procedure: 'Scalp micropigmentation', magnification: '2.5x–3.0x', distance: '35–45 cm, seated or standing', pick: '/product/medusa, adjustable distance' },
      { procedure: 'Fine-line and micro-realism tattooing', magnification: '2.5x–3.5x', distance: '35–50 cm', pick: '/product/galileo at 3.0x' },
    ],
    proofPoints: [
      'See each stroke in depth, with both eyes, at arm’s length.',
      `Galileo 2.5x–3.5x from ${from('galileo')}; Newton from ${from('newton')}.`,
      warranty,
    ],
    sections: [
      section(
        'What loupes change in permanent makeup',
        'Depth is the skill in PMU: too shallow and pigment does not hold, too deep and strokes blur and heal cool. A ring light and a visor magnifier show you the surface. Loupes show the surface in three dimensions, so you can watch the blade angle, the stretch and the stroke spacing as you work.',
        [
          'Consistent stroke spacing and direction in microblading.',
          'Clean edges on eyeliner and lip borders.',
          'Easier to see lymph and pigment saturation between passes.',
          'A working distance that keeps your face away from the procedure area.',
        ],
      ),
      section(
        'Magnification by procedure',
        'Choose the magnification for the work you do most. Symmetry needs a wide field; hair strokes need detail. Many artists work the whole menu at 2.5x or 3.0x, and you can always step back and check symmetry with the loupes flipped down or off.',
        [
          '2.5x: powder brows, lip blush, areola work, mapping checks.',
          '3.0x: the all-round choice if microblading is most of your book.',
          '3.5x: nano strokes, eyeliner and lash enhancement.',
          'Above 3.5x the field is too small to judge a brow as a whole.',
        ],
      ),
      section(
        'Light and pigment color',
        `Loupes need light, and pigment needs honest light. A loupe-mounted LED puts a bright, shadow-free spot exactly where you are looking. ${polaris} suits 2.5x–3.5x. Confirm pigment choice and healed-color checks under your normal room light as well, as you do today.`,
        ['Lights and batteries: /product/lights.', 'Lights are 10% off when ordered with loupes.'],
      ),
      section(
        'Posture over a two-hour brow',
        `PMU artists lean over the head of the bed for long, still stretches. A loupe built to your measured working distance removes the reason to lean: the image is sharp where you sit upright. If your neck is already the limit, Medusa uses angled prismatic optics so you look down with your eyes while your head stays up, and its working distance adjusts from 300 to 600 mm.`,
        [`Medusa: ${range('medusa')}. /product/medusa`, 'Loupes support posture; they do not treat pain. Bed height and stool position still matter.'],
      ),
      section(
        'Fine-line tattoo artists',
        'Single-needle, micro-realism and fine script put the same demands on your eyes as PMU, at longer sessions and more varied positions. Galilean 2.5x–3.5x covers most of it. Because tattooing moves you around the client, measure the position you hold most, or choose Medusa for an adjustable working distance.',
        ['Measure seated and standing if you work both ways.'],
      ),
      fitSection('treatment bed', ['Loupes for estheticians: /loupes-for-estheticians.', 'Loupes for lash artists: /loupes-for-lash-artists.']),
    ],
    recommendedProducts: ['Galileo', 'Newton', 'Medusa'],
    faqs: [
      faq('What are the best loupes for permanent makeup artists?', `HeliosX Galileo at 2.5x or 3.0x is the pair most PMU artists should start with: a wide, deep field, six frame styles, from ${from('galileo')}. Newton (from ${from('newton')}) is the lighter, lower-priced Galilean option.`),
      faq('What magnification is best for microblading?', '3.0x for most artists, 3.5x for nano strokes. 2.5x is enough if you mainly do powder brows and want the whole brow in view.'),
      faq('Are loupes better than PMU magnifying glasses with LED?', 'Yes. LED magnifying glasses are reading lenses that focus close to the face. Loupes are aligned to your eyes and focused at the distance you measure, so the image is sharper, has real depth, and lets you sit upright.'),
      faq('Do tattoo artists use loupes?', 'Fine-line, micro-realism and paramedical tattoo artists do, usually at 2.5x–3.5x. Measure the working distance in the position you hold most.'),
      faq('Can I see pigment color accurately through loupes?', 'The optics are high-grade glass with a true-color image. Use a loupe light for the work itself and confirm pigment choices under your normal room light too.'),
      faq('Can loupes be made with my prescription?', 'Yes, built into the frame for $200.'),
    ],
    datePublished: published,
    dateModified: published,
  },
  {
    slug: 'hair-transplant-loupes',
    title: 'Hair transplant loupes: magnification for FUE, grafts and placement',
    metaTitle: 'Hair Transplant Loupes: FUE & Graft Placement | HeliosX',
    description: `Loupes for hair restoration surgeons and technicians: magnification for FUE extraction, graft dissection, site making and placement, with published prices from ${from('galileo')}.`,
    heroKicker: 'Hair restoration loupes',
    primaryKeyword: 'hair transplant loupes',
    relatedKeywords: [
      'loupes for hair transplant',
      'FUE loupes',
      'hair restoration loupes',
      'hair transplant technician loupes',
      'loupes for graft placement',
      'hair transplant magnification',
      'FUE magnifying glasses',
    ],
    audience: 'hair restoration surgeons, hair transplant technicians and clinic teams',
    intro:
      'A hair transplant is thousands of repetitions of the same small act: score, extract, check, place. A session can run six to eight hours, and every graft is a follicular unit of one to four hairs handled by its edges. The whole team works under magnification, and the right loupes decide how well each person sees the follicle and how they feel at graft three thousand.',
    answer: `Most hair restoration work is done at 3.0x–4.0x. Technicians placing grafts favor Galilean 3.0x–3.5x for its wide, deep field; FUE extraction and site making are usually done at 3.5x–5.0x. HeliosX Galileo starts at ${from('galileo')} and Kepler 4.0x–6.0x at ${from('kepler')}, and Medusa adds an adjustable 300–600 mm working distance for teams who sit and stand through a long case. Every pair is custom-built, with a lifetime warranty.`,
    procedureRows: [
      { procedure: 'FUE punch scoring and extraction', magnification: '3.5x–5.0x', distance: '30–45 cm, seated behind the patient', pick: `/product/kepler at 4.0x, from ${from('kepler')}` },
      { procedure: 'Recipient site making', magnification: '3.0x–4.0x', distance: '35–45 cm', pick: '/product/galileo at 3.5x' },
      { procedure: 'Graft placement', magnification: '3.0x–3.5x', distance: '30–45 cm', pick: `/product/galileo at 3.0x, from ${from('galileo')}` },
      { procedure: 'Graft inspection, counting and trimming', magnification: '3.5x–5.0x', distance: '30–40 cm at the bench', pick: '/product/kepler at 5.0x' },
      { procedure: 'Hairline design, eyebrow and beard work', magnification: '3.5x–4.0x', distance: '35–45 cm', pick: '/product/medusa at 4.0x' },
      { procedure: 'Strip (FUT) slivering and dissection', magnification: 'Stereo microscope', distance: 'Bench', pick: 'Loupes for placement; the microscope leads for strip dissection' },
    ],
    proofPoints: [
      'Galilean 3.0x–3.5x for placement, prismatic 4.0x–6.0x for extraction.',
      'Medusa adjusts working distance from 300 to 600 mm for long cases.',
      warranty,
    ],
    sections: [
      section(
        'Magnification for each stage of a hair transplant',
        'Each stage asks for something different. Extraction needs detail, so you can read the exit angle of the hair and centre the punch. Placement needs field and depth, so you can move quickly from site to site without refocusing. That is why many clinics equip the surgeon and the placing team differently.',
        [
          'FUE extraction: 3.5x–5.0x. Enough detail to follow hair angle and avoid transection.',
          'Site making: 3.0x–4.0x, with the whole zone in view to keep density and direction even.',
          'Placement: 3.0x–3.5x. A wide, deep field keeps pace high over thousands of grafts.',
          'Graft checks at the bench: 3.5x–5.0x. Strip dissection is still done under a stereo microscope.',
        ],
      ),
      section(
        'For hair transplant technicians',
        `Technicians place and check more grafts in a day than anyone else in the room. The loupe that works is the one that stays light on the nose and sharp across a full row of sites. Galileo at 3.0x or 3.5x gives a wide field and deep focus in a lightweight frame, from ${from('galileo')}; Newton offers the same magnifications at 40–50 g with the frame, from ${from('newton')}.`,
        [
          'Each technician needs their own pair: loupes are built to one person’s pupillary and working distance.',
          'Clinics equipping a team can ask a loupe specialist to plan magnifications by role: /contact.',
          '/product/galileo and /product/newton',
        ],
      ),
      section(
        'For hair restoration surgeons',
        `Extraction and site making reward more magnification. Kepler is the conventional prismatic loupe for 4.0x, 5.0x and 6.0x detail, from ${from('kepler')}. Surgeons who score and extract for hours often choose an ergonomic prismatic pair instead: Medusa covers 3.0x–8.5x and its working distance adjusts from 300 to 600 mm as you move around the scalp.`,
        [`Kepler: ${range('kepler')}. /product/kepler`, `Medusa: ${range('medusa')}. /product/medusa`, `Apollo: ergonomic prismatic at a fixed 420–550 mm, ${range('apollo')}. /product/apollo`],
      ),
      section(
        'Posture across a six to eight hour session',
        'Extraction from the donor area is done leaning over the back of a prone or seated patient, often for hours without a break. Working distance and the angle of the optics matter more here than in almost any other field. Build the loupe to the distance at which you sit upright, and consider ergonomic prismatic optics that let your eyes look down while your head stays up.',
        [
          'Measure seated behind the patient at your real chair height.',
          'If you change position between donor and recipient areas, choose Medusa or measure both.',
          'Loupes support posture; they are not a treatment for neck or back pain.',
        ],
      ),
      section(
        'Light on the scalp',
        `Follicles sit in small, shadowed fields, and blood on the scalp absorbs light. A loupe-mounted light keeps the beam on your line of sight. ${polaris} suits 3.0x–3.5x; Vega (70,000 lux, from ${usd(lightFrom('vega'))}) suits 4.0x; Rigel (100,000 lux) suits 5.0x–6.0x.`,
        ['Lights and batteries: /product/lights.', 'Related: Mohs and dermatologic surgery loupes: /dermatology-mohs-surgery-loupes.'],
      ),
      fitSection('procedure chair', [`Kepler: conventional prismatic 4.0x–6.0x, ${range('kepler')}. /product/kepler`, `Medusa: ergonomic prismatic, adjustable working distance, ${range('medusa')}. /product/medusa`]),
    ],
    recommendedProducts: ['Galileo', 'Kepler', 'Medusa'],
    faqs: [
      faq('What are the best loupes for hair transplant surgery?', `For graft placement, HeliosX Galileo at 3.0x–3.5x (from ${from('galileo')}). For FUE extraction and site making, Kepler at 4.0x–5.0x (from ${from('kepler')}) or Medusa, which adds ergonomic optics and an adjustable working distance.`),
      faq('What magnification is used for FUE?', 'Most FUE extraction is done at 3.5x–5.0x. That shows the hair’s exit angle and the punch position clearly enough to limit transection while keeping a workable field.'),
      faq('What magnification do hair transplant technicians use for placing grafts?', '3.0x–3.5x. A Galilean loupe at that power has a wide field and deep focus, which keeps placement fast and comfortable over thousands of grafts.'),
      faq('Do loupes replace the microscope in hair restoration?', 'Not for strip dissection, where the stereo microscope leads. Loupes are the standard tool for FUE extraction, site making, placement and quick graft checks.'),
      faq('Can a clinic order loupes for the whole team?', 'Yes. Each pair is built to one person’s measurements, so we take pupillary and working distance for every team member and plan magnification by role. Contact a loupe specialist: /contact.'),
      faq('Do hair transplant loupes need a light?', `Yes for extraction and site making. ${polaris} suits 3.0x–3.5x, and brighter lights are matched to higher magnification.`),
    ],
    datePublished: published,
    dateModified: published,
  },
]
