import { notFound } from 'next/navigation'

import ProductPageTemplate from '../ProductPageTemplate'
import { getProduct } from '@/lib/commerce'
import { cmsProductToProductPageConfig } from '@/lib/product-config'

export default async function ApolloProductPage() {
  const product = await getProduct('apollo')
  if (!product) notFound()

  return <ProductPageTemplate config={cmsProductToProductPageConfig(product)} />
}
