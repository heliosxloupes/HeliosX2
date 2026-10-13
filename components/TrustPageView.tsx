import Link from 'next/link'

import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, organizationJsonLd, supportEmail, webPageJsonLd } from '@/lib/seo'
import type { TrustPage } from '@/lib/trust-pages'

// Shared layout for /about and /contact. Matches the policy pages
// (warranty, returns): black background, one column, emerald kicker.

export default function TrustPageView({ page, children }: { page: TrustPage; children?: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          webPageJsonLd({ title: page.metaTitle, description: page.description, path: page.path }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.kicker === 'About' ? 'About' : 'Contact', path: page.path },
          ]),
        ]}
      />
      <Header />
      <main className="hx-mobile-policy min-h-screen bg-black px-4 pt-28 text-white">
        <article className="mx-auto max-w-3xl space-y-6 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/80">{page.kicker}</p>
          <h1 className="text-3xl font-semibold md:text-4xl">{page.title}</h1>
          <p className="text-neutral-300">{page.intro}</p>
          {children}
          {page.sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <p className="text-neutral-300">{section.body}</p>
              {section.bullets?.length ? (
                <ul className="list-disc space-y-1.5 pl-5 text-neutral-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <p className="pt-4 text-sm text-neutral-400">
            Email{' '}
            <a
              href={`mailto:${supportEmail}`}
              className="text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-white"
            >
              {supportEmail}
            </a>
            {' · '}
            <Link href="/measurements" className="underline underline-offset-4 hover:text-white">
              Measuring guide
            </Link>
            {' · '}
            <Link href="/faq" className="underline underline-offset-4 hover:text-white">
              FAQ
            </Link>
          </p>
        </article>
      </main>
    </>
  )
}
