import { SeedProductsButton } from '@/components/AdminForms'
import ProductCmsEditor from '@/components/ProductCmsEditor'
import { requireAdmin } from '@/lib/admin-auth'
import { getProducts } from '@/lib/commerce'

export default async function AdminProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <main>
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Catalogue</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            Product CMS data is read from Supabase when configured, with the current catalogue as fallback.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300">
          {products.length} systems
        </div>
      </div>
      <div className="mt-6 max-w-2xl">
        <SeedProductsButton />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <ProductCmsEditor key={product.slug} product={product} />
        ))}
      </div>
    </main>
  )
}
