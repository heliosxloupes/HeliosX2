import Link from 'next/link'

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Operations</p>
      <h1 className="mt-2 text-3xl font-semibold">HeliosX ecommerce ops</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ['Orders', '/admin/orders', 'Track payments, measurements, and shipping.'],
          ['CRM', '/admin/crm', 'View captured contacts and source history.'],
          ['Products', '/admin/products', 'Edit product CMS data and seed catalogue.'],
          ['Email Templates', '/admin/email-templates', 'Configure drips and transactional emails.'],
        ].map(([title, href, copy]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[24px] border border-white/10 bg-neutral-950 p-5 transition hover:border-white/30"
          >
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{copy}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
