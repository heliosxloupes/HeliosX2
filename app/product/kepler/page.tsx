'use client'

import ProductPageTemplate, { ProductPageConfig } from '../ProductPageTemplate'

const keplerConfig: ProductPageConfig = {
  slug: 'kepler',
  name: 'Kepler Surgical Loupes',
  shortName: 'Kepler',
  description:
    'Maximum magnification with a balanced footprint. Kepler is built for advanced users who need long-case comfort, high contrast, and uncompromised visibility.',
  highlights: [
    'High-magnification optical stack for micro work.',
    'Stabilized contrast and color for critical detail.',
    'Balanced weight distribution for long procedures.',
    'Prescription friendly and LED light compatible.',
  ],
  heroImages: [
    '/Keppler/KepplerNewmain.png',
    '/Keppler/KepplerMain.png',
    '/Keppler/Keppler4.png',
    '/Keppler/Keppler2.png',
  ],
  magnifications: ['4.0x', '5.0x', '6.0x'],
  basePrice: 549,
  specTitle: 'Kepler product specifications.',
  specDescription:
    'For operators pushing magnification to the edge. Kepler keeps resolution, contrast, and ergonomics in sync so you can stay steady during advanced micro and super-micro procedures.',
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
        'IPD range: 54—72 mm with precise adjustments.',
      ],
    },
    {
      title: 'Magnification data',
      items: [
        '4.0x — WD 350—620 mm, FOV 95—115 mm, DOF 140 mm.',
        '5.0x — WD 350—620 mm, FOV 80—100 mm, DOF 110 mm.',
        '6.0x — WD 350—620 mm, FOV 65—85 mm, DOF 90 mm.',
        'Optimized for LED light kits and fixed mounts.',
        'Designed for super-micro stability.',
      ],
    },
  ],
  specImages: [
    { src: '/Keppler/Kfinal.jpg', alt: 'Kepler loupes mid-procedure' },
    { src: '/Keppler/Keplerextra2.png', alt: 'Kepler loupes angled closeup' },
    { src: '/Keppler/KepplerMain2.png', alt: 'Kepler loupes on mannequin' },
  ],
}

export default function KeplerProductPage() {
  return <ProductPageTemplate config={keplerConfig} />
}
