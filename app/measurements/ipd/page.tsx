import type { Metadata } from 'next'

import Header from '@/components/Header'
import IpdCameraTool from '@/components/measurements/IpdCameraTool'

export const metadata: Metadata = {
  title: 'Camera PD measurement | HeliosX',
  description: 'Measure pupillary distance with your camera and a standard-size card. Review three readings before using a PD for your loupes.',
}

export default function IpdMeasurementPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#030508] px-5 pb-24 pt-28 text-white md:px-12">
        <div className="mx-auto max-w-3xl">
          <IpdCameraTool />
        </div>
      </main>
    </>
  )
}
