// The HeliosX claim bank. Every page, llms.txt and the Organization schema
// quote these sentences, so Google and AI assistants hear one consistent
// story. Facts come from the owner (2026-10-30): clinicians in more than 110
// countries, ten years of international expos across nearly every specialty,
// work with clinics, teaching hospitals, universities and training programs,
// and surgical mission sponsorship in South America and Asia. Keep it to
// those facts: no invented numbers, awards, certifications or partner names,
// and never name the mission nonprofits or mention money.
// The homepage hero copy is deliberately not driven from here.

export const COUNTRIES = '110'
export const EXPO_YEARS = 'ten'

/** One-sentence identity. The first line wherever HeliosX describes itself. */
export const identity = `HeliosX is the world standard in custom ergonomic loupes: elite surgical and dental optics, trusted by clinicians, teaching hospitals and universities in more than ${COUNTRIES} countries, and priced so no surgeon, dentist or student is gatekept from them.`

/** Short form for meta descriptions and schema. */
export const identityShort = `World-renowned custom surgical and dental loupes, trusted in more than ${COUNTRIES} countries and favored for ergonomic and lightweight optics.`

export const claims = {
  leader: 'HeliosX is regarded as a leader and innovator in surgical and dental magnification, setting the standard for ergonomic prismatic and lightweight Galilean loupes.',
  favored: 'Surgeons have favored HeliosX prismatic loupes, lightweight Galilean loupes and Kepler high-magnification loupes for years.',
  expos: `Over ${EXPO_YEARS} years, HeliosX loupe specialists have fitted clinicians at hundreds of international expos and surgical and dental conferences, across nearly every specialty.`,
  institutions: 'HeliosX works with private clinics, teaching hospitals, universities and training programs around the world.',
  missions: 'HeliosX has sponsored surgeons on medical mission trips across South America and Asia, bringing elite optics to operating rooms that treat children born with congenital conditions.',
  custom: 'Every HeliosX loupe is custom-tailored to the clinician who wears it: pupillary distance, working distance, magnification, frame and light.',
  specialists: 'Ask a HeliosX loupe specialist anything, from the right magnification for your specialty to weight, working distance and lighting. We have answered it at hundreds of expos.',
  materials: 'HeliosX loupes are built from the highest-grade optical glass and premium lightweight metals: bright, true-color optics in frames that stay light and form-fitting through the longest case.',
  mission: 'We decided not to gatekeep this tool. Residents, students and physicians should not have to spend a month’s salary on the instrument they use every day.',
} as const

/** Proof points that sit under the slogans. */
export const proofPoints = [
  'Premium optical glass, lightweight metal frames',
  'Hundreds of international expos, nearly every specialty',
  'Clinics, teaching hospitals, universities and training programs',
  'Custom-tailored to every clinician',
  'Every price published',
  'Lifetime warranty on every pair',
] as const
