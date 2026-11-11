/**
 * Copy for the Spanish (/es) and Brazilian Portuguese (/pt) pages.
 *
 * Every fact here mirrors an English page: prices come from lib/pricing.json,
 * shipping/returns/warranty/trainee terms from /surgical-loupes-latin-america,
 * company scale from the owner (see /about). Slugs and headings follow the
 * keyword research in seo/keyword-research-latam-2026-11/: the words people
 * actually search in each language ("lupas dentales", "lupa odontológica",
 * "fotóforo"), not a literal translation of the English.
 */
import {
  LIGHT_BUNDLE_PERCENT_OFF,
  lightPriceBySlug,
  magnificationPriceByProduct,
  PRESCRIPTION_PRICE,
  TRAINEE_PERCENT_OFF,
} from '@/lib/pricing'
import type { Locale } from '@/lib/i18n'

export type IntlLocale = Exclude<Locale, 'en'>

export type IntlSection =
  | { kind: 'prose'; title: string; paragraphs: string[] }
  | { kind: 'models'; title: string; intro: string }
  | { kind: 'list'; title: string; items: { lead: string; text: string }[]; after?: string }
  | { kind: 'steps'; title: string; items: string[]; after?: string }
  | { kind: 'cta'; title: string; text: string; link: { label: string; href: string } }

export type IntlPageContent = {
  locale: IntlLocale
  path: string
  title: string
  description: string
  keywords: string[]
  breadcrumb: string
  h1: string
  lead: string
  points: string[]
  primaryCta: { label: string; href: string }
  emailCta: { label: string; subject: string }
  image: { src: string; alt: string; width: number; height: number }
  sections: IntlSection[]
  faqs: { question: string; answer: string }[]
  related: { label: string; href: string }[]
}

const minPrice = (slug: string) => Math.min(...Object.values(magnificationPriceByProduct[slug]))
const maxPrice = (slug: string) => Math.max(...Object.values(magnificationPriceByProduct[slug]))
const lightFrom = Math.min(
  ...Object.values(lightPriceBySlug).flatMap((light) => Object.values(light.prices)),
)

/** "$695 USD" (es) / "US$ 695" (pt). Prices are always charged in USD. */
export function formatUsd(locale: IntlLocale, value: number) {
  const n = value.toLocaleString(locale === 'es' ? 'es-MX' : 'pt-BR')
  return locale === 'es' ? `$${n} USD` : `US$ ${n}`
}

export function magnificationRange(slug: string) {
  const list = Object.keys(magnificationPriceByProduct[slug])
  return `${list[0]}–${list[list.length - 1]}`
}

export const modelOrder = ['newton', 'galileo', 'kepler', 'apollo', 'medusa'] as const

export const modelCopy: Record<IntlLocale, Record<(typeof modelOrder)[number], { type: string; note: string }>> = {
  es: {
    newton: { type: 'Galileana', note: 'El par más ligero (40–50 g con montura). Ideal como primeras lupas, para higiene dental, estudiantes y jornadas largas.' },
    galileo: { type: 'Galileana', note: 'Campo amplio de 110–170 mm y buena profundidad de campo para la consulta diaria.' },
    kepler: { type: 'Prismática', note: 'Más aumento para el detalle fino: endodoncia, cirugía y microcirugía.' },
    apollo: { type: 'Prismática ergonómica', note: 'Óptica angulada para trabajar con la cabeza más erguida, a una distancia de trabajo fija.' },
    medusa: { type: 'Prismática ergonómica', note: 'Distancia de trabajo ajustable de 300 a 600 mm, para quien trabaja sentado y de pie.' },
  },
  pt: {
    newton: { type: 'Galileana', note: 'O par mais leve (40–50 g com armação). Ótimo primeiro par para higiene bucal, estudantes e jornadas longas.' },
    galileo: { type: 'Galileana', note: 'Campo amplo de 110–170 mm e boa profundidade de campo para a clínica do dia a dia.' },
    kepler: { type: 'Prismática', note: 'Mais aumento para detalhes finos: endodontia, cirurgia e microcirurgia.' },
    apollo: { type: 'Prismática ergonômica', note: 'Óptica angulada para trabalhar com a cabeça mais ereta, com distância de trabalho fixa.' },
    medusa: { type: 'Prismática ergonômica', note: 'Distância de trabalho ajustável de 300 a 600 mm, para quem atende sentado e em pé.' },
  },
}

const portrait = { src: '/mobile-home/work-editorial-v2.png', width: 1024, height: 1536 }
const productShot = { src: '/share/medusa.jpg', width: 1200, height: 630 }

/* ------------------------------------------------------------------ */
/* Spanish                                                             */
/* ------------------------------------------------------------------ */

const es = (v: number) => formatUsd('es', v)

const esShared = {
  shipping: {
    question: '¿Hacen envíos a México, Colombia, Argentina, Chile, Perú y el resto de Latinoamérica?',
    answer:
      'Sí. Enviamos a todos los países de Latinoamérica, entre ellos México, Colombia, Argentina, Chile, Perú, Ecuador, Venezuela, Bolivia, Uruguay, Paraguay, Costa Rica, Panamá, Guatemala y República Dominicana. El envío internacional estándar está incluido en el precio y recibes un número de seguimiento.',
  },
  taxes: {
    question: '¿Tendré que pagar impuestos de importación?',
    answer:
      'Depende de tu país. Los impuestos y cargos de aduana, cuando aplican, se pagan al recibir el paquete y no los cobramos nosotros. Escríbenos con tu país y el modelo que te interesa y te ayudamos a estimar el total antes de comprar.',
  },
  currency: {
    question: '¿Puedo pagar en mi moneda local?',
    answer:
      'Los precios se cobran en dólares estadounidenses a cualquier tarjeta de crédito o débito internacional. Tu banco convierte el monto a tu moneda local.',
  },
  students: {
    question: '¿Hay descuento para estudiantes y residentes?',
    answer: `Sí. Estudiantes de odontología y medicina, residentes y fellows tienen ${TRAINEE_PERCENT_OFF}% de descuento. Envíanos un comprobante de tu programa (credencial, carta de la universidad u horario) y, una vez verificado, te mandamos un código para usar al pagar.`,
  },
  returns: {
    question: '¿Puedo devolverlas desde Latinoamérica?',
    answer:
      'Sí. Los pares sin graduación tienen 30 días de devolución desde la entrega con reembolso completo. Los pares con graduación se pueden cancelar con reembolso completo hasta que empieza la fabricación. Todas las lupas tienen garantía limitada de por vida.',
  },
  measure: {
    question: '¿Cómo me tomo las medidas sin un representante?',
    answer:
      'Solo necesitamos dos datos: tu distancia interpupilar (con una app del teléfono o en una óptica) y tu distancia de trabajo (con una cinta métrica, en tu postura de trabajo). Revisamos las medidas contigo antes de fabricar nada.',
  },
}

const esLanding: IntlPageContent = {
  locale: 'es',
  path: '/es',
  title: 'Lupas quirúrgicas y dentales a medida | HeliosX',
  description: `Lupas dentales y quirúrgicas hechas a tu medida, con precio publicado y envío incluido a toda Latinoamérica. Desde ${es(minPrice('newton'))}, garantía de por vida.`,
  keywords: ['lupas dentales', 'lupas quirúrgicas', 'lupas odontológicas', 'lupas binoculares', 'lupas para odontología', 'lupas para dentistas', 'HeliosX'],
  breadcrumb: 'Inicio',
  h1: 'Precisión quirúrgica, por fin accesible.',
  lead:
    'Lupas quirúrgicas y dentales fabricadas a tu medida, para quienes buscan la maestría. Sin barreras. Solo precios justos. Calidad de élite, realmente accesible, con envío incluido a toda Latinoamérica.',
  points: [
    'Envío internacional incluido',
    'Hechas a tu distancia interpupilar y de trabajo',
    'Garantía limitada de por vida',
    `${TRAINEE_PERCENT_OFF}% para estudiantes y residentes`,
  ],
  primaryCta: { label: 'Ver modelos y precios', href: '/product' },
  emailCta: { label: 'Escríbenos', subject: 'Consulta desde Latinoamérica' },
  image: { ...portrait, alt: 'Odontóloga trabajando con lupas binoculares HeliosX montadas en la montura' },
  sections: [
    {
      kind: 'prose',
      title: 'Óptica de élite sin intermediarios',
      paragraphs: [
        'Durante años, las buenas lupas han tenido precios inflados que dejan fuera a estudiantes, residentes y a muchos profesionales. El problema no es la fabricación. El problema son las barreras.',
        'HeliosX lleva cerca de diez años equipando a cirujanos, odontólogos e higienistas en más de 110 países, sobre todo en congresos y exposiciones de cirugía y odontología de Europa, Asia, Sudamérica y Estados Unidos. Trabajamos con clínicas privadas, hospitales universitarios y programas de formación, y hemos acompañado a cirujanos en misiones médicas en Sudamérica. Ahora puedes comprar directo, con el precio de cada modelo publicado.',
      ],
    },
    {
      kind: 'models',
      title: 'Modelos y precios',
      intro: 'Cada par se fabrica con un solo aumento, a tu distancia interpupilar y de trabajo. Precios en dólares, con envío incluido.',
    },
    {
      kind: 'list',
      title: '¿Qué aumento necesito?',
      items: [
        { lead: 'Odontología general e higiene dental:', text: '2.5x a 3.0x, con un campo amplio que abarca el cuadrante.' },
        { lead: 'Estudiantes de odontología y medicina:', text: '2.5x es el primer par más común y el más fácil de adaptar.' },
        { lead: 'Cirugía general y ortopédica:', text: '2.5x a 3.5x.' },
        { lead: 'Cirugía de columna y vascular:', text: '3.0x a 4.5x.' },
        { lead: 'Endodoncia, cirugía de mano, plástica y microcirugía:', text: '4.0x o más.' },
      ],
      after: 'Elige el menor aumento que te muestre con claridad el paso más difícil de tu trabajo habitual. Más aumento reduce el campo de visión y la profundidad de campo.',
    },
    {
      kind: 'steps',
      title: 'Cómo comprar desde tu país',
      items: [
        'Elige modelo y aumento en nuestra tienda y paga con tarjeta internacional en dólares.',
        'Envíanos tu distancia interpupilar y tu distancia de trabajo. Te guiamos paso a paso.',
        'Revisamos las medidas contigo y fabricamos tus lupas en 1 a 2 semanas.',
        'Enviamos con seguimiento. El tiempo de tránsito y los impuestos de importación dependen de tu país.',
      ],
    },
    {
      kind: 'cta',
      title: '¿Odontología? Empieza por aquí',
      text: 'Comparamos modelos, aumentos y luces LED para la consulta dental, con precios.',
      link: { label: 'Lupas dentales y odontológicas', href: '/es/lupas-dentales' },
    },
  ],
  faqs: [
    esShared.shipping,
    {
      question: '¿Cuánto cuestan las lupas HeliosX?',
      answer: `Desde ${es(minPrice('newton'))} por Newton hasta ${es(maxPrice('medusa'))} por Medusa a 8.5x, con envío y garantía limitada de por vida incluidos. Las lentes graduadas suman ${es(PRESCRIPTION_PRICE)}.`,
    },
    esShared.taxes,
    esShared.currency,
    esShared.students,
    esShared.returns,
    esShared.measure,
  ],
  related: [
    { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    { label: 'Envíos (en inglés)', href: '/surgical-loupes-latin-america' },
    { label: 'Garantía (en inglés)', href: '/warranty' },
    { label: 'Devoluciones (en inglés)', href: '/returns' },
  ],
}

const esDental: IntlPageContent = {
  locale: 'es',
  path: '/es/lupas-dentales',
  title: 'Lupas dentales y odontológicas a medida, con precio | HeliosX',
  description: `Lupas dentales galileanas y prismáticas hechas a tu medida, con luz LED opcional. Precios publicados desde ${es(minPrice('newton'))}, envío incluido a toda Latinoamérica.`,
  keywords: [
    'lupas dentales',
    'lupas odontológicas',
    'lupas para odontología',
    'lupa dental',
    'lupas dentales con luz',
    'lupas para dentistas',
    'lupas para endodoncia',
    'precio lupas dentales',
    'lupas binoculares',
    'lupas galileanas',
    'lupas prismáticas',
  ],
  breadcrumb: 'Lupas dentales',
  h1: 'Lupas dentales hechas a tu medida',
  lead:
    'Lupas odontológicas galileanas y prismáticas, fabricadas a tu distancia interpupilar y de trabajo, con precio publicado y envío incluido a toda Latinoamérica. Para odontólogos, especialistas, higienistas y estudiantes.',
  points: [
    `Desde ${es(minPrice('newton'))}, envío incluido`,
    '2.5x a 8.5x, galileanas y prismáticas',
    'Luz LED opcional',
    `${TRAINEE_PERCENT_OFF}% para estudiantes y residentes`,
  ],
  primaryCta: { label: 'Ver modelos', href: '/product' },
  emailCta: { label: 'Pregúntale a un especialista', subject: 'Lupas dentales - consulta' },
  image: { ...productShot, alt: 'Lupas dentales prismáticas HeliosX Medusa de 3.0x sobre una base' },
  sections: [
    {
      kind: 'prose',
      title: 'Por qué usar lupas en odontología',
      paragraphs: [
        'Las lupas dentales amplían la zona de trabajo y te dejan trabajar a una distancia fija, con la espalda y el cuello en una postura más estable. Por eso se usan cada vez más desde la universidad: en operatoria, periodoncia, endodoncia, prótesis e higiene.',
        'Unas lupas a medida se ajustan a tus ojos y a tu postura. Cada par HeliosX se fabrica con tu distancia interpupilar y tu distancia de trabajo, y revisamos las medidas contigo antes de fabricarlo.',
      ],
    },
    {
      kind: 'list',
      title: 'Galileanas o prismáticas',
      items: [
        { lead: 'Galileanas (Newton, Galileo):', text: 'ligeras, con campo amplio. Lo habitual entre 2.5x y 3.5x para odontología general, higiene y estudiantes.' },
        { lead: 'Prismáticas (Kepler):', text: 'más aumento y una imagen nítida de borde a borde. Para endodoncia, cirugía e implantes, de 4.0x en adelante.' },
        { lead: 'Prismáticas ergonómicas (Apollo, Medusa):', text: 'óptica angulada para trabajar con la cabeza más erguida. Medusa ajusta la distancia de trabajo de 300 a 600 mm.' },
      ],
    },
    {
      kind: 'models',
      title: 'Precio de las lupas dentales HeliosX',
      intro: 'Precios publicados por modelo, en dólares y con envío incluido. Cada par se fabrica con un solo aumento.',
    },
    {
      kind: 'list',
      title: 'Qué aumento elegir en odontología',
      items: [
        { lead: 'Odontología general e higiene:', text: '2.5x a 3.0x.' },
        { lead: 'Estudiantes:', text: '2.5x, el primer par más fácil de adaptar.' },
        { lead: 'Periodoncia, prótesis e implantes:', text: '3.0x a 4.0x.' },
        { lead: 'Endodoncia y microcirugía:', text: '4.0x o más, idealmente prismáticas.' },
      ],
      after: 'Elige el menor aumento que te muestre con claridad el paso más difícil de tu trabajo habitual. Más aumento reduce el campo y la profundidad de campo.',
    },
    {
      kind: 'prose',
      title: 'Lupas dentales con luz LED',
      paragraphs: [
        `La luz LED montada en las lupas ilumina justo donde miras, sin sombras de tu cabeza ni de tus manos. Nuestras luces empiezan en ${es(lightFrom)}, y tienen ${LIGHT_BUNDLE_PERCENT_OFF}% de descuento cuando las compras junto con tus lupas.`,
      ],
    },
    {
      kind: 'steps',
      title: 'Cómo comprar desde tu país',
      items: [
        'Elige modelo y aumento en nuestra tienda y paga con tarjeta internacional en dólares.',
        'Envíanos tu distancia interpupilar y tu distancia de trabajo. Te guiamos paso a paso.',
        'Revisamos las medidas contigo y fabricamos tus lupas en 1 a 2 semanas.',
        'Enviamos con seguimiento. El tiempo de tránsito y los impuestos de importación dependen de tu país.',
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuánto cuestan unas lupas dentales?',
      answer: `En HeliosX, desde ${es(minPrice('newton'))} por las Newton galileanas de 2.5x hasta ${es(maxPrice('medusa'))} por las Medusa prismáticas de 8.5x, con envío y garantía limitada de por vida incluidos. Las lentes graduadas suman ${es(PRESCRIPTION_PRICE)}.`,
    },
    {
      question: '¿Qué lupas dentales son mejores para un estudiante?',
      answer: `Un par galileano de 2.5x, como Newton o Galileo: ligero, con campo amplio y fácil de adaptar. Con el ${TRAINEE_PERCENT_OFF}% de descuento para estudiantes, verificado con tu credencial.`,
    },
    {
      question: '¿Qué aumento necesito para endodoncia?',
      answer: 'En general 4.0x o más, con lupas prismáticas como Kepler, Apollo o Medusa, que mantienen la imagen nítida a mayor aumento.',
    },
    esShared.shipping,
    esShared.taxes,
    esShared.currency,
    esShared.returns,
    esShared.measure,
  ],
  related: [
    { label: 'HeliosX en español', href: '/es' },
    { label: 'Luces LED (en inglés)', href: '/product/lights' },
    { label: 'Guía de medidas (en inglés)', href: '/measurements' },
    { label: 'Envíos a Latinoamérica (en inglés)', href: '/surgical-loupes-latin-america' },
  ],
}

/* ------------------------------------------------------------------ */
/* Brazilian Portuguese                                                */
/* ------------------------------------------------------------------ */

const pt = (v: number) => formatUsd('pt', v)

const ptShared = {
  shipping: {
    question: 'Vocês enviam para o Brasil?',
    answer:
      'Sim. Enviamos para todo o Brasil e para toda a América Latina. O frete internacional padrão está incluído no preço e você recebe um código de rastreamento.',
  },
  taxes: {
    question: 'Vou pagar imposto de importação?',
    answer:
      'Impostos e taxas de importação, quando houver, são cobrados na entrega e não por nós. Escreva para nós com o modelo que você quer e ajudamos a estimar o total antes da compra.',
  },
  currency: {
    question: 'Posso pagar em reais?',
    answer:
      'Os preços são cobrados em dólares americanos em qualquer cartão de crédito ou débito internacional. O seu banco converte o valor para reais.',
  },
  students: {
    question: 'Tem desconto para estudante e residente?',
    answer: `Sim. Estudantes de odontologia e medicina, residentes e fellows têm ${TRAINEE_PERCENT_OFF}% de desconto. Envie um comprovante do seu curso ou programa (carteirinha, declaração da faculdade ou escala) e, depois da verificação, mandamos um código para usar no pagamento.`,
  },
  returns: {
    question: 'Posso devolver do Brasil?',
    answer:
      'Sim. Pares sem grau têm 30 dias para devolução a partir da entrega, com reembolso integral. Pares com grau podem ser cancelados com reembolso integral até o início da fabricação. Todas as lupas têm garantia limitada vitalícia.',
  },
  measure: {
    question: 'Como tiro as medidas sem um representante?',
    answer:
      'Precisamos só de duas medidas: a sua distância interpupilar (com um app no celular ou numa ótica) e a sua distância de trabalho (com uma fita métrica, na sua postura de atendimento). Revisamos as medidas com você antes de fabricar.',
  },
}

const ptLanding: IntlPageContent = {
  locale: 'pt',
  path: '/pt',
  title: 'Lupas cirúrgicas e odontológicas sob medida | HeliosX',
  description: `Lupa odontológica e cirúrgica feita sob medida, com preço publicado e frete incluído para todo o Brasil. A partir de ${pt(minPrice('newton'))}, garantia vitalícia.`,
  keywords: ['lupa odontológica', 'lupa odontologia', 'lupa cirúrgica', 'lupa para dentista', 'lupa binocular', 'HeliosX'],
  breadcrumb: 'Início',
  h1: 'Precisão cirúrgica, finalmente acessível.',
  lead:
    'Lupas cirúrgicas e odontológicas feitas sob medida, para quem busca a maestria. Sem barreiras. Apenas preços justos. Qualidade de elite, realmente acessível, com frete incluído para todo o Brasil.',
  points: [
    'Frete internacional incluído',
    'Feitas na sua distância interpupilar e de trabalho',
    'Garantia limitada vitalícia',
    `${TRAINEE_PERCENT_OFF}% para estudantes e residentes`,
  ],
  primaryCta: { label: 'Ver modelos e preços', href: '/product' },
  emailCta: { label: 'Fale com a gente', subject: 'Dúvida do Brasil' },
  image: { ...portrait, alt: 'Dentista trabalhando com lupas binoculares HeliosX fixadas na armação' },
  sections: [
    {
      kind: 'prose',
      title: 'Óptica de elite sem intermediários',
      paragraphs: [
        'Por anos, boas lupas tiveram preços inflados que deixam de fora estudantes, residentes e muitos profissionais. O problema não é a fabricação. O problema são as barreiras.',
        'A HeliosX equipa cirurgiões, dentistas e higienistas em mais de 110 países há cerca de dez anos, principalmente em congressos e feiras de cirurgia e odontologia na Europa, Ásia, América do Sul e Estados Unidos. Trabalhamos com clínicas particulares, hospitais universitários e programas de residência, e já apoiamos cirurgiões em missões médicas na América do Sul. Agora você pode comprar direto, com o preço de cada modelo publicado.',
      ],
    },
    {
      kind: 'models',
      title: 'Modelos e preços',
      intro: 'Cada par é fabricado com um único aumento, na sua distância interpupilar e de trabalho. Preços em dólares, com frete incluído.',
    },
    {
      kind: 'list',
      title: 'Qual aumento eu preciso?',
      items: [
        { lead: 'Clínica geral e higiene bucal:', text: '2,5x a 3,0x, com campo amplo para o quadrante.' },
        { lead: 'Estudantes de odontologia e medicina:', text: '2,5x é o primeiro par mais comum e o mais fácil de se adaptar.' },
        { lead: 'Cirurgia geral e ortopédica:', text: '2,5x a 3,5x.' },
        { lead: 'Cirurgia de coluna e vascular:', text: '3,0x a 4,5x.' },
        { lead: 'Endodontia, cirurgia de mão, plástica e microcirurgia:', text: '4,0x ou mais.' },
      ],
      after: 'Escolha o menor aumento que mostra com clareza a etapa mais difícil do seu dia a dia. Mais aumento reduz o campo de visão e a profundidade de campo.',
    },
    {
      kind: 'steps',
      title: 'Como comprar do Brasil',
      items: [
        'Escolha o modelo e o aumento na nossa loja e pague com cartão internacional em dólares.',
        'Envie a sua distância interpupilar e a sua distância de trabalho. Orientamos você passo a passo.',
        'Revisamos as medidas com você e fabricamos as suas lupas em 1 a 2 semanas.',
        'Enviamos com rastreamento. O prazo de entrega e os impostos de importação dependem da alfândega.',
      ],
    },
    {
      kind: 'cta',
      title: 'Dentista? Comece por aqui',
      text: 'Comparamos modelos, aumentos e fotóforos para a clínica odontológica, com preços.',
      link: { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    },
  ],
  faqs: [
    ptShared.shipping,
    {
      question: 'Quanto custam as lupas HeliosX?',
      answer: `A partir de ${pt(minPrice('newton'))} pela Newton até ${pt(maxPrice('medusa'))} pela Medusa de 8,5x, com frete e garantia limitada vitalícia incluídos. Lentes com grau custam mais ${pt(PRESCRIPTION_PRICE)}.`,
    },
    ptShared.taxes,
    ptShared.currency,
    ptShared.students,
    ptShared.returns,
    ptShared.measure,
  ],
  related: [
    { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    { label: 'Envio internacional (em inglês)', href: '/surgical-loupes-latin-america' },
    { label: 'Garantia (em inglês)', href: '/warranty' },
    { label: 'Devoluções (em inglês)', href: '/returns' },
  ],
}

const ptDental: IntlPageContent = {
  locale: 'pt',
  path: '/pt/lupa-odontologica',
  title: 'Lupa odontológica sob medida, com preço | HeliosX',
  description: `Lupa odontológica galileana ou prismática, feita sob medida, com fotóforo LED opcional. Preços publicados a partir de ${pt(minPrice('newton'))}, frete incluído para todo o Brasil.`,
  keywords: [
    'lupa odontológica',
    'lupa odontologia',
    'lupa para dentista',
    'lupa odontológica com fotóforo',
    'lupa odontológica com led',
    'lupa para endodontia',
    'lupa odontológica preço',
    'melhor lupa para dentista',
    'óculos lupa dentista',
    'lupa binocular odontológica',
  ],
  breadcrumb: 'Lupa odontológica',
  h1: 'Lupa odontológica feita sob medida para você',
  lead:
    'Lupas odontológicas galileanas e prismáticas, fabricadas na sua distância interpupilar e de trabalho, com preço publicado e frete incluído para todo o Brasil. Para dentistas, especialistas, higienistas e estudantes.',
  points: [
    `A partir de ${pt(minPrice('newton'))}, frete incluído`,
    '2,5x a 8,5x, galileanas e prismáticas',
    'Fotóforo LED opcional',
    `${TRAINEE_PERCENT_OFF}% para estudantes e residentes`,
  ],
  primaryCta: { label: 'Ver modelos', href: '/product' },
  emailCta: { label: 'Fale com um especialista', subject: 'Lupa odontológica - dúvida' },
  image: { ...productShot, alt: 'Lupa odontológica prismática HeliosX Medusa de 3,0x sobre uma base' },
  sections: [
    {
      kind: 'prose',
      title: 'Por que usar lupa na odontologia',
      paragraphs: [
        'A lupa odontológica amplia o campo de trabalho e permite atender a uma distância fixa, com as costas e o pescoço numa postura mais estável. Por isso é usada cada vez mais desde a faculdade: em dentística, periodontia, endodontia, prótese e higiene bucal.',
        'Uma lupa sob medida se ajusta aos seus olhos e à sua postura. Cada par HeliosX é fabricado com a sua distância interpupilar e a sua distância de trabalho, e revisamos as medidas com você antes da fabricação.',
      ],
    },
    {
      kind: 'list',
      title: 'Galileana ou prismática',
      items: [
        { lead: 'Galileanas (Newton, Galileo):', text: 'leves e com campo amplo. O padrão entre 2,5x e 3,5x para clínica geral, higiene e estudantes.' },
        { lead: 'Prismáticas (Kepler):', text: 'mais aumento e imagem nítida de borda a borda. Para endodontia, cirurgia e implantes, a partir de 4,0x.' },
        { lead: 'Prismáticas ergonômicas (Apollo, Medusa):', text: 'óptica angulada para atender com a cabeça mais ereta. A Medusa ajusta a distância de trabalho de 300 a 600 mm.' },
      ],
    },
    {
      kind: 'models',
      title: 'Preço da lupa odontológica HeliosX',
      intro: 'Preços publicados por modelo, em dólares e com frete incluído. Cada par é fabricado com um único aumento.',
    },
    {
      kind: 'list',
      title: 'Qual aumento escolher na odontologia',
      items: [
        { lead: 'Clínica geral e higiene:', text: '2,5x a 3,0x.' },
        { lead: 'Estudantes:', text: '2,5x, o primeiro par mais fácil de se adaptar.' },
        { lead: 'Periodontia, prótese e implantes:', text: '3,0x a 4,0x.' },
        { lead: 'Endodontia e microcirurgia:', text: '4,0x ou mais, de preferência prismática.' },
      ],
      after: 'Escolha o menor aumento que mostra com clareza a etapa mais difícil do seu dia a dia. Mais aumento reduz o campo e a profundidade de campo.',
    },
    {
      kind: 'prose',
      title: 'Lupa odontológica com fotóforo',
      paragraphs: [
        `O fotóforo LED preso à lupa ilumina exatamente onde você olha, sem a sombra da cabeça ou das mãos. Nossos fotóforos começam em ${pt(lightFrom)} e têm ${LIGHT_BUNDLE_PERCENT_OFF}% de desconto quando comprados junto com a lupa.`,
      ],
    },
    {
      kind: 'steps',
      title: 'Como comprar do Brasil',
      items: [
        'Escolha o modelo e o aumento na nossa loja e pague com cartão internacional em dólares.',
        'Envie a sua distância interpupilar e a sua distância de trabalho. Orientamos você passo a passo.',
        'Revisamos as medidas com você e fabricamos as suas lupas em 1 a 2 semanas.',
        'Enviamos com rastreamento. O prazo de entrega e os impostos de importação dependem da alfândega.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Quanto custa uma lupa odontológica?',
      answer: `Na HeliosX, a partir de ${pt(minPrice('newton'))} pela Newton galileana de 2,5x até ${pt(maxPrice('medusa'))} pela Medusa prismática de 8,5x, com frete e garantia limitada vitalícia incluídos. Lentes com grau custam mais ${pt(PRESCRIPTION_PRICE)}.`,
    },
    {
      question: 'Qual a melhor lupa para estudante de odontologia?',
      answer: `Uma galileana de 2,5x, como a Newton ou a Galileo: leve, com campo amplo e fácil de se adaptar. Com ${TRAINEE_PERCENT_OFF}% de desconto para estudantes, verificado pela sua carteirinha.`,
    },
    {
      question: 'Qual aumento usar na endodontia?',
      answer: 'Em geral 4,0x ou mais, com lupas prismáticas como Kepler, Apollo ou Medusa, que mantêm a imagem nítida em aumentos maiores.',
    },
    ptShared.shipping,
    ptShared.taxes,
    ptShared.currency,
    ptShared.returns,
    ptShared.measure,
  ],
  related: [
    { label: 'HeliosX em português', href: '/pt' },
    { label: 'Fotóforos LED (em inglês)', href: '/product/lights' },
    { label: 'Guia de medidas (em inglês)', href: '/measurements' },
    { label: 'Envio internacional (em inglês)', href: '/surgical-loupes-latin-america' },
  ],
}

export const intlPages = { esLanding, esDental, ptLanding, ptDental }

/** Interface strings shared by the template, footer and language banner. */
export const ui: Record<IntlLocale, {
  from: string
  faqTitle: string
  moreTitle: string
  homeLabel: string
  footerTagline: string
  footerMission: string
  footerReply: string
  footerLinksTitle: string
  footerEnglishTitle: string
  footerPolicies: { label: string; href: string }[]
  footerEnglishLinks: { label: string; href: string }[]
  footerLocalLinks: { label: string; href: string }[]
  languageLabel: string
}> = {
  es: {
    from: 'Desde',
    faqTitle: 'Preguntas frecuentes',
    moreTitle: 'Más información',
    homeLabel: 'HeliosX',
    footerTagline: 'Sin barreras. Solo precios justos.',
    footerMission:
      'Precisión quirúrgica, por fin accesible. Lupas prismáticas ergonómicas y galileanas ligeras para cirujanos, odontólogos, residentes, higienistas y estudiantes.',
    footerReply: 'Respondemos en un día hábil.',
    footerLinksTitle: 'En español',
    footerEnglishTitle: 'Más (en inglés)',
    footerPolicies: [
      { label: 'Envíos', href: '/shipping' },
      { label: 'Devoluciones', href: '/returns' },
      { label: 'Garantía', href: '/warranty' },
      { label: 'Privacidad', href: '/privacy' },
    ],
    footerEnglishLinks: [
      { label: 'Todos los modelos', href: '/product' },
      { label: 'Luces LED', href: '/product/lights' },
      { label: 'Guía de medidas', href: '/measurements' },
      { label: 'Latinoamérica', href: '/surgical-loupes-latin-america' },
    ],
    footerLocalLinks: [
      { label: 'Inicio', href: '/es' },
      { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    ],
    languageLabel: 'Idioma',
  },
  pt: {
    from: 'A partir de',
    faqTitle: 'Perguntas frequentes',
    moreTitle: 'Saiba mais',
    homeLabel: 'HeliosX',
    footerTagline: 'Sem barreiras. Apenas preços justos.',
    footerMission:
      'Precisão cirúrgica, finalmente acessível. Lupas prismáticas ergonômicas e galileanas leves para cirurgiões, dentistas, residentes, higienistas e estudantes.',
    footerReply: 'Respondemos em um dia útil.',
    footerLinksTitle: 'Em português',
    footerEnglishTitle: 'Mais (em inglês)',
    footerPolicies: [
      { label: 'Envio', href: '/shipping' },
      { label: 'Devoluções', href: '/returns' },
      { label: 'Garantia', href: '/warranty' },
      { label: 'Privacidade', href: '/privacy' },
    ],
    footerEnglishLinks: [
      { label: 'Todos os modelos', href: '/product' },
      { label: 'Fotóforos LED', href: '/product/lights' },
      { label: 'Guia de medidas', href: '/measurements' },
      { label: 'América Latina', href: '/surgical-loupes-latin-america' },
    ],
    footerLocalLinks: [
      { label: 'Início', href: '/pt' },
      { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    ],
    languageLabel: 'Idioma',
  },
}
