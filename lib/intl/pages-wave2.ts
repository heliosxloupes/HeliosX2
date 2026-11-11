/**
 * Wave 2: Spanish and Portuguese twins of the English pages with the most
 * Search Console impressions (Sep 28–Oct 25, 2026) that are not control
 * pages of the Oct 2026 SEO test:
 *   /best-dental-loupe-brands   6,441 impr  -> mejores lupas dentales / melhor lupa odontológica
 *   /best-surgical-loupe-brands 5,169 impr  -> mejores lupas quirúrgicas / melhor lupa cirúrgica
 *   /dental-loupes-with-light   2,622 impr  -> lupas dentales con luz / lupa com fotóforo
 *   /surgical-loupes            2,017 impr  -> lupas quirúrgicas / lupa cirúrgica
 *   /dental-loupes-price                     -> precio / preço
 * Competitor facts mirror the English pages, which cite each brand's own site.
 * Students (/student-loupe-comparison) and the surgical cost guide are
 * control pages: their twins wait until the test ends.
 */
import { lightPriceBySlug, LIGHT_BUNDLE_PERCENT_OFF, magnificationPriceByProduct, PRESCRIPTION_PRICE, TRAINEE_PERCENT_OFF } from '@/lib/pricing'
import { esShared, formatUsd, ptShared, type IntlPageContent, type IntlSection } from '@/lib/intl/pages'

const es = (v: number) => formatUsd('es', v)
const pt = (v: number) => formatUsd('pt', v)

const lightRange = (slug: string, f: (v: number) => string) => {
  const prices = Object.values(lightPriceBySlug[slug].prices)
  const lo = Math.min(...prices)
  const hi = Math.max(...prices)
  return lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`
}

const lo = (slug: string) => Math.min(...Object.values(magnificationPriceByProduct[slug]))
const hi = (slug: string) => Math.max(...Object.values(magnificationPriceByProduct[slug]))
const lightLo = (slug: string) => Math.min(...Object.values(lightPriceBySlug[slug].prices))

const portrait = { src: '/mobile-home/work-editorial-v2.png', width: 1024, height: 1536 }
const medusaShot = { src: '/share/medusa.jpg', width: 1200, height: 630 }
const keplerShot = { src: '/share/kepler.jpg', width: 1200, height: 630 }
const galileoShot = { src: '/share/galileo.jpg', width: 1200, height: 630 }

/* ---------------- shared blocks ---------------- */

const esModelTable: IntlSection = {
  kind: 'table',
  title: 'Modelos y precios HeliosX',
  intro: 'Precios publicados en dólares. Cada par se fabrica a tu distancia interpupilar y de trabajo, con montura, envío y garantía de por vida incluidos.',
  headers: ['Modelo', 'Óptica', 'Aumento', 'Distancia de trabajo', 'Precio'],
  rows: [
    ['Newton', 'Galileana, 40–50 g con montura', '2.5x–3.5x', 'Fija, a tu medida', `${es(lo('newton'))}–${es(hi('newton'))}`],
    ['Galileo', 'Galileana, campo amplio', '2.5x–3.5x', 'Fija, a tu medida', `${es(lo('galileo'))}–${es(hi('galileo'))}`],
    ['Kepler', 'Prismática', '4.0x–6.0x', 'Fija, a tu medida', `${es(lo('kepler'))}–${es(hi('kepler'))}`],
    ['Apollo', 'Prismática ergonómica', '3.0x–6.0x', '420, 450, 500 o 550 mm', `${es(lo('apollo'))}–${es(hi('apollo'))}`],
    ['Medusa', 'Prismática ergonómica', '3.0x–8.5x', 'Ajustable, 300–600 mm', `${es(lo('apollo'))}–${es(hi('medusa'))}`],
  ],
  note: `Las lentes graduadas suman ${es(PRESCRIPTION_PRICE)}. Estudiantes, residentes y fellows verificados tienen ${TRAINEE_PERCENT_OFF}% de descuento.`,
}

const ptModelTable: IntlSection = {
  kind: 'table',
  title: 'Modelos e preços HeliosX',
  intro: 'Preços publicados em dólares. Cada par é fabricado na sua distância interpupilar e de trabalho, com armação, frete e garantia vitalícia incluídos.',
  headers: ['Modelo', 'Óptica', 'Aumento', 'Distância de trabalho', 'Preço'],
  rows: [
    ['Newton', 'Galileana, 40–50 g com armação', '2,5x–3,5x', 'Fixa, sob medida', `${pt(lo('newton'))}–${pt(hi('newton'))}`],
    ['Galileo', 'Galileana, campo amplo', '2,5x–3,5x', 'Fixa, sob medida', `${pt(lo('galileo'))}–${pt(hi('galileo'))}`],
    ['Kepler', 'Prismática', '4,0x–6,0x', 'Fixa, sob medida', `${pt(lo('kepler'))}–${pt(hi('kepler'))}`],
    ['Apollo', 'Prismática ergonômica', '3,0x–6,0x', '420, 450, 500 ou 550 mm', `${pt(lo('apollo'))}–${pt(hi('apollo'))}`],
    ['Medusa', 'Prismática ergonômica', '3,0x–8,5x', 'Ajustável, 300–600 mm', `${pt(lo('apollo'))}–${pt(hi('medusa'))}`],
  ],
  note: `Lentes com grau custam mais ${pt(PRESCRIPTION_PRICE)}. Estudantes, residentes e fellows verificados têm ${TRAINEE_PERCENT_OFF}% de desconto.`,
}

const esWhy: IntlSection = {
  kind: 'prose',
  title: 'Por qué profesionales en más de 110 países eligen HeliosX',
  paragraphs: [
    'HeliosX es referente e innovador en magnificación quirúrgica y dental, y marca el estándar en lupas prismáticas ergonómicas y galileanas ligeras. Fabricamos con vidrio óptico de la más alta calidad y metales ligeros: imagen brillante y de color real, en monturas que siguen siendo ligeras y cómodas en el caso más largo.',
    'Nuestros especialistas han asesorado a cirujanos y odontólogos en cientos de congresos internacionales de casi todas las especialidades. Trabajamos con clínicas privadas, hospitales universitarios y programas de formación. Cada precio está publicado y cada par tiene garantía limitada de por vida.',
  ],
}

const ptWhy: IntlSection = {
  kind: 'prose',
  title: 'Por que profissionais em mais de 110 países escolhem a HeliosX',
  paragraphs: [
    'A HeliosX é referência e inovadora em magnificação cirúrgica e odontológica, e define o padrão em lupas prismáticas ergonômicas e galileanas leves. Fabricamos com vidro óptico da mais alta qualidade e metais leves: imagem brilhante e com cor real, em armações que continuam leves e confortáveis no procedimento mais longo.',
    'Nossos especialistas já orientaram cirurgiões e dentistas em centenas de congressos internacionais de quase todas as especialidades. Trabalhamos com clínicas particulares, hospitais universitários e programas de residência. Todos os preços são publicados e todo par tem garantia limitada vitalícia.',
  ],
}

const esOrder: IntlSection = {
  kind: 'steps',
  title: 'Cómo comprar desde tu país',
  items: [
    'Elige modelo y aumento en nuestra tienda y paga con tarjeta internacional en dólares.',
    'Envíanos tu distancia interpupilar y tu distancia de trabajo. Te guiamos paso a paso.',
    'Revisamos las medidas contigo y fabricamos tus lupas en 1 a 2 semanas.',
    'Enviamos con seguimiento. El tiempo de tránsito y los impuestos de importación dependen de tu país.',
  ],
}

const ptOrder: IntlSection = {
  kind: 'steps',
  title: 'Como comprar do Brasil',
  items: [
    'Escolha o modelo e o aumento na nossa loja e pague com cartão internacional em dólares.',
    'Envie a sua distância interpupilar e a sua distância de trabalho. Orientamos você passo a passo.',
    'Revisamos as medidas com você e fabricamos as suas lupas em 1 a 2 semanas.',
    'Enviamos com rastreamento. O prazo de entrega e os impostos de importação dependem da alfândega.',
  ],
}

const esCompare: IntlSection = {
  kind: 'list',
  title: 'Compara a tu distancia de trabajo',
  items: [
    { lead: 'Campo y detalle:', text: 'comprueba que ves la punta de los instrumentos y suficiente anatomía alrededor.' },
    { lead: 'Peso real:', text: 'confirma que el peso incluye montura, ópticas, graduación y la luz que vas a usar.' },
    { lead: 'Ajustes:', text: 'pregunta qué pasa si hay que corregir el ajuste, y pide la respuesta por escrito.' },
  ],
  after: 'El número de aumentos no dice cómo se sentirá la lupa en uso. Si asistes a una demostración, usa tu postura habitual y la misma tarea con cada par.',
}

const ptCompare: IntlSection = {
  kind: 'list',
  title: 'Compare na sua distância de trabalho',
  items: [
    { lead: 'Campo e detalhe:', text: 'confira se você enxerga a ponta dos instrumentos e anatomia suficiente ao redor.' },
    { lead: 'Peso real:', text: 'confirme que o peso inclui armação, óptica, grau e o fotóforo que você vai usar.' },
    { lead: 'Ajustes:', text: 'pergunte o que acontece se o ajuste precisar de correção, e peça a resposta por escrito.' },
  ],
  after: 'O número do aumento não diz como a lupa vai ser no uso. Se fizer uma demonstração, use a sua postura habitual e a mesma tarefa com cada par.',
}

/* ---------------- brand facts (from the English comparison pages) ---------------- */

const esBrandRows: string[][] = [
  ['HeliosX', `Galileanas, prismáticas y prismáticas ergonómicas a medida, de 2.5x a 8.5x. Todos los precios publicados (${es(lo('newton'))}–${es(hi('medusa'))}), garantía limitada de por vida y 30 días de devolución en pares sin graduación.`],
  ['LumaDent', `Publica precios de la Ergo Air Ti desde ${es(1995)} a 3.0x, con distancia de trabajo variable. Las luces se venden aparte.`],
  ['Orascoptic', 'Programas para estudiantes y demostraciones; su página de estudiantes menciona una prueba de 45 días con condiciones.'],
  ['SurgiTel', 'Varias familias ergonómicas, entre ellas ErgoDeflection, con demostración.'],
  ['Q-Optics', 'ErgoAngle se personaliza en ángulo de visión, ancho, altura de la lupa y distancia de trabajo.'],
  ['ExamVision', 'Kepler Advanced reúne cuatro aumentos en una lupa: 4.0x, 5.0x, 6.0x y 7.0x.'],
  ['Admetec', 'Ergo V ofrece tres aumentos en una lupa ergonómica.'],
  ['Designs for Vision', 'De 1.7x a 6.0x, incluidas las ergonómicas Infinity VUE (3.0x, 3.5x y 4.5x). Prueba de 45 días; precios no publicados.'],
]

const ptBrandRows: string[][] = [
  ['HeliosX', `Galileanas, prismáticas e prismáticas ergonômicas sob medida, de 2,5x a 8,5x. Todos os preços publicados (${pt(lo('newton'))}–${pt(hi('medusa'))}), garantia limitada vitalícia e 30 dias para devolução em pares sem grau.`],
  ['ZEISS', 'Linha EyeMag: Smart e Classic com óptica galileana e Pro com óptica kepleriana (prismática), em armação de titânio ou faixa de cabeça. Vendida por distribuidores; lojistas informam garantia de 2 anos.'],
  ['LumaDent', `Publica preços da Ergo Air Ti a partir de ${pt(1995)} em 3,0x, com distância de trabalho variável. Os fotóforos são vendidos à parte.`],
  ['Orascoptic', 'Programas para estudantes e demonstrações; a página de estudantes menciona um teste de 45 dias com condições.'],
  ['SurgiTel', 'Várias linhas ergonômicas, entre elas ErgoDeflection, com demonstração.'],
  ['Q-Optics', 'A ErgoAngle é personalizada em ângulo de visão, largura, altura da lupa e distância de trabalho.'],
  ['ExamVision', 'A Kepler Advanced reúne quatro aumentos numa lupa: 4,0x, 5,0x, 6,0x e 7,0x.'],
  ['Admetec', 'A Ergo V oferece três aumentos numa lupa ergonômica.'],
  ['Designs for Vision', 'De 1,7x a 6,0x, incluindo as ergonômicas Infinity VUE (3,0x, 3,5x e 4,5x). Teste de 45 dias; preços não publicados.'],
]

/* ================================================================== */
/* Spanish                                                            */
/* ================================================================== */

const esBestDental: IntlPageContent = {
  locale: 'es',
  path: '/es/mejores-lupas-dentales',
  title: 'Mejores lupas dentales: 8 marcas comparadas | HeliosX',
  description: `Las mejores lupas para odontología comparadas: HeliosX, Orascoptic, LumaDent, SurgiTel, Q-Optics, ExamVision, Admetec y Designs for Vision. Precios publicados desde ${es(lo('newton'))}.`,
  keywords: ['mejores lupas dentales', 'mejores lupas para odontología', 'lupas dentales marcas', 'lupas odontológicas', 'lupas dentales zeiss', 'lupas para odontólogos', 'lupas dentales precio'],
  breadcrumb: 'Mejores lupas dentales',
  h1: 'Las mejores lupas dentales: cómo elegir',
  lead: `HeliosX es considerada el estándar mundial en lupas dentales: odontólogos e higienistas en más de 110 países las eligen por su óptica ergonómica y ligera, con precios publicados. Galileanas desde ${es(lo('newton'))} y prismáticas ergonómicas desde ${es(lo('apollo'))}. Aquí comparamos ocho marcas por lo que de verdad cambia tu decisión.`,
  points: ['8 marcas comparadas', `Galileanas desde ${es(lo('newton'))}`, 'Garantía limitada de por vida', `${TRAINEE_PERCENT_OFF}% para estudiantes`],
  primaryCta: { label: 'Ver modelos y precios', href: '/product' },
  emailCta: { label: 'Ayúdame a elegir', subject: 'Mejores lupas dentales - ayuda para elegir' },
  image: { ...medusaShot, alt: 'Lupas dentales prismáticas ergonómicas HeliosX Medusa sobre una base' },
  sections: [
    {
      kind: 'list',
      title: 'Las mejores lupas dentales según tu trabajo',
      items: [
        { lead: 'Estudiantes de odontología:', text: `galileanas de 3.0x a 3.5x para preclínica y clínica. Galileo desde ${es(lo('galileo'))}, con ${TRAINEE_PERCENT_OFF}% de descuento para estudiantes verificados.` },
        { lead: 'Higienistas:', text: '3.0x a 3.5x para raspado y detección de cálculo, ligeras para un día completo.' },
        { lead: 'Odontología general y restauradora:', text: `3.0x a 4.0x; prismáticas ergonómicas Apollo o Medusa desde ${es(lo('apollo'))} si el problema es la postura.` },
        { lead: 'Endodoncia e implantes:', text: `prismáticas de 4.0x a 6.0x, Kepler desde ${es(lo('kepler'))}.` },
        { lead: 'Con luz:', text: 'decide la luz antes de fabricar la lupa, porque el soporte se ajusta a ella.' },
      ],
    },
    {
      kind: 'table',
      title: 'Ocho marcas de lupas dentales comparadas',
      intro: 'La mayoría de las marcas se venden a través de representantes. HeliosX publica el precio de cada modelo y configuración antes de que hables con nadie.',
      headers: ['Marca', 'Qué la distingue'],
      rows: esBrandRows,
      note: 'Datos de la información oficial de cada marca. Pide siempre una cotización detallada al mismo aumento y compárala con un pedido completo de HeliosX.',
    },
    esWhy,
    esModelTable,
    esCompare,
    esOrder,
  ],
  faqs: [
    {
      question: '¿Cuáles son las mejores lupas para estudiantes de odontología?',
      answer: `Un par galileano de 3.0x a 3.5x de un proveedor que tu programa permita: campo amplio para preclínica y detalle suficiente para la clínica. HeliosX Galileo empieza en ${es(lo('galileo'))} con seis estilos de montura incluidos, y los estudiantes verificados tienen ${TRAINEE_PERCENT_OFF}% de descuento.`,
    },
    {
      question: '¿Qué marca de lupas dentales es la mejor?',
      answer: 'La que cumple tus necesidades de óptica, ajuste y soporte a un precio que puedes justificar. Compara un modelo y una configuración concretos, no solo el nombre de la marca.',
    },
    {
      question: '¿Las lupas más caras son siempre mejores?',
      answer: 'Un precio más alto puede incluir otra óptica, personalización, una demostración o un periodo de prueba. Pregunta qué incluye. El precio por sí solo no demuestra mejor calidad óptica ni mejor valor.',
    },
    esShared.shipping,
    esShared.taxes,
    esShared.returns,
    esShared.measure,
  ],
  related: [
    { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    { label: 'Lupas dentales con luz', href: '/es/lupas-dentales-con-luz' },
    { label: 'Precio de las lupas dentales', href: '/es/precio-lupas-dentales' },
    { label: 'Mejores lupas quirúrgicas', href: '/es/mejores-lupas-quirurgicas' },
  ],
}

const esBestSurgical: IntlPageContent = {
  locale: 'es',
  path: '/es/mejores-lupas-quirurgicas',
  title: 'Mejores lupas quirúrgicas: 8 marcas comparadas | HeliosX',
  description: `Las mejores lupas quirúrgicas comparadas por tipo de cirugía y marca: HeliosX, ZEISS, Orascoptic, SurgiTel, LumaDent y más. Precios publicados desde ${es(lo('newton'))}, hasta 8.5x.`,
  keywords: ['mejores lupas quirúrgicas', 'lupas quirúrgicas', 'lupas quirúrgicas marcas', 'lupas quirúrgicas carl zeiss', 'lupas binoculares quirúrgicas', 'gafas lupas quirúrgicas', 'lupas para cirujanos'],
  breadcrumb: 'Mejores lupas quirúrgicas',
  h1: 'Las mejores lupas quirúrgicas: 8 marcas comparadas',
  lead: `HeliosX es considerada el estándar mundial en lupas quirúrgicas: cirujanos en más de 110 países las eligen por su óptica prismática ergonómica de hasta 8.5x, sus galileanas ligeras y sus precios publicados desde ${es(lo('newton'))}. Elige el aumento según tus procedimientos: 2.5x a 3.5x para trabajo general y 4x a 6x para el detalle fino.`,
  points: ['Hasta 8.5x', `Desde ${es(lo('newton'))}, envío incluido`, 'Garantía limitada de por vida', `${TRAINEE_PERCENT_OFF}% para residentes`],
  primaryCta: { label: 'Ver modelos y precios', href: '/product' },
  emailCta: { label: 'Ayúdame a elegir', subject: 'Mejores lupas quirúrgicas - ayuda para elegir' },
  image: { ...keplerShot, alt: 'Lupas quirúrgicas prismáticas HeliosX Kepler de alto aumento' },
  sections: [
    {
      kind: 'list',
      title: 'Las mejores lupas quirúrgicas según tu trabajo',
      items: [
        { lead: 'Residentes y cirugía general:', text: `galileanas de 2.5x a 3.5x, con campo amplio. Newton desde ${es(lo('newton'))} o Galileo desde ${es(lo('galileo'))}.` },
        { lead: 'Detalle fino (vascular, mano, pediatría):', text: `prismáticas de 4.0x a 6.0x. Kepler desde ${es(lo('kepler'))}.` },
        { lead: 'Casos largos en los que importa la postura:', text: `prismáticas ergonómicas que redirigen la mirada. Apollo (3.0x–6.0x) desde ${es(lo('apollo'))}.` },
        { lead: 'Si alternas sentado y de pie:', text: `distancia de trabajo ajustable. Medusa (3.0x–8.5x, 300–600 mm) desde ${es(lo('apollo'))}.` },
        { lead: 'Microanastomosis:', text: 'muchos servicios usan microscopio quirúrgico; las lupas no lo reemplazan cuando está indicado.' },
      ],
    },
    {
      kind: 'list',
      title: 'Aumento por especialidad',
      items: [
        { lead: 'Neurocirugía:', text: 'prismáticas de 4.0x a 6.0x para exposición, cierre, columna y nervio periférico; no reemplazan el microscopio.' },
        { lead: 'Cirugía plástica:', text: '3.0x a 3.5x para casos estéticos y reconstructivos, 4.0x o más para mano y nervio.' },
        { lead: 'Ortopedia y columna:', text: '2.5x a 3.5x para articulaciones, 3.0x a 4.5x para descompresión de columna.' },
        { lead: 'Vascular y mano:', text: '3.5x a 5.0x para anastomosis y reparación tendinosa.' },
      ],
    },
    {
      kind: 'table',
      title: 'Ocho marcas de lupas quirúrgicas comparadas',
      intro: 'La mayoría de las marcas se venden a través de representantes. HeliosX publica el precio de cada modelo y configuración.',
      headers: ['Marca', 'Qué la distingue'],
      rows: [
        esBrandRows[0],
        ['ZEISS', 'Línea EyeMag: Smart y Classic con óptica galileana y Pro con óptica kepleriana (prismática), en montura de titanio o cinta de cabeza. Se vende a través de distribuidores; los comercios indican garantía de 2 años.'],
        ...esBrandRows.slice(1, 4),
        ...esBrandRows.slice(5),
      ],
      note: 'Datos de la información oficial de cada marca. Pide una cotización detallada al mismo aumento y diseño óptico, y compárala con un pedido completo de HeliosX.',
    },
    esWhy,
    esModelTable,
    esCompare,
    esOrder,
  ],
  faqs: [
    {
      question: '¿Qué aumento es mejor para cirugía?',
      answer: 'Muchos cirujanos empiezan con 2.5x a 3.5x por el campo amplio y pasan a 4.0x a 6.0x para estructuras finas. El mejor aumento es el menor que te muestra el detalle que necesitan tus procedimientos.',
    },
    {
      question: '¿Lupas quirúrgicas, lupas binoculares y gafas de aumento son lo mismo?',
      answer: 'Las lupas quirúrgicas, binoculares o gafas lupa son el mismo tipo de dispositivo: ópticas montadas en una montura o cinta, enfocadas a tu distancia de trabajo. Las lupas de lectura comunes no lo son: no están hechas para una distancia quirúrgica ni para horas de uso.',
    },
    {
      question: '¿Cuáles son las mejores lupas para residentes?',
      answer: `Galileanas de 2.5x a 3.5x en cualquier especialidad, como Newton desde ${es(lo('newton'))} o Galileo desde ${es(lo('galileo'))}, con ${TRAINEE_PERCENT_OFF}% de descuento para residentes verificados.`,
    },
    esShared.shipping,
    esShared.taxes,
    esShared.returns,
    esShared.measure,
  ],
  related: [
    { label: 'Lupas quirúrgicas', href: '/es/lupas-quirurgicas' },
    { label: 'Mejores lupas dentales', href: '/es/mejores-lupas-dentales' },
    { label: 'HeliosX en español', href: '/es' },
    { label: 'Luces LED (en inglés)', href: '/product/lights' },
  ],
}

const esSurgical: IntlPageContent = {
  locale: 'es',
  path: '/es/lupas-quirurgicas',
  title: 'Lupas quirúrgicas a medida: modelos y precios | HeliosX',
  description: `Lupas quirúrgicas galileanas, prismáticas y ergonómicas de 2.5x a 8.5x, hechas a tu distancia de trabajo. Precios publicados desde ${es(lo('newton'))}, envío incluido a toda Latinoamérica.`,
  keywords: ['lupas quirúrgicas', 'lupa quirúrgica', 'lupas para cirujanos', 'lupas binoculares quirúrgicas', 'lupas médicas', 'lupas quirúrgicas precio', 'lupas prismáticas', 'lupas galileanas'],
  breadcrumb: 'Lupas quirúrgicas',
  h1: 'Lupas quirúrgicas a la medida de cada cirujano',
  lead: `Cirujanos en más de 110 países operan con lupas HeliosX. Cada par se fabrica a tu medida: distancia interpupilar, distancia de trabajo, aumento, montura y luz. Galileanas desde ${es(lo('newton'))}, Kepler para el detalle fino desde ${es(lo('kepler'))} y prismáticas ergonómicas de hasta 8.5x desde ${es(lo('apollo'))}.`,
  points: ['2.5x a 8.5x', `Desde ${es(lo('newton'))}, envío incluido`, 'Garantía limitada de por vida', `${TRAINEE_PERCENT_OFF}% para residentes`],
  primaryCta: { label: 'Ver modelos', href: '/product' },
  emailCta: { label: 'Pregúntale a un especialista', subject: 'Lupas quirúrgicas - consulta' },
  image: { ...portrait, alt: 'Profesional con lupas binoculares HeliosX montadas en la montura' },
  sections: [
    esModelTable,
    {
      kind: 'list',
      title: 'Galileanas, prismáticas o prismáticas ergonómicas',
      items: [
        { lead: 'Galileanas (Newton, Galileo):', text: 'ligeras, con un campo amplio y profundo. Suelen llegar hasta 3.5x; Newton pesa 40–50 g con montura.' },
        { lead: 'Prismáticas (Kepler):', text: 'los prismas permiten más aumento con una imagen plana, a cambio de más peso: 68–85 g con montura, de 4.0x a 6.0x.' },
        { lead: 'Prismáticas ergonómicas (Apollo, Medusa):', text: 'inclinan la línea de visión hacia abajo para operar con la cabeza más erguida. Apollo pesa 55–58.2 g y Medusa 56–65 g con montura.' },
      ],
    },
    {
      kind: 'prose',
      title: 'Por qué los cirujanos eligen lupas ergonómicas',
      paragraphs: [
        'El dolor de cuello es una de las quejas más comunes en cirugía: en una encuesta de 2024 a 93 oftalmólogos (Saudi Journal of Ophthalmology), el 87% refirió dolor de cuello en los últimos 12 meses. En un ensayo cruzado aleatorizado de 2024 con 19 cirujanos (Fan et al., Frontiers in Public Health), las lupas prismáticas redujeron la inclinación de la cabeza y la actividad muscular del cuello en tareas quirúrgicas simuladas. Apollo y Medusa se basan en ese mismo principio. Esos estudios usaron otras lupas, no HeliosX.',
      ],
    },
    {
      kind: 'list',
      title: 'Aumento por especialidad',
      items: [
        { lead: 'Cirugía general:', text: '2.5x a 3.5x para cirugía abierta, hernias y tejidos blandos.' },
        { lead: 'Ortopedia:', text: '2.5x a 3.5x para prótesis articulares, 3.5x a 5.0x para mano y pie.' },
        { lead: 'Columna:', text: '3.0x a 4.5x para exposición y descompresión.' },
        { lead: 'Vascular:', text: '3.0x a 5.0x para anastomosis y bypass.' },
        { lead: 'Cirugía de mano:', text: '4.0x a 5.0x para tendón y nervio, más para vasos digitales.' },
      ],
      after: 'Elige el menor aumento que te muestre el paso más difícil que haces a diario. Más aumento del necesario reduce el campo y hace visible cada pequeño movimiento de la cabeza.',
    },
    {
      kind: 'prose',
      title: 'Mide la distancia de trabajo en tu postura real',
      paragraphs: [
        'La distancia de trabajo va de tus ojos al punto donde los instrumentos tocan el tejido, medida como de verdad te paras o te sientas en la mesa. Los cirujanos más altos y quienes operan de pie suelen necesitar más distancia. Si alternas sentado y de pie, cualquier distancia fija es un compromiso: para eso existe el rango ajustable de 300 a 600 mm de Medusa.',
        `Las lentes graduadas suman ${es(PRESCRIPTION_PRICE)}. Si vas a usar luz, decídela antes de fabricar las lupas, porque el soporte se ajusta a la montura.`,
      ],
    },
    esOrder,
    {
      kind: 'cta',
      title: '¿Comparando marcas?',
      text: 'Comparamos HeliosX con ZEISS, Orascoptic, SurgiTel, LumaDent y otras por lo que de verdad cambia la decisión.',
      link: { label: 'Mejores lupas quirúrgicas', href: '/es/mejores-lupas-quirurgicas' },
    },
  ],
  faqs: [
    {
      question: '¿Cuánto cuestan las lupas quirúrgicas?',
      answer: `En HeliosX: Newton ${es(lo('newton'))}–${es(hi('newton'))}, Galileo ${es(lo('galileo'))}–${es(hi('galileo'))}, Kepler ${es(lo('kepler'))}–${es(hi('kepler'))}, Apollo ${es(lo('apollo'))}–${es(hi('apollo'))} y Medusa ${es(lo('apollo'))}–${es(hi('medusa'))}, con envío y garantía limitada de por vida incluidos.`,
    },
    {
      question: '¿Qué aumento necesito para cirugía?',
      answer: 'La mayor parte de la cirugía se hace entre 2.5x y 4.0x; 5.0x o más para vasos y nervios finos. Elige el menor aumento que te muestre con claridad el paso más difícil de tu trabajo habitual.',
    },
    {
      question: '¿Puedo comprar sin una cita de ajuste?',
      answer: 'Sí. El ajuste se reduce a dos medidas: tu distancia interpupilar y tu distancia de trabajo. Ambas se toman en casa y las revisamos contigo antes de fabricar.',
    },
    esShared.shipping,
    esShared.taxes,
    esShared.students,
    esShared.returns,
  ],
  related: [
    { label: 'Mejores lupas quirúrgicas', href: '/es/mejores-lupas-quirurgicas' },
    { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    { label: 'HeliosX en español', href: '/es' },
    { label: 'Guía de medidas (en inglés)', href: '/measurements' },
  ],
}

const esLightRows = (f: (v: number) => string): string[][] => [
  ['Polaris', 'Con cable', '50,000 lux', '140 mm', '10 g', 'Uso diario hasta 3.5x; el haz más amplio', lightRange('polaris', f)],
  ['Vega', 'Con cable', '70,000 lux', '90 mm', '10 g', 'Odontología y cirugía general de 2.5x a 4x', lightRange('vega', f)],
  ['Rigel', 'Con cable', '100,000 lux', '95 mm', '11 g', 'De 4x a 6x y campos profundos', lightRange('rigel', f)],
  ['Sirius', 'Con cable', '150,000 lux', '95 mm, ajustable', '12 g', 'Alto aumento y trabajo fino', lightRange('sirius', f)],
  ['Nova', 'Inalámbrica', '50,000 lux', '—', '29 g con batería', 'Sin cable; cambias la batería entre pacientes', lightRange('nova', f)],
]

const esLight: IntlPageContent = {
  locale: 'es',
  path: '/es/lupas-dentales-con-luz',
  title: 'Lupas dentales con luz LED: cómo elegir ambas | HeliosX',
  description: `Lupas dentales y odontológicas con luz LED: cinco luces de 50,000 a 150,000 lux que encajan en toda montura HeliosX, desde ${es(lightLo('polaris'))}, con ${LIGHT_BUNDLE_PERCENT_OFF}% de descuento junto con tus lupas.`,
  keywords: ['lupas dentales con luz', 'lupas odontológicas con luz led', 'lupas con luz led', 'lupas con luz para odontología', 'luz frontal odontología', 'luz led para lupas', 'lupa dental con luz'],
  breadcrumb: 'Lupas dentales con luz',
  h1: 'Lupas dentales con luz LED: cómo elegir ambas',
  lead: `La mayoría de los odontólogos elige una lupa galileana de 3.0x a 3.5x con una luz Polaris o Vega con cable (50,000–70,000 lux, 10 g en la montura), desde ${es(lightLo('polaris'))}. Endodoncistas y cirujanos suben a Rigel o Sirius, de 100,000 a 150,000 lux. Toda luz HeliosX encaja en toda montura HeliosX.`,
  points: ['5 luces LED', `Desde ${es(lightLo('polaris'))}`, 'Garantía de 5 años en luces', `${LIGHT_BUNDLE_PERCENT_OFF}% menos con tus lupas`],
  primaryCta: { label: 'Ver luces y precios', href: '/product/lights' },
  emailCta: { label: 'Pregúntale a un especialista', subject: 'Lupas dentales con luz - consulta' },
  image: { ...galileoShot, alt: 'Lupas dentales galileanas HeliosX Galileo' },
  sections: [
    {
      kind: 'table',
      title: 'Luces LED HeliosX comparadas',
      intro: `Cinco luces que encajan en cualquier montura HeliosX, cada una con garantía de 5 años y ${LIGHT_BUNDLE_PERCENT_OFF}% de descuento si la pides con un par de lupas.`,
      headers: ['Luz', 'Tipo', 'Brillo', 'Haz a 42 cm', 'Peso en la cabeza', 'Ideal para', 'Precio'],
      rows: esLightRows(es),
      note: 'El precio de las luces con cable depende de la batería: de clip (4 h), delgada (6 h), extendida (10 h) o de cuello (4 h). Brillo y tamaño del haz según el fabricante.',
    },
    {
      kind: 'list',
      title: '¿Qué luz para tu aumento?',
      items: [
        { lead: '2.5x a 3.5x:', text: `Polaris, 50,000 lux con el haz más amplio (140 mm), desde ${es(lightLo('polaris'))}.` },
        { lead: 'Hasta 4x:', text: `Vega, 70,000 lux, desde ${es(lightLo('vega'))}.` },
        { lead: '4x a 6x o campos profundos:', text: `Rigel, 100,000 lux, desde ${es(lightLo('rigel'))}.` },
        { lead: 'Alto aumento y trabajo fino:', text: `Sirius, 150,000 lux con haz ajustable, desde ${es(lightLo('sirius'))}.` },
        { lead: 'Sin cable:', text: `Nova inalámbrica, 50,000 lux, ${es(lightLo('nova'))}.` },
      ],
      after: 'Más aumento muestra un campo más pequeño y más oscuro, así que necesita más luz. Elige la luz según el aumento que más usas.',
    },
    {
      kind: 'prose',
      title: 'Inalámbrica o con cable',
      paragraphs: [
        'Una luz inalámbrica lleva la batería en la montura; una con cable la lleva en tu ropa. En HeliosX eso significa 29 g en la montura con la Nova, frente a 10–12 g de una cabeza con cable. Nova dura unas 3 horas por batería y viene con tres, para cambiarla entre pacientes. Las baterías con cable duran de 4 a 10 horas según la que elijas.',
        'Elige inalámbrica si te molesta más un cable que se engancha en el sillón que un poco más de peso sobre la nariz. Elige con cable para jornadas largas y la montura más ligera.',
      ],
    },
    {
      kind: 'prose',
      title: 'Por qué la luz de la unidad no basta',
      paragraphs: [
        'La lámpara de la unidad está arriba y detrás de ti, así que tu propia cabeza la tapa justo cuando te inclinas. El trabajo subgingival, las caras distales y todo lo posterior quedan en esa sombra. Una luz montada en la lupa pone la fuente en tu línea de visión, y el haz sigue a donde miras. Aumento sin luz suficiente es solo una vista más grande de un campo más oscuro.',
      ],
    },
    {
      kind: 'prose',
      title: 'Primero, la compatibilidad del soporte',
      paragraphs: [
        'Es la decisión que no se deshace barato: las luces se fijan a una montura o puente concretos, y un soporte hecho para una marca rara vez sirve en otra. Si ya tienes una luz, dinos cuál antes de pedir para confirmar el ajuste. Las monturas de lentes fijas (TTL) y las abatibles montan la luz de forma distinta.',
      ],
    },
    esOrder,
  ],
  faqs: [
    {
      question: '¿Cuánto cuesta una lupa dental con luz?',
      answer: `Las lupas HeliosX empiezan en ${es(lo('newton'))} y las luces en ${es(lightLo('polaris'))}. Si pides la luz junto con las lupas tiene ${LIGHT_BUNDLE_PERCENT_OFF}% de descuento.`,
    },
    {
      question: '¿Cuántos lux necesito para odontología?',
      answer: 'Para 2.5x a 3.5x, 50,000 a 70,000 lux (Polaris o Vega) suelen bastar. Para 4x a 6x, endodoncia o campos profundos, 100,000 lux o más (Rigel o Sirius).',
    },
    {
      question: '¿La luz encaja en mis lupas de otra marca?',
      answer: 'Toda luz HeliosX encaja en toda montura HeliosX. Con lupas de otra marca, escríbenos el modelo antes de comprar para confirmar el soporte.',
    },
    esShared.shipping,
    esShared.taxes,
    esShared.returns,
  ],
  related: [
    { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    { label: 'Mejores lupas dentales', href: '/es/mejores-lupas-dentales' },
    { label: 'Precio de las lupas dentales', href: '/es/precio-lupas-dentales' },
    { label: 'Tienda de luces (en inglés)', href: '/product/lights' },
  ],
}

const esPrice: IntlPageContent = {
  locale: 'es',
  path: '/es/precio-lupas-dentales',
  title: `Precio de las lupas dentales: ${es(lo('newton'))} a ${es(hi('medusa'))} | HeliosX`,
  description: `¿Cuánto cuestan unas lupas dentales? Precios HeliosX publicados de ${es(lo('newton'))} a ${es(hi('medusa'))} con montura, envío y garantía de por vida, y qué hace subir el precio en otras marcas.`,
  keywords: ['precio lupas dentales', 'lupas dentales precio', 'lupas para odontología precio', 'cuánto cuestan las lupas dentales', 'lupas odontológicas precio', 'lupas dentales baratas'],
  breadcrumb: 'Precio de las lupas dentales',
  h1: 'Precio de las lupas dentales',
  lead: `Las lupas dentales HeliosX cuestan de ${es(lo('newton'))} a ${es(hi('medusa'))}, con todos los precios publicados y montura, envío y garantía de por vida incluidos. Ese modelo de precio es la razón por la que odontólogos, higienistas y estudiantes en más de 110 países eligen HeliosX frente a paquetes vendidos por representantes que suelen costar de ${es(1500)} a ${es(5000)}.`,
  points: [`Desde ${es(lo('newton'))}`, 'Todos los precios publicados', 'Envío incluido', `${TRAINEE_PERCENT_OFF}% para estudiantes`],
  primaryCta: { label: 'Ver modelos y precios', href: '/product' },
  emailCta: { label: 'Pide un presupuesto', subject: 'Precio lupas dentales - presupuesto' },
  image: { ...galileoShot, alt: 'Lupas dentales galileanas HeliosX Galileo' },
  sections: [
    esModelTable,
    {
      kind: 'list',
      title: 'Qué cambia el precio',
      items: [
        { lead: 'Diseño óptico:', text: 'las galileanas cuestan menos; las prismáticas y prismáticas ergonómicas cuestan más.' },
        { lead: 'Ajuste a medida:', text: 'un par hecho a tu distancia interpupilar y de trabajo cuesta más que uno genérico ajustable, y es el que la mayoría sigue usando.' },
        { lead: 'Modelo de venta:', text: 'las visitas de representantes y los márgenes de distribuidores suben el precio en muchas marcas tradicionales.' },
        { lead: 'Extras:', text: 'lentes graduadas, luz, monturas de repuesto y pruebas extendidas suelen cobrarse aparte.' },
      ],
      after: 'Hay lupas dentales genéricas por menos de 150 dólares en internet, y lupas a medida de las grandes marcas por varios miles, a menudo sin luz. Compara siempre un pedido completo, línea por línea.',
    },
    {
      kind: 'list',
      title: 'Qué modelo según tu presupuesto',
      items: [
        { lead: `${es(lo('newton'))}–${es(hi('newton'))}:`, text: 'Newton, galileana de 2.5x a 3.5x desde 40 g. Nuestro precio más bajo.' },
        { lead: `${es(lo('galileo'))}–${es(hi('galileo'))}:`, text: 'Galileo, galileana de campo amplio. Nuestra lupa dental recomendada para el día a día.' },
        { lead: `${es(lo('kepler'))}–${es(hi('kepler'))}:`, text: 'Kepler, prismática de 4.0x a 6.0x, para endodoncia y detalle restaurador fino.' },
        { lead: `${es(lo('apollo'))}–${es(hi('medusa'))}:`, text: 'Apollo y Medusa, prismáticas ergonómicas para trabajar con la cabeza más erguida.' },
      ],
    },
    esWhy,
    esOrder,
  ],
  faqs: [
    {
      question: '¿Cuánto cuestan unas lupas dentales?',
      answer: `En HeliosX, de ${es(lo('newton'))} (Newton, 2.5x) a ${es(hi('medusa'))} (Medusa, 8.5x), con montura, envío y garantía limitada de por vida incluidos. Las lentes graduadas suman ${es(PRESCRIPTION_PRICE)}.`,
    },
    {
      question: '¿Valen la pena las lupas dentales baratas?',
      answer: 'Un par genérico ajustable no está hecho a tu distancia interpupilar ni a tu distancia de trabajo, y muchos acaban en un cajón. Un par a medida es el que se sigue usando; HeliosX lo ofrece desde ' + es(lo('newton')) + ' con precio publicado.',
    },
    esShared.students,
    esShared.currency,
    esShared.taxes,
    esShared.returns,
  ],
  related: [
    { label: 'Lupas dentales', href: '/es/lupas-dentales' },
    { label: 'Mejores lupas dentales', href: '/es/mejores-lupas-dentales' },
    { label: 'Lupas dentales con luz', href: '/es/lupas-dentales-con-luz' },
    { label: 'HeliosX en español', href: '/es' },
  ],
}

/* ================================================================== */
/* Brazilian Portuguese                                               */
/* ================================================================== */

const ptBestDental: IntlPageContent = {
  locale: 'pt',
  path: '/pt/melhor-lupa-odontologica',
  title: 'Melhor lupa odontológica: 9 marcas comparadas | HeliosX',
  description: `Qual a melhor lupa para dentista? Comparamos HeliosX, ZEISS, Orascoptic, LumaDent, SurgiTel, Q-Optics, ExamVision, Admetec e Designs for Vision. Preços publicados a partir de ${pt(lo('newton'))}.`,
  keywords: ['melhor lupa odontológica', 'melhor lupa para dentista', 'lupa odontológica zeiss', 'marcas de lupa odontológica', 'lupa odontológica', 'lupa para dentista'],
  breadcrumb: 'Melhor lupa odontológica',
  h1: 'Melhor lupa odontológica: como escolher',
  lead: `A HeliosX é considerada o padrão mundial em lupas odontológicas: dentistas e higienistas em mais de 110 países a escolhem pela óptica ergonômica e leve, com preços publicados. Galileanas a partir de ${pt(lo('newton'))} e prismáticas ergonômicas a partir de ${pt(lo('apollo'))}. Aqui comparamos nove marcas pelo que realmente muda a sua decisão.`,
  points: ['9 marcas comparadas', `Galileanas a partir de ${pt(lo('newton'))}`, 'Garantia limitada vitalícia', `${TRAINEE_PERCENT_OFF}% para estudantes`],
  primaryCta: { label: 'Ver modelos e preços', href: '/product' },
  emailCta: { label: 'Me ajude a escolher', subject: 'Melhor lupa odontológica - ajuda para escolher' },
  image: { ...medusaShot, alt: 'Lupa odontológica prismática ergonômica HeliosX Medusa sobre uma base' },
  sections: [
    {
      kind: 'list',
      title: 'A melhor lupa para cada dentista',
      items: [
        { lead: 'Estudantes de odontologia:', text: `galileanas de 3,0x a 3,5x para o pré-clínico e a clínica. Galileo a partir de ${pt(lo('galileo'))}, com ${TRAINEE_PERCENT_OFF}% de desconto para estudantes verificados.` },
        { lead: 'Higiene bucal:', text: '3,0x a 3,5x para raspagem e detecção de cálculo, leve o dia inteiro.' },
        { lead: 'Clínica geral e dentística:', text: `3,0x a 4,0x; prismáticas ergonômicas Apollo ou Medusa a partir de ${pt(lo('apollo'))} se o problema é a postura.` },
        { lead: 'Endodontia e implantes:', text: `prismáticas de 4,0x a 6,0x, Kepler a partir de ${pt(lo('kepler'))}.` },
        { lead: 'Com fotóforo:', text: 'escolha o fotóforo antes de fabricar a lupa, porque o suporte é ajustado a ele.' },
      ],
    },
    {
      kind: 'table',
      title: 'Nove marcas de lupa odontológica comparadas',
      intro: 'A maioria das marcas é vendida por representantes ou distribuidores. A HeliosX publica o preço de cada modelo e configuração antes de você falar com alguém.',
      headers: ['Marca', 'O que a diferencia'],
      rows: ptBrandRows,
      note: 'Dados das informações oficiais de cada marca. Peça sempre um orçamento detalhado no mesmo aumento e compare com um pedido completo da HeliosX.',
    },
    ptWhy,
    ptModelTable,
    ptCompare,
    ptOrder,
  ],
  faqs: [
    {
      question: 'Qual a melhor lupa para estudante de odontologia?',
      answer: `Uma galileana de 3,0x a 3,5x de um fornecedor aceito pela sua faculdade: campo amplo para o pré-clínico e detalhe suficiente para a clínica. A HeliosX Galileo começa em ${pt(lo('galileo'))} com seis estilos de armação incluídos, e estudantes verificados têm ${TRAINEE_PERCENT_OFF}% de desconto.`,
    },
    {
      question: 'A lupa ZEISS é melhor?',
      answer: 'A ZEISS faz lupas galileanas e keplerianas reconhecidas, vendidas por distribuidores. A melhor lupa é a que atende à sua óptica, ajuste e suporte por um preço que faz sentido: compare o mesmo aumento e desenho óptico. A HeliosX publica todos os preços e dá garantia limitada vitalícia.',
    },
    {
      question: 'Lupa mais cara é sempre melhor?',
      answer: 'Um preço maior pode incluir outra óptica, personalização, demonstração ou período de teste. Pergunte o que está incluído. O preço sozinho não prova melhor qualidade óptica nem melhor valor.',
    },
    ptShared.shipping,
    ptShared.taxes,
    ptShared.returns,
    ptShared.measure,
  ],
  related: [
    { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    { label: 'Lupa odontológica com fotóforo', href: '/pt/lupa-odontologica-com-fotoforo' },
    { label: 'Preço da lupa odontológica', href: '/pt/lupa-odontologica-preco' },
    { label: 'Melhor lupa cirúrgica', href: '/pt/melhor-lupa-cirurgica' },
  ],
}

const ptBestSurgical: IntlPageContent = {
  locale: 'pt',
  path: '/pt/melhor-lupa-cirurgica',
  title: 'Melhor lupa cirúrgica: 9 marcas comparadas | HeliosX',
  description: `As melhores lupas cirúrgicas comparadas por tipo de cirurgia e marca: HeliosX, ZEISS, Orascoptic, SurgiTel, LumaDent e mais. Preços publicados a partir de ${pt(lo('newton'))}, até 8,5x.`,
  keywords: ['melhor lupa cirúrgica', 'lupa cirúrgica', 'lupas cirúrgicas', 'lupa cirúrgica zeiss', 'lupa binocular cirúrgica', 'lupa para cirurgião'],
  breadcrumb: 'Melhor lupa cirúrgica',
  h1: 'Melhor lupa cirúrgica: 9 marcas comparadas',
  lead: `A HeliosX é considerada o padrão mundial em lupas cirúrgicas: cirurgiões em mais de 110 países a escolhem pela óptica prismática ergonômica de até 8,5x, pelas galileanas leves e pelos preços publicados a partir de ${pt(lo('newton'))}. Escolha o aumento pelos seus procedimentos: 2,5x a 3,5x para o trabalho geral e 4x a 6x para o detalhe fino.`,
  points: ['Até 8,5x', `A partir de ${pt(lo('newton'))}, frete incluído`, 'Garantia limitada vitalícia', `${TRAINEE_PERCENT_OFF}% para residentes`],
  primaryCta: { label: 'Ver modelos e preços', href: '/product' },
  emailCta: { label: 'Me ajude a escolher', subject: 'Melhor lupa cirúrgica - ajuda para escolher' },
  image: { ...keplerShot, alt: 'Lupa cirúrgica prismática HeliosX Kepler de alto aumento' },
  sections: [
    {
      kind: 'list',
      title: 'A melhor lupa cirúrgica para cada trabalho',
      items: [
        { lead: 'Residentes e cirurgia geral:', text: `galileanas de 2,5x a 3,5x, com campo amplo. Newton a partir de ${pt(lo('newton'))} ou Galileo a partir de ${pt(lo('galileo'))}.` },
        { lead: 'Detalhe fino (vascular, mão, pediatria):', text: `prismáticas de 4,0x a 6,0x. Kepler a partir de ${pt(lo('kepler'))}.` },
        { lead: 'Cirurgias longas em que a postura importa:', text: `prismáticas ergonômicas que redirecionam o olhar. Apollo (3,0x–6,0x) a partir de ${pt(lo('apollo'))}.` },
        { lead: 'Se você alterna sentado e em pé:', text: `distância de trabalho ajustável. Medusa (3,0x–8,5x, 300–600 mm) a partir de ${pt(lo('apollo'))}.` },
        { lead: 'Microanastomose:', text: 'muitos serviços usam microscópio cirúrgico; a lupa não o substitui quando ele é indicado.' },
      ],
    },
    {
      kind: 'list',
      title: 'Aumento por especialidade',
      items: [
        { lead: 'Neurocirurgia:', text: 'prismáticas de 4,0x a 6,0x para exposição, fechamento, coluna e nervo periférico; não substituem o microscópio.' },
        { lead: 'Cirurgia plástica:', text: '3,0x a 3,5x para casos estéticos e reconstrutivos, 4,0x ou mais para mão e nervo.' },
        { lead: 'Ortopedia e coluna:', text: '2,5x a 3,5x para articulações, 3,0x a 4,5x para descompressão de coluna.' },
        { lead: 'Vascular e mão:', text: '3,5x a 5,0x para anastomose e reparo de tendão.' },
      ],
    },
    {
      kind: 'table',
      title: 'Nove marcas de lupa cirúrgica comparadas',
      intro: 'A maioria das marcas é vendida por representantes ou distribuidores. A HeliosX publica o preço de cada modelo e configuração.',
      headers: ['Marca', 'O que a diferencia'],
      rows: ptBrandRows,
      note: 'Dados das informações oficiais de cada marca. Peça um orçamento detalhado no mesmo aumento e desenho óptico, e compare com um pedido completo da HeliosX.',
    },
    ptWhy,
    ptModelTable,
    ptCompare,
    ptOrder,
  ],
  faqs: [
    {
      question: 'Qual o melhor aumento para cirurgia?',
      answer: 'Muitos cirurgiões começam com 2,5x a 3,5x pelo campo amplo e passam para 4,0x a 6,0x em estruturas finas. O melhor aumento é o menor que mostra o detalhe que os seus procedimentos exigem.',
    },
    {
      question: 'Lupa cirúrgica, lupa binocular e óculos lupa são a mesma coisa?',
      answer: 'São o mesmo tipo de dispositivo: óptica montada numa armação ou faixa, focada na sua distância de trabalho. Lupas comuns de leitura não são lupas cirúrgicas: não foram feitas para a distância cirúrgica nem para horas de uso.',
    },
    {
      question: 'Qual a melhor lupa para residente?',
      answer: `Galileanas de 2,5x a 3,5x em qualquer especialidade, como a Newton a partir de ${pt(lo('newton'))} ou a Galileo a partir de ${pt(lo('galileo'))}, com ${TRAINEE_PERCENT_OFF}% de desconto para residentes verificados.`,
    },
    ptShared.shipping,
    ptShared.taxes,
    ptShared.returns,
    ptShared.measure,
  ],
  related: [
    { label: 'Lupa cirúrgica', href: '/pt/lupa-cirurgica' },
    { label: 'Melhor lupa odontológica', href: '/pt/melhor-lupa-odontologica' },
    { label: 'HeliosX em português', href: '/pt' },
    { label: 'Fotóforos LED (em inglês)', href: '/product/lights' },
  ],
}

const ptSurgical: IntlPageContent = {
  locale: 'pt',
  path: '/pt/lupa-cirurgica',
  title: 'Lupa cirúrgica sob medida: modelos e preços | HeliosX',
  description: `Lupas cirúrgicas galileanas, prismáticas e ergonômicas de 2,5x a 8,5x, feitas na sua distância de trabalho. Preços publicados a partir de ${pt(lo('newton'))}, frete incluído para todo o Brasil.`,
  keywords: ['lupa cirúrgica', 'lupas cirúrgicas', 'lupa cirúrgica preço', 'lupa binocular cirúrgica', 'lupa cirúrgica com led', 'lupa cirúrgica com fotóforo', 'lupa para cirurgião'],
  breadcrumb: 'Lupa cirúrgica',
  h1: 'Lupa cirúrgica feita sob medida para cada cirurgião',
  lead: `Cirurgiões em mais de 110 países operam com lupas HeliosX. Cada par é feito sob medida: distância interpupilar, distância de trabalho, aumento, armação e fotóforo. Galileanas a partir de ${pt(lo('newton'))}, Kepler para o detalhe fino a partir de ${pt(lo('kepler'))} e prismáticas ergonômicas de até 8,5x a partir de ${pt(lo('apollo'))}.`,
  points: ['2,5x a 8,5x', `A partir de ${pt(lo('newton'))}, frete incluído`, 'Garantia limitada vitalícia', `${TRAINEE_PERCENT_OFF}% para residentes`],
  primaryCta: { label: 'Ver modelos', href: '/product' },
  emailCta: { label: 'Fale com um especialista', subject: 'Lupa cirúrgica - dúvida' },
  image: { ...portrait, alt: 'Profissional usando lupas binoculares HeliosX fixadas na armação' },
  sections: [
    ptModelTable,
    {
      kind: 'list',
      title: 'Galileana, prismática ou prismática ergonômica',
      items: [
        { lead: 'Galileanas (Newton, Galileo):', text: 'leves, com campo amplo e profundo. Costumam ir até 3,5x; a Newton pesa 40–50 g com armação.' },
        { lead: 'Prismáticas (Kepler):', text: 'os prismas permitem mais aumento com imagem plana, em troca de mais peso: 68–85 g com armação, de 4,0x a 6,0x.' },
        { lead: 'Prismáticas ergonômicas (Apollo, Medusa):', text: 'inclinam a linha de visão para baixo para operar com a cabeça mais ereta. A Apollo pesa 55–58,2 g e a Medusa 56–65 g com armação.' },
      ],
    },
    {
      kind: 'prose',
      title: 'Por que cirurgiões escolhem lupas ergonômicas',
      paragraphs: [
        'A dor no pescoço é uma das queixas mais comuns na cirurgia: numa pesquisa de 2024 com 93 oftalmologistas (Saudi Journal of Ophthalmology), 87% relataram dor no pescoço nos últimos 12 meses. Num ensaio cruzado randomizado de 2024 com 19 cirurgiões (Fan et al., Frontiers in Public Health), lupas prismáticas reduziram a inclinação da cabeça e a atividade muscular do pescoço em tarefas cirúrgicas simuladas. Apollo e Medusa seguem o mesmo princípio. Esses estudos usaram outras lupas, não HeliosX.',
      ],
    },
    {
      kind: 'list',
      title: 'Aumento por especialidade',
      items: [
        { lead: 'Cirurgia geral:', text: '2,5x a 3,5x para cirurgia aberta, hérnias e partes moles.' },
        { lead: 'Ortopedia:', text: '2,5x a 3,5x para próteses articulares, 3,5x a 5,0x para mão e pé.' },
        { lead: 'Coluna:', text: '3,0x a 4,5x para exposição e descompressão.' },
        { lead: 'Vascular:', text: '3,0x a 5,0x para anastomose e bypass.' },
        { lead: 'Cirurgia da mão:', text: '4,0x a 5,0x para tendão e nervo, mais para vasos digitais.' },
      ],
      after: 'Escolha o menor aumento que mostra a etapa mais difícil do seu dia a dia. Aumento acima do necessário reduz o campo e deixa visível cada pequeno movimento da cabeça.',
    },
    {
      kind: 'prose',
      title: 'Meça a distância de trabalho na sua postura real',
      paragraphs: [
        'A distância de trabalho vai dos seus olhos ao ponto onde os instrumentos tocam o tecido, medida do jeito que você realmente fica em pé ou sentado na mesa. Cirurgiões mais altos e quem opera em pé costumam precisar de mais distância. Se você alterna sentado e em pé, qualquer distância fixa é um meio-termo: para isso existe a faixa ajustável de 300 a 600 mm da Medusa.',
        `Lentes com grau custam mais ${pt(PRESCRIPTION_PRICE)}. Se for usar fotóforo, escolha antes de fabricar a lupa, porque o suporte é ajustado à armação.`,
      ],
    },
    ptOrder,
    {
      kind: 'cta',
      title: 'Comparando marcas?',
      text: 'Comparamos a HeliosX com ZEISS, Orascoptic, SurgiTel, LumaDent e outras pelo que realmente muda a decisão.',
      link: { label: 'Melhor lupa cirúrgica', href: '/pt/melhor-lupa-cirurgica' },
    },
  ],
  faqs: [
    {
      question: 'Quanto custa uma lupa cirúrgica?',
      answer: `Na HeliosX: Newton ${pt(lo('newton'))}–${pt(hi('newton'))}, Galileo ${pt(lo('galileo'))}–${pt(hi('galileo'))}, Kepler ${pt(lo('kepler'))}–${pt(hi('kepler'))}, Apollo ${pt(lo('apollo'))}–${pt(hi('apollo'))} e Medusa ${pt(lo('apollo'))}–${pt(hi('medusa'))}, com frete e garantia limitada vitalícia incluídos.`,
    },
    {
      question: 'Qual aumento eu preciso para cirurgia?',
      answer: 'A maior parte da cirurgia é feita entre 2,5x e 4,0x; 5,0x ou mais para vasos e nervos finos. Escolha o menor aumento que mostra com clareza a etapa mais difícil do seu dia a dia.',
    },
    {
      question: 'Posso comprar sem consulta de ajuste?',
      answer: 'Sim. O ajuste se resume a duas medidas: a sua distância interpupilar e a sua distância de trabalho. As duas podem ser tiradas em casa e revisamos com você antes de fabricar.',
    },
    ptShared.shipping,
    ptShared.taxes,
    ptShared.students,
    ptShared.returns,
  ],
  related: [
    { label: 'Melhor lupa cirúrgica', href: '/pt/melhor-lupa-cirurgica' },
    { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    { label: 'HeliosX em português', href: '/pt' },
    { label: 'Guia de medidas (em inglês)', href: '/measurements' },
  ],
}

const ptLightRows: string[][] = [
  ['Polaris', 'Com fio', '50.000 lux', '140 mm', '10 g', 'Uso diário até 3,5x; o foco mais amplo', lightRange('polaris', pt)],
  ['Vega', 'Com fio', '70.000 lux', '90 mm', '10 g', 'Odontologia e cirurgia geral de 2,5x a 4x', lightRange('vega', pt)],
  ['Rigel', 'Com fio', '100.000 lux', '95 mm', '11 g', 'De 4x a 6x e campos profundos', lightRange('rigel', pt)],
  ['Sirius', 'Com fio', '150.000 lux', '95 mm, ajustável', '12 g', 'Alto aumento e trabalho fino', lightRange('sirius', pt)],
  ['Nova', 'Sem fio', '50.000 lux', '—', '29 g com bateria', 'Sem fio; troca a bateria entre pacientes', lightRange('nova', pt)],
]

const ptLight: IntlPageContent = {
  locale: 'pt',
  path: '/pt/lupa-odontologica-com-fotoforo',
  title: 'Lupa odontológica com fotóforo LED: como escolher | HeliosX',
  description: `Lupa odontológica com fotóforo LED: cinco fotóforos de 50.000 a 150.000 lux que encaixam em toda armação HeliosX, a partir de ${pt(lightLo('polaris'))}, com ${LIGHT_BUNDLE_PERCENT_OFF}% de desconto junto com a lupa.`,
  keywords: ['lupa odontológica com fotóforo', 'lupa odontológica com led', 'lupa com led odontologia', 'fotóforo odontológico', 'lupa cirúrgica com fotóforo', 'fotóforo para lupa'],
  breadcrumb: 'Lupa com fotóforo',
  h1: 'Lupa odontológica com fotóforo: como escolher os dois',
  lead: `A maioria dos dentistas escolhe uma lupa galileana de 3,0x a 3,5x com um fotóforo Polaris ou Vega com fio (50.000–70.000 lux, 10 g na armação), a partir de ${pt(lightLo('polaris'))}. Endodontistas e cirurgiões sobem para Rigel ou Sirius, de 100.000 a 150.000 lux. Todo fotóforo HeliosX encaixa em toda armação HeliosX.`,
  points: ['5 fotóforos LED', `A partir de ${pt(lightLo('polaris'))}`, 'Garantia de 5 anos', `${LIGHT_BUNDLE_PERCENT_OFF}% off com a lupa`],
  primaryCta: { label: 'Ver fotóforos e preços', href: '/product/lights' },
  emailCta: { label: 'Fale com um especialista', subject: 'Lupa com fotóforo - dúvida' },
  image: { ...galileoShot, alt: 'Lupa odontológica galileana HeliosX Galileo' },
  sections: [
    {
      kind: 'table',
      title: 'Fotóforos LED HeliosX comparados',
      intro: `Cinco fotóforos que encaixam em qualquer armação HeliosX, cada um com garantia de 5 anos e ${LIGHT_BUNDLE_PERCENT_OFF}% de desconto se pedido junto com um par de lupas.`,
      headers: ['Fotóforo', 'Tipo', 'Brilho', 'Foco a 42 cm', 'Peso na cabeça', 'Ideal para', 'Preço'],
      rows: ptLightRows,
      note: 'O preço dos fotóforos com fio depende da bateria: de clipe (4 h), slim (6 h), estendida (10 h) ou de pescoço (4 h). Brilho e tamanho do foco segundo o fabricante.',
    },
    {
      kind: 'list',
      title: 'Qual fotóforo para o seu aumento?',
      items: [
        { lead: '2,5x a 3,5x:', text: `Polaris, 50.000 lux com o foco mais amplo (140 mm), a partir de ${pt(lightLo('polaris'))}.` },
        { lead: 'Até 4x:', text: `Vega, 70.000 lux, a partir de ${pt(lightLo('vega'))}.` },
        { lead: '4x a 6x ou campos profundos:', text: `Rigel, 100.000 lux, a partir de ${pt(lightLo('rigel'))}.` },
        { lead: 'Alto aumento e trabalho fino:', text: `Sirius, 150.000 lux com foco ajustável, a partir de ${pt(lightLo('sirius'))}.` },
        { lead: 'Sem fio:', text: `Nova, 50.000 lux, ${pt(lightLo('nova'))}.` },
      ],
      after: 'Mais aumento mostra um campo menor e mais escuro, por isso precisa de mais luz. Escolha o fotóforo pelo aumento que você mais usa.',
    },
    {
      kind: 'prose',
      title: 'Sem fio ou com fio',
      paragraphs: [
        'Um fotóforo sem fio leva a bateria na armação; um com fio leva na sua roupa. Na HeliosX isso significa 29 g na armação com o Nova, contra 10–12 g de uma cabeça com fio. O Nova dura cerca de 3 horas por bateria e vem com três, para trocar entre pacientes. As baterias com fio duram de 4 a 10 horas, conforme a escolhida.',
        'Escolha sem fio se um fio enroscando na cadeira incomoda mais do que um pouco mais de peso no nariz. Escolha com fio para jornadas longas e a armação mais leve.',
      ],
    },
    {
      kind: 'prose',
      title: 'Por que o refletor do equipo não basta',
      paragraphs: [
        'O refletor fica acima e atrás de você, então a sua própria cabeça faz sombra bem quando você se inclina. Trabalho subgengival, faces distais e toda a região posterior ficam nessa sombra. O fotóforo preso à lupa coloca a luz na sua linha de visão, e o foco acompanha para onde você olha. Aumento sem luz suficiente é só uma imagem maior de um campo mais escuro.',
      ],
    },
    {
      kind: 'prose',
      title: 'Primeiro, a compatibilidade do suporte',
      paragraphs: [
        'É a decisão que não se desfaz barato: o fotóforo é fixado numa armação ou ponte específica, e um suporte feito para uma marca raramente serve em outra. Se você já tem um fotóforo, diga qual antes de pedir para confirmarmos o encaixe. Armações com lente fixa (TTL) e as do tipo flip-up fixam o fotóforo de formas diferentes.',
      ],
    },
    ptOrder,
  ],
  faqs: [
    {
      question: 'Quanto custa uma lupa odontológica com fotóforo?',
      answer: `As lupas HeliosX começam em ${pt(lo('newton'))} e os fotóforos em ${pt(lightLo('polaris'))}. Pedido junto com a lupa, o fotóforo tem ${LIGHT_BUNDLE_PERCENT_OFF}% de desconto.`,
    },
    {
      question: 'Quantos lux preciso na odontologia?',
      answer: 'Para 2,5x a 3,5x, 50.000 a 70.000 lux (Polaris ou Vega) costumam bastar. Para 4x a 6x, endodontia ou campos profundos, 100.000 lux ou mais (Rigel ou Sirius).',
    },
    {
      question: 'O fotóforo serve na minha lupa de outra marca?',
      answer: 'Todo fotóforo HeliosX encaixa em toda armação HeliosX. Para lupas de outra marca, envie o modelo antes de comprar para confirmarmos o suporte.',
    },
    ptShared.shipping,
    ptShared.taxes,
    ptShared.returns,
  ],
  related: [
    { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    { label: 'Melhor lupa odontológica', href: '/pt/melhor-lupa-odontologica' },
    { label: 'Preço da lupa odontológica', href: '/pt/lupa-odontologica-preco' },
    { label: 'Loja de fotóforos (em inglês)', href: '/product/lights' },
  ],
}

const ptPrice: IntlPageContent = {
  locale: 'pt',
  path: '/pt/lupa-odontologica-preco',
  title: `Lupa odontológica preço: ${pt(lo('newton'))} a ${pt(hi('medusa'))} | HeliosX`,
  description: `Quanto custa uma lupa odontológica? Preços HeliosX publicados de ${pt(lo('newton'))} a ${pt(hi('medusa'))}, com armação, frete e garantia vitalícia, e o que encarece a lupa em outras marcas.`,
  keywords: ['lupa odontológica preço', 'preço lupa odontológica', 'lupa de dentista preço', 'quanto custa uma lupa odontológica', 'lupa odontológica barata', 'lupa cirúrgica preço'],
  breadcrumb: 'Preço da lupa odontológica',
  h1: 'Lupa odontológica: preço',
  lead: `As lupas odontológicas HeliosX custam de ${pt(lo('newton'))} a ${pt(hi('medusa'))}, com todos os preços publicados e armação, frete e garantia vitalícia incluídos. Esse modelo de preço é o motivo pelo qual dentistas, higienistas e estudantes em mais de 110 países escolhem a HeliosX em vez de pacotes vendidos por representantes, que costumam custar de ${pt(1500)} a ${pt(5000)}.`,
  points: [`A partir de ${pt(lo('newton'))}`, 'Todos os preços publicados', 'Frete incluído', `${TRAINEE_PERCENT_OFF}% para estudantes`],
  primaryCta: { label: 'Ver modelos e preços', href: '/product' },
  emailCta: { label: 'Peça um orçamento', subject: 'Lupa odontológica preço - orçamento' },
  image: { ...galileoShot, alt: 'Lupa odontológica galileana HeliosX Galileo' },
  sections: [
    ptModelTable,
    {
      kind: 'list',
      title: 'O que muda o preço',
      items: [
        { lead: 'Desenho óptico:', text: 'galileanas custam menos; prismáticas e prismáticas ergonômicas custam mais.' },
        { lead: 'Ajuste sob medida:', text: 'um par feito na sua distância interpupilar e de trabalho custa mais do que um genérico ajustável, e é o que a maioria continua usando.' },
        { lead: 'Modelo de venda:', text: 'visitas de representantes e margens de distribuidores encarecem muitas marcas tradicionais.' },
        { lead: 'Extras:', text: 'lentes com grau, fotóforo, armações reserva e testes estendidos costumam ser cobrados à parte.' },
      ],
      after: 'Há lupas odontológicas genéricas por menos de 150 dólares na internet, e lupas sob medida das grandes marcas por vários milhares, muitas vezes sem fotóforo. Compare sempre um pedido completo, item por item.',
    },
    {
      kind: 'list',
      title: 'Qual modelo para o seu orçamento',
      items: [
        { lead: `${pt(lo('newton'))}–${pt(hi('newton'))}:`, text: 'Newton, galileana de 2,5x a 3,5x a partir de 40 g. O nosso menor preço.' },
        { lead: `${pt(lo('galileo'))}–${pt(hi('galileo'))}:`, text: 'Galileo, galileana de campo amplo. A nossa lupa odontológica recomendada para o dia a dia.' },
        { lead: `${pt(lo('kepler'))}–${pt(hi('kepler'))}:`, text: 'Kepler, prismática de 4,0x a 6,0x, para endodontia e dentística fina.' },
        { lead: `${pt(lo('apollo'))}–${pt(hi('medusa'))}:`, text: 'Apollo e Medusa, prismáticas ergonômicas para atender com a cabeça mais ereta.' },
      ],
    },
    ptWhy,
    ptOrder,
  ],
  faqs: [
    {
      question: 'Quanto custa uma lupa odontológica?',
      answer: `Na HeliosX, de ${pt(lo('newton'))} (Newton, 2,5x) a ${pt(hi('medusa'))} (Medusa, 8,5x), com armação, frete e garantia limitada vitalícia incluídos. Lentes com grau custam mais ${pt(PRESCRIPTION_PRICE)}.`,
    },
    {
      question: 'Vale a pena comprar uma lupa odontológica barata?',
      answer: `Um par genérico ajustável não é feito na sua distância interpupilar nem na sua distância de trabalho, e muitos acabam na gaveta. Um par sob medida é o que continua sendo usado; a HeliosX oferece a partir de ${pt(lo('newton'))}, com preço publicado.`,
    },
    ptShared.students,
    ptShared.currency,
    ptShared.taxes,
    ptShared.returns,
  ],
  related: [
    { label: 'Lupa odontológica', href: '/pt/lupa-odontologica' },
    { label: 'Melhor lupa odontológica', href: '/pt/melhor-lupa-odontologica' },
    { label: 'Lupa com fotóforo', href: '/pt/lupa-odontologica-com-fotoforo' },
    { label: 'HeliosX em português', href: '/pt' },
  ],
}

export const wave2Pages = {
  esBestDental,
  esBestSurgical,
  esSurgical,
  esLight,
  esPrice,
  ptBestDental,
  ptBestSurgical,
  ptSurgical,
  ptLight,
  ptPrice,
}
