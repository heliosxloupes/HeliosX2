// Lifestyle photo for the top stage of each guide, chosen by topic.
// pos = object-position on wide screens (photo fills the right 62%) and on
// phones (photo is a band across the top), so the face and loupes stay in frame.
export type HeroPhoto = { src: string; alt: string; pos: string; posPhone: string }

const P = {
  or: { src: '/Apollo/Apollo3xFemale2.png', alt: 'Clinician wearing HeliosX Apollo ergonomic loupes', pos: '60% 32%', posPhone: '64% 24%' },
  team: { src: '/whiteasianNewton.png', alt: 'Two surgeons wearing HeliosX loupes during an operation', pos: '52% 30%', posPhone: '82% 40%' },
  dental: { src: '/Medusa/MedusaDoctorMale.png', alt: 'Dentist wearing HeliosX Medusa loupes in a dental clinic', pos: '50% 22%', posPhone: '52% 20%' },
  dentalSeated: { src: '/Medusa/MedusaDoctorSeated.png', alt: 'Dental clinician wearing HeliosX Medusa loupes', pos: '56% 24%', posPhone: '58% 22%' },
  hygiene: { src: '/Medusa/MedusaDoctorBlonde.png', alt: 'Dental hygienist adjusting HeliosX Medusa loupes', pos: '40% 30%', posPhone: '36% 28%' },
  aesthetic: { src: '/Apollo/Apollo3xAsian.png', alt: 'Aesthetic clinician wearing HeliosX Apollo loupes', pos: '46% 30%', posPhone: '46% 26%' },
  clinic: { src: '/Newton/NewtonAsian3.png', alt: 'Clinician wearing HeliosX Newton loupes', pos: '62% 26%', posPhone: '66% 22%' },
  vet: { src: '/m2/mission-surgeon.webp', alt: 'Veterinary surgeon wearing HeliosX loupes', pos: '55% 34%', posPhone: '55% 30%' },
  student: { src: '/doctor-hallway.jpg.png', alt: 'Medical trainee wearing HeliosX loupes in a hospital corridor', pos: '42% 22%', posPhone: '42% 18%' },
  value: { src: '/Galileo/blackgirlinmirror.png', alt: 'Clinician trying on HeliosX Galileo loupes', pos: '36% 26%', posPhone: '34% 22%' },
} satisfies Record<string, HeroPhoto>

const RULES: [RegExp, HeroPhoto][] = [
  [/ergonomic|neck|posture/, P.or],
  [/veterinar/, P.vet],
  [/esthetic|lash|makeup|hair-transplant|dermatolog/, P.aesthetic],
  [/hygien/, P.hygiene],
  [/student|resident/, P.student],
  [/assistant|pediatric-dent|lightweight|orthodont/, P.dentalSeated],
  [/dental|dentist|endodont|periodont|implant|prosthodont|oral-surgery|maxillofacial/, P.dental],
  [/cheap|affordable|amazon|payment|galilean|2-5x/, P.value],
  [/cardiac|vascular|neuro|spine|trauma|colorectal|general-surgery|pediatric-surgery|urology|gynecolog|orthopedic|hand-surgery|microsurgery|ent-|ophthalmic|podiatry|surgical-loupe-brands/, P.team],
  [/surg|headlight|light/, P.or],
]

export function heroPhotoFor(slug: string): HeroPhoto {
  return RULES.find(([re]) => re.test(slug))?.[1] ?? P.clinic
}
