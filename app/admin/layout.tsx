import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'HeliosX Admin',
  description: 'HeliosX internal operations console.',
  path: '/admin',
  noIndex: true,
})

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#030507] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.14),transparent_32%),linear-gradient(135deg,#020617_0%,#030507_42%,#07111f_100%)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030507]/92 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030507]/78">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link
            href="/admin"
            className="group flex w-fit items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-sm font-semibold text-emerald-200">
              HX
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.18em] text-white">HeliosX</span>
              <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-neutral-500">Ops console</span>
            </span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2 md:justify-end">
            <div className="min-w-0 flex-1 md:max-w-fit">
              <AdminNav />
            </div>
            <Link
              href="/"
              className="hidden shrink-0 rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-neutral-300 transition outline-none hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300/70 sm:inline-flex"
            >
              View storefront
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</div>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>HeliosX ops console</p>
          <Link
            href="/"
            className="w-fit rounded-full border border-white/10 px-3 py-2 font-medium text-neutral-300 transition outline-none hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300/70"
          >
            Back to main site
          </Link>
        </div>
      </footer>
    </div>
  )
}
