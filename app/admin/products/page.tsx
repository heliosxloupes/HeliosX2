import { SeedProductsButton } from '@/components/AdminForms'
import ProductCmsEditor from '@/components/ProductCmsEditor'
import { requireAdmin } from '@/lib/admin-auth'
import { getProducts } from '@/lib/commerce'

export default async function AdminProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Products</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Product CMS data is read from Supabase when configured, with the current catalogue as fallback.
      </p>
      <div className="mt-6">
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
