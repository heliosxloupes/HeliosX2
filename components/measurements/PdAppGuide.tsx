// Recommended third-party apps for measuring pupillary distance.
// Claims are quoted from each app's App Store listing (checked 27 Sep 2026).
// Re-check before editing: store names, owners and availability change.

type PdApp = {
  name: string
  maker: string
  href: string
  platform: string
  method: string
  evidence: string[]
}

const APPS: PdApp[] = [
  {
    name: 'The Framery (formerly GlassesOn)',
    maker: 'By 1-800 Contacts, originally developed by 6over6 Vision',
    href: 'https://apps.apple.com/us/app/the-framery/id1153638659',
    platform: 'Free · iPhone and iPad (iOS 17 or later)',
    method:
      'Hold any card the size of a credit card flat against your forehead for scale. The app uses your front camera and voice prompts to measure your PD in under a minute.',
    evidence: [
      'Registered with the FDA as a Class I exempt medical device.',
      'Clinically tested to the ANSI Z80.17 standard: PD within 2 mm.',
    ],
  },
  {
    name: 'EyeMeasure',
    maker: 'By Bonlook',
    href: 'https://apps.apple.com/us/app/eyemeasure/id1417435049',
    platform: 'Free · iPhone X or newer, and iPads with Face ID',
    method:
      'Uses the Face ID (TrueDepth) depth camera, so you need no card, mirror or ruler. Hold the phone about 30 cm from your face. It reports near and far PD.',
    evidence: ['The developer states accuracy to within 0.5 mm.', 'Works only on devices with a Face ID camera.'],
  },
]

export default function PdAppGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-5">
      {!compact && (
        <p className="max-w-[68ch] text-base leading-8 text-neutral-300">
          The quickest accurate way to measure PD at home is a dedicated measurement app. We recommend these two:
        </p>
      )}

      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        {APPS.map((app) => (
          <article
            key={app.name}
            className="flex flex-col rounded-[24px] border border-white/10 bg-[#050b16] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">{app.platform}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{app.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{app.maker}</p>
            <p className="mt-4 text-sm leading-7 text-neutral-300">{app.method}</p>
            <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm leading-6 text-neutral-300">
              {app.evidence.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-emerald-300" />
                  {line}
                </li>
              ))}
            </ul>
            <a
              href={app.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Get it on the App Store
            </a>
          </article>
        ))}
      </div>

      <div className="space-y-2 text-sm leading-7 text-neutral-400">
        <p>
          Take three readings and use the average. Loupes need PD within about 1 mm, which is tighter than the 2 mm tolerance
          used for everyday glasses, so repeat readings matter.
        </p>
        <p>
          On Android? Neither app is currently on Google Play. Use an optician-measured PD, the PD printed on a recent glasses
          prescription, or the ruler method described on our{' '}
          <a href="/measurements#step-1" className="font-semibold text-emerald-200 hover:text-white">
            measurements page
          </a>
          .
        </p>
      </div>
    </div>
  )
}
