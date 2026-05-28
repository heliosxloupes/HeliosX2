import type { CmsProduct } from './ecommerce-types'

export const fallbackProducts: CmsProduct[] = [
  {
    slug: 'medusa',
    name: 'Medusa Surgical Loupes',
    shortName: 'Medusa',
    description:
      'Ergonomic prismatic loupes with adjustable working distance, built for surgeons and clinicians who move between sitting and standing positions without sacrificing clarity, depth, or posture.',
    cardTagline: 'Ergonomic prismatic loupes with real-time adjustable working distance.',
    cardHighlight: 'Best for posture-flexible precision work.',
    cardBullets: [
      'Real-time adjustable working distance',
      '300-600 mm working distance',
      'Tailored fixed IPD',
      'Enhanced depth perception',
    ],
    highlights: [
      'Ergonomic prismatic optical system.',
      'Adjustable 300-600 mm working distance.',
      'Fixed interpupillary distance tailored to your specifications.',
      'Enhanced depth perception with superior clarity.',
      'Ergonomic comfort for the neck and spine.',
    ],
    magnifications: ['3.0x', '4.0x', '5.0x', '6.0x', '8.0x', '8.5x'],
    basePrice: 710,
    priceLabel: '$710-$1,090',
    isAvailable: true,
    cardImageSrc: '/Medusa/MedusaMain.png',
    cardImageAlt: 'HeliosX Medusa loupes product image',
    imagePosition: '34% center',
    displayOrder: 1,
    specTitle: 'Medusa product specifications.',
    specDescription:
      'Medusa is an ergonomic prismatic loupe system designed around adjustable working distance and custom fit. It adapts to the surgeon rather than forcing the surgeon into one fixed operating posture.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Ergonomic prismatic optical system tuned for posture-aware procedures.',
          'Real-time adjustable working distance for seated or standing work.',
          'Fixed interpupillary distance tailored to your specifications at order.',
          'Built for maximum ergonomic comfort through long cases.',
          'Weight with frame ranges from 56g at 3.0x to 65g at 8.5x.',
        ],
      },
      {
        title: 'Optics & fit',
        items: [
          'Enhanced depth perception across the operative field.',
          'Superior edge-to-edge clarity at every magnification setting.',
          'Custom IPD alignment for a stable visual axis.',
          'Designed to reduce neck and spine strain.',
          'Prescription compatible with standard ophthalmic refraction.',
        ],
      },
      {
        title: 'Magnification specifications',
        items: [
          '3.0x — WD 350-600 mm (adjustable), FOV 80 mm, DoF 110 mm, weight with frame 56 g.',
          '4.0x — WD 300-600 mm (adjustable), FOV 80 mm, DoF 110 mm, weight with frame 56 g.',
          '5.0x — WD 300-600 mm (adjustable), FOV 75 mm, DoF 70 mm, weight with frame 58 g.',
          '6.0x — WD 300-600 mm (adjustable), FOV 75 mm, DoF 70 mm, weight with frame 58 g.',
          '8.0x — WD 350-600 mm (adjustable), FOV 50 mm, DoF 40 mm, weight with frame 65 g.',
          '8.5x — WD 350-600 mm (adjustable), FOV 50 mm, DoF 40 mm, weight with frame 65 g.',
        ],
      },
    ],
    heroImages: [
      { src: '/Medusa/MedusaStudioCloseup.png', alt: 'Medusa loupes closeup product detail' },
      { src: '/Medusa/MedusaDoctorBlonde.png', alt: 'Doctor wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaDoctorMale.png', alt: 'Clinician wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaDoctorSeated.png', alt: 'Doctor seated with Medusa surgical loupes' },
      { src: '/Medusa/MedusaStudioDark.png', alt: 'Medusa loupes in dark studio setting' },
    ],
    specImages: [
      { src: '/Medusa/MedusaDoctorBlonde.png', alt: 'Doctor wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaDoctorMale.png', alt: 'Clinician wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaStudioCloseup.png', alt: 'Medusa loupes closeup product detail' },
      { src: '/Medusa/MedusaDoctorSeated.png', alt: 'Doctor seated with Medusa surgical loupes' },
      { src: '/Medusa/MedusaStudioDark.png', alt: 'Medusa loupes in dark studio setting' },
    ],
  },
  {
    slug: 'apollo',
    name: 'Apollo Surgical Loupes',
    shortName: 'Apollo',
    description:
      'Ergonomic prismatic loupes for detail-obsessed operators. Apollo pairs posture-aware optics with lightweight frames so you can work precisely without losing balance.',
    cardTagline: 'Ergonomic prismatic clarity for detail-obsessed operators.',
    cardHighlight: 'Best for fine aesthetic & micro-oriented work.',
    cardBullets: ['Next-generation optics', 'Increased working precision', 'Ergonomic frame options'],
    highlights: [
      'Ergonomic prismatic optics tuned for detail work.',
      'Lightweight frame options that stay balanced.',
      'Extended working distance control.',
      'Prescription capable and light-source ready.',
    ],
    magnifications: ['3.0x', '4.0x', '5.0x', '6.0x'],
    basePrice: 740,
    priceLabel: '$740-$1,115',
    isAvailable: true,
    cardImageSrc: '/Apollo/ApollomainProduct(Notext).png',
    cardImageAlt: 'HeliosX Apollo loupes product image',
    displayOrder: 2,
    specTitle: 'Apollo product specifications.',
    specDescription:
      'Engineered for operators who want ergonomic prismatic magnification without sacrificing comfort. Apollo delivers crisp resolution, reliable light compatibility, and a frame that stays comfortable when precision matters most.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Balanced chassis that keeps weight off your neck.',
          'Net weight with frame: 55 – 58.2 g across all magnifications.',
          'Durable metal barrels with refined finish.',
          'Prescription ready with multiple frame geometries.',
        ],
      },
      {
        title: 'Optics & glass',
        items: [
          'Premium optical glass with advanced coatings.',
          'Enhanced contrast for microsuturing and fine aesthetic work.',
          'Transmittance tuned to keep lighting neutral and bright.',
          'IPD range: 54-72 mm with smooth adjustments.',
        ],
      },
      {
        title: 'Magnification specifications',
        items: [
          'Magnification options: 3.0x, 4.0x, 5.0x, 6.0x.',
          'Working distance: select 420 mm, 450 mm, 500 mm, or 550 mm at order.',
          'Field of view: 50 – 105 mm (varies with magnification and working distance).',
          'Net weight with frame: 55 – 58.2 g.',
          'Optimized for LED light packs and fixed mounts.',
        ],
      },
    ],
    heroImages: [
      { src: '/Apollo/Apollofinal.png', alt: 'Apollo surgical loupes' },
      { src: '/Apollo/Apollo3xFemale2.png', alt: 'Doctor wearing Apollo loupes' },
      { src: '/Apollo/Blondcloseup.png', alt: 'Apollo closeup portrait' },
      { src: '/Apollo/Apollo3xAsian.png', alt: 'Apollo loupes in use' },
    ],
    specImages: [
      { src: '/Apollo/Apollowomanscrubbing.png', alt: 'Apollo loupes during scrub prep' },
      { src: '/Apollo/Apollo3xFemale.png', alt: 'Apollo loupes closeup portrait' },
      { src: '/Apollo/Apollomanequin.png', alt: 'Apollo loupes on mannequin' },
    ],
  },
  {
    slug: 'galileo',
    name: 'Galileo Surgical Loupes',
    shortName: 'Galileo',
    description:
      'Versatile, lightweight optics designed for operators who want precision without overhead. Galileo balances field of view, depth, and comfort for high-precision surgical and dental work.',
    cardTagline: 'Versatile field of view for general and reconstructive work.',
    cardHighlight: 'Best for broad use and training.',
    cardBullets: ['Lightweight', 'Modern frame geometry', 'Everyday precision'],
    highlights: [
      'Light weight, reduced volume barrels.',
      'Multi-layer coated premium lenses.',
      'Extra-wide field of view & depth.',
      'Prescription compatible & light-source ready.',
    ],
    magnifications: ['2.5x', '3.0x', '3.5x'],
    basePrice: 270,
    priceLabel: '$270-$300',
    isAvailable: true,
    cardImageSrc: '/Galileo/GalileoMainProduct(notext).png',
    cardImageAlt: 'HeliosX Galileo loupes product image',
    displayOrder: 3,
    specTitle: 'Galileo product specifications.',
    specDescription:
      'Designed for high-precision work where clarity, color fidelity, and depth perception actually matter.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Volume reduced by ~30% while maintaining performance.',
          'Weight: 35g / 36g / 37g (2.5x / 3.0x / 3.5x).',
          'Barrels: metal construction, tuned for durability.',
          'Prescription compatible straight out of the box.',
        ],
      },
      {
        title: 'Optics & glass',
        items: [
          'A+ grade imported optical glass.',
          'Multi-layer coated lenses, high color fidelity.',
          'Transmittance > 98% for bright, neutral images.',
          'Extra-wide field of view and generous depth of field for stable focus.',
          'IPD range: 54-72 mm.',
        ],
      },
      {
        title: 'Magnification data',
        items: [
          '2.5x - WD 300-580 mm, FOV 150-170 mm, DOF 200 mm.',
          '3.0x - WD 300-580 mm, FOV 130-150 mm, DOF 200 mm.',
          '3.5x - WD 300-580 mm, FOV 110-130 mm, DOF 200 mm.',
          'Compatible with fixed LED light sources and packs.',
        ],
      },
    ],
    heroImages: [
      { src: '/Galileo/galileoproduct.png', alt: 'Galileo product' },
      { src: '/Galileo/BlackguyGalileo.png', alt: 'Doctor wearing Galileo loupes' },
      { src: '/Galileo/BlonddirectNew.png', alt: 'Galileo closeup portrait' },
      { src: '/Oldguy4Galileo.png', alt: 'Galileo loupes in use' },
    ],
    specImages: [
      { src: '/Galileo/cutegirlhallway.png', alt: 'Surgeon walking to the OR' },
      { src: '/Galileo/girlinmirror.png', alt: 'Surgeon fitting loupes in mirror' },
      { src: '/Galileo/lockerroom.png', alt: 'Locker room preparation with loupes' },
    ],
  },
  {
    slug: 'newton',
    name: 'Newton Surgical Loupes',
    shortName: 'Newton',
    description:
      'Featherweight optics built for clinicians who live in their loupes. Newton keeps fatigue low with a balanced chassis and crystal-clear glass for daily procedures.',
    cardTagline: 'Ultra-light performance for long cases and full OR days.',
    cardHighlight: 'Best when comfort is critical.',
    cardBullets: ['Ultra-light chassis', 'Comfort-driven design', 'Low fatigue'],
    highlights: [
      'Ultra-light barrels and balanced chassis.',
      'Multi-layer coated lenses with high fidelity.',
      'Wide field of view with dependable depth.',
      'Prescription ready and light-source compatible.',
    ],
    magnifications: ['2.5x', '3.0x', '3.5x'],
    basePrice: 270,
    priceLabel: '$270-$300',
    isAvailable: true,
    cardImageSrc: '/Newton/NewtonMainProduct(notext).png',
    cardImageAlt: 'HeliosX Newton loupes product image',
    displayOrder: 4,
    specTitle: 'Newton product specifications.',
    specDescription:
      'Built for long cases and back-to-back days in the OR. Newton balances weight, clarity, and durability so you can stay focused without strain.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Featherweight chassis that prioritizes balance.',
          'Weight with frame: 40 g (2.5x) / 45 g (3.0x) / 50 g (3.5x).',
          'Metal barrels for dependable longevity.',
          'Prescription friendly with immediate compatibility.',
        ],
      },
      {
        title: 'Optics & glass',
        items: [
          'A+ grade optical glass with multi-layer coatings.',
          'Neutral color rendering with high transmittance.',
          'Even illumination and crisp edge-to-edge clarity.',
          'IPD range: 54-72 mm with quick adjustments.',
        ],
      },
      {
        title: 'Magnification specifications',
        items: [
          '2.5x — WD 300-550 mm, FOV 80-120 mm, DoF 200 mm, weight with frame 40 g.',
          '3.0x — WD 300-550 mm, FOV 70-100 mm, DoF 200 mm, weight with frame 45 g.',
          '3.5x — WD 300-550 mm, FOV 60-100 mm, DoF 200 mm, weight with frame 50 g.',
          'Compatible with fixed LED lights and battery packs.',
        ],
      },
    ],
    heroImages: [
      { src: '/Newton/NewtonMain.png', alt: 'Newton surgical loupes' },
      { src: '/Newton/NewtonAsian2.png', alt: 'Doctor wearing Newton loupes' },
      { src: '/Newton/NewtonAsian3.png', alt: 'Newton closeup portrait' },
      { src: '/Newton/H2.3.png', alt: 'Newton loupes product view' },
    ],
    specImages: [
      { src: '/Newton/H2.1.png', alt: 'Newton surgeon prepping in hallway' },
      { src: '/Newton/H2.2.png', alt: 'Newton loupes being fitted' },
      { src: '/Newton/H2.3.png', alt: 'Newton loupes on mannequin' },
    ],
  },
  {
    slug: 'kepler',
    name: 'Kepler Surgical Loupes',
    shortName: 'Kepler',
    description:
      'Maximum magnification with a balanced footprint. Kepler is built for advanced users who need long-case comfort, high contrast, and uncompromised visibility.',
    cardTagline: 'Maximal magnification for demanding micro and super-micro.',
    cardHighlight: 'Best for high-level microsurgery.',
    cardBullets: ['Signature optical stack', 'Upgraded contrast & resolution', 'Designed for advanced users'],
    highlights: [
      'High-magnification optical stack for micro work.',
      'Stabilized contrast and color for critical detail.',
      'Balanced weight distribution for long procedures.',
      'Prescription friendly and LED light compatible.',
    ],
    magnifications: ['4.0x', '5.0x', '6.0x'],
    basePrice: 460,
    priceLabel: '$460-$520',
    isAvailable: true,
    cardImageSrc: '/Keppler/KepplerMainProduct(Notext).png',
    cardImageAlt: 'HeliosX Kepler loupes product image',
    displayOrder: 5,
    specTitle: 'Kepler product specifications.',
    specDescription:
      'For operators pushing magnification to the edge. Kepler keeps resolution, contrast, and ergonomics in sync.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Engineered chassis that spreads weight evenly.',
          'Weight with frame: 68 g (4.0x) / 75 g (5.0x) / 85 g (6.0x).',
          'Rigid metal barrels with reinforced mounts.',
          'Prescription capable out of the box.',
        ],
      },
      {
        title: 'Optics & glass',
        items: [
          'Premium coated glass for contrast-heavy cases.',
          'Neutral color reproduction with high transmittance.',
          'Edge-to-edge clarity even at higher magnification.',
          'IPD range: 54-72 mm with precise adjustments.',
        ],
      },
      {
        title: 'Magnification specifications',
        items: [
          '4.0x — FOV 60 – 75 mm across WD options, DoF 80 mm, weight with frame 68 g.',
          '5.0x — FOV 55 – 70 mm across WD options, DoF 80 mm, weight with frame 75 g.',
          '6.0x — FOV 50 – 65 mm across WD options, DoF 80 mm, weight with frame 85 g.',
          'Working distance: 280-600 mm range. Tuned to your operating posture post-purchase across four configurations (S 280-380 / M 360-460 / L 440-540 / XL 500-600 mm).',
          'Field of view adjustments are configurable after purchase across the 4x to 6x range.',
          'Optimized for LED light kits and fixed mounts.',
        ],
      },
    ],
    heroImages: [
      { src: '/Keppler/KepplerNewmain.png', alt: 'Kepler surgical loupes' },
      { src: '/Keppler/KepplerMain.png', alt: 'Kepler loupes product view' },
      { src: '/Keppler/Keppler4.png', alt: 'Kepler side view' },
      { src: '/Keppler/Keppler2.png', alt: 'Kepler alternate view' },
    ],
    specImages: [
      { src: '/Keppler/Kfinal.jpg', alt: 'Kepler loupes mid-procedure' },
      { src: '/Keppler/Keplerextra2.png', alt: 'Kepler loupes angled closeup' },
      { src: '/Keppler/KepplerMain2.png', alt: 'Kepler loupes on mannequin' },
    ],
  },
]

export function getFallbackProduct(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug) ?? null
}
