import { notFound } from 'next/navigation'

import ProductPageTemplate from '../ProductPageTemplate'
import JsonLd from '@/components/JsonLd'
import { getProduct } from '@/lib/commerce'
import { getProductJsonLd, getProductMetadata } from '@/lib/product-seo'
import { cmsProductToProductPageConfig } from '@/lib/product-config'

export const generateMetadata = () => getProductMetadata('galileo')

export default async function GalileoProductPage() {
  const product = await getProduct('galileo')
  if (!product) notFound()

  const productJsonLd = await getProductJsonLd('galileo')

  return (
    <>
      {productJsonLd ? <JsonLd data={productJsonLd} /> : null}
      <ProductPageTemplate config={cmsProductToProductPageConfig(product)} />
    </>
  )
}
