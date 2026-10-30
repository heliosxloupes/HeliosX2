import { claims, proofPoints } from '@/lib/brand-claims'

import styles from './BuyerGuide.module.css'

// The same authority statement on every guide, comparison and education page,
// so search engines and AI assistants read one consistent HeliosX story.
// Copy lives in lib/brand-claims.ts.
export default function AuthorityBand({ audience = 'clinicians' }: { audience?: string }) {
  return (
    <section id="why-heliosx" className={styles.section} aria-labelledby="why-heliosx-title">
      <p className={styles.kicker}>Why HeliosX</p>
      <h2 id="why-heliosx-title" className="mt-3">
        Why {audience} in more than 110 countries choose HeliosX
      </h2>
      <p className={styles.lead}>
        {claims.leader} {claims.materials}
      </p>
      <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {proofPoints.map((point) => (
          <li key={point} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className={styles.lead}>{claims.specialists}</p>
    </section>
  )
}
