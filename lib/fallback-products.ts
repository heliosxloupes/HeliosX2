import type { CmsProduct } from './ecommerce-types'

export const fallbackProducts: CmsProduct[] = [
  {
    slug: 'medusa',
    name: 'Medusa Surgical Loupes',
    shortName: 'Medusa',
    description:
      'Adjustable working-distance loupes built for surgeons who move between sitting and standing positions without sacrificing clarity, depth, or posture.',
    cardTagline: 'Adjustable working distance for seated or standing surgical posture.',
    cardHighlight: 'Best for posture-flexible precision work.',
    cardBullets: [
      '300-600 mm working distance',
      'Tailored fixed IPD',
      'Enhanced depth perception',
    ],
    highlights: [
      'Adjustable 300-600 mm working distance.',
      'Fixed interpupillary distance tailored to your specifications.',
      'Enhanced depth perception with superior clarity.',
      'Ergonomic comfort for the neck and spine.',
    ],
    magnifications: ['3.0x', '4.0x', '5.0x'],
    priceLabel: 'Pricing coming soon',
    isAvailable: false,
    cardImageSrc: '/Medusa/MedusaMain.png',
    cardImageAlt: 'HeliosX Medusa loupes product image',
    imagePosition: '34% center',
    displayOrder: 1,
    specTitle: 'Medusa product specifications.',
    specDescription:
      'Medusa is designed around adjustable working distance and custom fit. It adapts to the surgeon rather than forcing the surgeon into one fixed operating posture.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Weight with frame: 56g.',
          'Adjustable working distance for seated or standing procedures.',
          'Fixed interpupillary distance tailored to your specifications.',
          'Built for maximum ergonomic comfort through long cases.',
        ],
      },
      {
        title: 'Optics & fit',
        items: [
          'Enhanced depth perception for precise field control.',
          'Superior clarity across the working field.',
          'Custom IPD alignment for a stable visual axis.',
          'Designed to reduce neck and spine strain.',
        ],
      },
      {
        title: 'Magnification data',
        items: [
          'Magnification options: 3.0x, 4.0x, 5.0x.',
          'Working distance: adjustable 300-600 mm.',
          'Field of view: 80 mm.',
          'Depth of field: 110 mm.',
        ],
      },
    ],
    heroImages: [
      { src: '/Medusa/MedusaDoctorBlonde.png', alt: 'Doctor wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaDoctorMale.png', alt: 'Clinician wearing Medusa surgical loupes' },
      { src: '/Medusa/MedusaStudioCloseup.png', alt: 'Medusa loupes closeup product detail' },
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
      'High-magnification clarity for detail-obsessed operators. Apollo pairs advanced optics with lightweight frames so you can work precisely without losing balance.',
    cardTagline: 'High-magnification clarity for detail-obsessed operators.',
    cardHighlight: 'Best for fine aesthetic & micro-oriented work.',
    cardBullets: ['Next-generation optics', 'Increased working precision', 'Ergonomic frame options'],
    highlights: [
      'High-clarity optics tuned for detail work.',
      'Lightweight frame options that stay balanced.',
      'Extended working distance control.',
      'Prescription capable and light-source ready.',
    ],
    magnifications: ['3.0x', '4.0x', '5.0x', '6.0x'],
    basePrice: 599,
    isAvailable: true,
    cardImageSrc: '/Apollo/ApollomainProduct(Notext).png',
    cardImageAlt: 'HeliosX Apollo loupes product image',
    displayOrder: 2,
    specTitle: 'Apollo product specifications.',
    specDescription:
      'Engineered for operators who need higher magnification without sacrificing ergonomics. Apollo delivers crisp resolution, reliable light compatibility, and a frame that stays comfortable when precision matters most.',
    specColumns: [
      {
        title: 'Core build',
        items: [
          'Balanced chassis that keeps weight off your neck.',
          'Weight: 38g / 39g / 40g / 42g (3.0x / 4.0x / 5.0x / 6.0x).',
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
        title: 'Magnification data',
        items: [
          '3.0x - WD 330-600 mm, FOV 120-140 mm, DOF 180 mm.',
          '4.0x - WD 330-600 mm, FOV 100-120 mm, DOF 150 mm.',
          '5.0x - WD 330-600 mm, FOV 85-105 mm, DOF 120 mm.',
          '6.0x - WD 330-600 mm, FOV 70-90 mm, DOF 100 mm.',
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
    basePrice: 499,
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
    basePrice: 449,
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
          'Weight: 33g / 34g / 35g (2.5x / 3.0x / 3.5x).',
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
        title: 'Magnification data',
        items: [
          '2.5x - WD 300-580 mm, FOV 150-170 mm, DOF 200 mm.',
          '3.0x - WD 300-580 mm, FOV 130-150 mm, DOF 200 mm.',
          '3.5x - WD 300-580 mm, FOV 110-130 mm, DOF 200 mm.',
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
    basePrice: 549,
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
          'Weight: 40g / 41g / 42g (4.0x / 5.0x / 6.0x).',
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
        title: 'Magnification data',
        items: [
          '4.0x - WD 350-620 mm, FOV 95-115 mm, DOF 140 mm.',
          '5.0x - WD 350-620 mm, FOV 80-100 mm, DOF 110 mm.',
          '6.0x - WD 350-620 mm, FOV 65-85 mm, DOF 90 mm.',
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
