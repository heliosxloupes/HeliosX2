import type { Metadata } from 'next'

import Header from '@/components/Header'
import PdAppGuide from '@/components/measurements/PdAppGuide'

export const metadata: Metadata = {
  title: 'Measure your PD with an app | HeliosX',
  description:
    'Recommended apps for measuring pupillary distance at home for surgical and dental loupes: The Framery (formerly GlassesOn) and EyeMeasure.',
  alternates: { canonical: '/measurements/ipd' },
}

export default function PdAppsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#030508] px-5 pb-24 pt-28 text-white md:px-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Pupillary distance</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Measure your PD with an app</h1>
          <PdAppGuide />
        </div>
      </main>
    </>
  )
}
