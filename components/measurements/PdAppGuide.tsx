// The pupillary distance tools HeliosX recommends, PDCheck AR first.
// Steps come from each tool's own instructions (checked 1 Nov 2026), except the
// EyeMeasure glasses rule, which comes from HeliosX's own testing.
// Re-check before editing: store names, owners and availability change.

type PdTool = {
  name: string
  maker: string
  href: string
  cta: string
  platform: string
  steps: string[]
  note?: string
}

const TOOLS: PdTool[] = [
  {
    // Reinstated first (Nov 2026): the owner's PDCheck AR reading matched an
    // in-person optician measurement. Requirements from the App Store listing.
    name: 'PDCheck AR',
    maker: 'iPhone app by EyeQue',
    href: 'https://apps.apple.com/us/app/pdcheck-ar/id1563806777',
    cta: 'Get it on the App Store',
    platform: 'Our first pick · iPhone X or newer',
    steps: [
      'Install PDCheck AR on an iPhone with Face ID (iPhone X or newer).',
      'Open it and follow the on-screen guide. No card or ruler is needed.',
      'Note your far PD and your near PD. Send us both.',
    ],
    note: 'In our own testing, PDCheck AR matched an optician’s in-person measurement.',
  },
  {
    name: 'EyeMeasure',
    maker: 'iPhone app by Bonlook',
    href: 'https://apps.apple.com/us/app/eyemeasure/id1417435049',
    cta: 'Get it on the App Store',
    platform: 'Free · iPhone X or newer',
    steps: [
      'Put your glasses on and keep them on for the scan. This app needs them.',
      'Hold the phone straight in front of your face, about 30 cm away.',
      'Keep still while it scans. If nothing happens, move the phone a little further away.',
      'Note the near PD and far PD. Send us both.',
    ],
    note: 'No glasses to hand? Use Warby Parker or XREAL instead.',
  },
  {
    name: 'Warby Parker',
    maker: 'Web tool, plus a card-free iPhone app in the US',
    href: 'https://www.warbyparker.com/pd',
    cta: 'Open the Warby Parker PD tool',
    platform: 'Free · needs a free account',
    steps: [
      'Sign in, then take your glasses off.',
      'Find a well-lit spot with a clean background.',
      'Set the camera straight on, centre your face and look directly at the camera.',
      'Hold any credit-card-size card under your nose, touching your face, with the number side hidden. Take the photo.',
    ],
    note: 'On a US iPhone X or newer, the Warby Parker app measures PD with no card. Use Measure your PD in the app and allow camera access.',
  },
  {
    name: 'XREAL',
    maker: 'Browser tool by XREAL',
    href: 'https://www.xreal.com/ipd/ipd-camera',
    cta: 'Open the XREAL IPD tool',
    platform: 'Free · any device with a camera',
    steps: [
      'Take your glasses off and go somewhere well lit.',
      'Open the tool, choose Agree and allow camera access.',
      'Sit about 40 cm from the screen, facing it directly, and line your face up with the on-screen guide.',
      'Press Start and hold still for the few seconds it takes.',
    ],
    note: 'XREAL calls this an estimate, so compare it with one of the other tools.',
  },
]

export default function PdAppGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-5">
      {!compact && (
        <p className="max-w-[68ch] text-base leading-8 text-neutral-300">
          The quickest accurate way to measure PD at home is one of these tools. Start with PDCheck AR if you have an iPhone:
        </p>
      )}

      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        {TOOLS.map((tool) => (
          <article
            key={tool.name}
            className="flex flex-col rounded-[24px] border border-white/10 bg-[#050b16] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">{tool.platform}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{tool.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{tool.maker}</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-300">
              {tool.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {tool.note && (
              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-neutral-400">{tool.note}</p>
            )}
            <a
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              {tool.cta}
            </a>
          </article>
        ))}
      </div>

      <div className="space-y-2 text-sm leading-7 text-neutral-400">
        <p>
          Measure with at least two tools and take three readings on each. Loupes need PD within about 1 mm. If your results
          differ by more than that, measure again or send us every result and we will review them before production.
        </p>
        <p>
          On Android? Warby Parker and XREAL both run in your browser. An optician-measured PD or the PD printed on a recent
          glasses prescription also works.
        </p>
      </div>
    </div>
  )
}
