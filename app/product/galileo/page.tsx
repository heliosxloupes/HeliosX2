import { notFound } from 'next/navigation'

import ProductPageTemplate from '../ProductPageTemplate'
import { getProduct } from '@/lib/commerce'
import { cmsProductToProductPageConfig } from '@/lib/product-config'

export default async function GalileoProductPage() {
  const product = await getProduct('galileo')
  if (!product) notFound()

  return <ProductPageTemplate config={cmsProductToProductPageConfig(product)} />
}
