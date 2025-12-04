'use client'

import ProductPageTemplate, { ProductPageConfig } from '../ProductPageTemplate'

const apolloConfig: ProductPageConfig = {
  slug: 'apollo',
  name: 'Apollo Surgical Loupes',
  shortName: 'Apollo',
  description:
    'High-magnification clarity for detail-obsessed operators. Apollo pairs advanced optics with lightweight frames so you can work precisely without losing balance.',
  highlights: [
    'High-clarity optics tuned for detail work.',
    'Lightweight frame options that stay balanced.',
    'Extended working distance control.',
    'Prescription capable and light-source ready.',
  ],
  heroImages: [
    '/Apollo/Apollofinal.png',
    '/Apollo/Apollo3xFemale2.png',
    '/Apollo/Blondcloseup.png',
    '/Apollo/Apollo3xAsian.png',
  ],
  magnifications: ['3.0x', '4.0x', '5.0x', '6.0x'],
  basePrice: 599,
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
        'IPD range: 54—72 mm with smooth adjustments.',
      ],
    },
    {
      title: 'Magnification data',
      items: [
        '3.0x — WD 330—600 mm, FOV 120—140 mm, DOF 180 mm.',
        '4.0x — WD 330—600 mm, FOV 100—120 mm, DOF 150 mm.',
        '5.0x — WD 330—600 mm, FOV 85—105 mm, DOF 120 mm.',
        '6.0x — WD 330—600 mm, FOV 70—90 mm, DOF 100 mm.',
        'Optimized for LED light packs and fixed mounts.',
      ],
    },
  ],
  specImages: [
    { src: '/Apollo/Apollowomanscrubbing.png', alt: 'Apollo loupes during scrub prep' },
    { src: '/Apollo/Apollo3xFemale.png', alt: 'Apollo loupes closeup portrait' },
    { src: '/Apollo/Apollomanequin.png', alt: 'Apollo loupes on mannequin' },
  ],
}

export default function ApolloProductPage() {
  return <ProductPageTemplate config={apolloConfig} />
}
