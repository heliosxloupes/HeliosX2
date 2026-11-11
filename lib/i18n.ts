/**
 * Spanish (/es) and Brazilian Portuguese (/pt) sections.
 *
 * Why folders on this domain: /es and /pt pages inherit the authority
 * heliosxvision.com has already earned, instead of starting from zero on a
 * new domain. Each translated page is tied to its English twin with hreflang,
 * so Google shows the right language to each searcher. Keyword research behind
 * the slugs: seo/keyword-research-latam-2026-11/.
 *
 * Pure module (no server APIs): client components import it too.
 */

export type Locale = 'en' | 'es' | 'pt'

export const locales: Locale[] = ['en', 'es', 'pt']

/** hreflang value per locale. Plain `es` covers every Spanish-speaking country. */
export const hreflangFor: Record<Locale, string> = {
  en: 'en',
  es: 'es',
  pt: 'pt-BR',
}

export const ogLocaleFor: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_LA',
  pt: 'pt_BR',
}

export const localeHome: Record<Locale, string> = { en: '/', es: '/es', pt: '/pt' }

export const localeName: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
}

/**
 * One row per page that exists in more than one language. Add a row whenever
 * a translated page ships; hreflang, the sitemap and the language switcher
 * all read from here.
 *
 * Do not add the 12 control pages of the Oct 2026 SEO test (see
 * seo/keyword-research-2026-10-27/PAGE-LIST-2026-10-28.md) until that test
 * ends: adding hreflang changes those pages.
 */
export const translatedPages: Partial<Record<Locale, string>>[] = [
  { en: '/', es: '/es', pt: '/pt' },
  { en: '/dental-loupes', es: '/es/lupas-dentales', pt: '/pt/lupa-odontologica' },
]

function normalize(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '')
  return clean === '' ? '/' : clean
}

export function localeOfPath(path: string): Locale {
  const p = normalize(path)
  if (p === '/es' || p.startsWith('/es/')) return 'es'
  if (p === '/pt' || p.startsWith('/pt/')) return 'pt'
  return 'en'
}

export function translationsOf(path: string): Partial<Record<Locale, string>> | undefined {
  const p = normalize(path)
  return translatedPages.find((row) => Object.values(row).includes(p))
}

/** Where the language switcher should send someone on `path`. */
export function counterpartPath(path: string, target: Locale): string {
  return translationsOf(path)?.[target] ?? localeHome[target]
}

/**
 * hreflang map for Next's `alternates.languages`, or undefined when the page
 * has no translation. Every language version lists all versions, itself
 * included, plus x-default pointing at the English page.
 */
export function languageAlternates(path: string, toUrl: (p: string) => string) {
  const row = translationsOf(path)
  if (!row) return undefined
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const p = row[locale]
    if (p) languages[hreflangFor[locale]] = toUrl(p)
  }
  if (row.en) languages['x-default'] = toUrl(row.en)
  return languages
}
