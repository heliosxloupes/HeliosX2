import type { CmsProduct, CrmSource } from './ecommerce-types'
import { fallbackProducts, getFallbackProduct } from './fallback-products'
import { getSupabaseServiceClient } from './supabase/server'

function mapProduct(row: any): CmsProduct {
  const images = [...(row.product_images ?? [])].sort(
    (a: any, b: any) => a.display_order - b.display_order
  )
  const specs = [...(row.product_specs ?? [])].sort(
    (a: any, b: any) => a.display_order - b.display_order
  )

  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    description: row.description,
    cardTagline: row.card_tagline ?? '',
    cardHighlight: row.card_highlight ?? '',
    cardBullets: row.card_bullets ?? [],
    highlights: row.highlights ?? [],
    magnifications: row.magnifications ?? [],
    basePrice: row.base_price ?? undefined,
    priceLabel: row.price_label ?? undefined,
    isAvailable: row.is_available ?? false,
    cardImageSrc: row.card_image_src ?? '',
    cardImageAlt: row.card_image_alt ?? `${row.short_name} product image`,
    imagePosition: row.image_position ?? undefined,
    displayOrder: row.display_order ?? 0,
    specTitle: row.spec_title ?? '',
    specDescription: row.spec_description ?? '',
    specColumns: specs.map((spec: any) => ({
      title: spec.title,
      items: spec.items ?? [],
    })),
    heroImages: images
      .filter((image: any) => image.kind === 'hero')
      .map((image: any) => ({ src: image.src, alt: image.alt })),
    specImages: images
      .filter((image: any) => image.kind === 'spec')
      .map((image: any) => ({ src: image.src, alt: image.alt })),
  }
}

export async function getProducts() {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return fallbackProducts

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_specs(*)')
    .order('display_order', { ascending: true })

  if (error || !data?.length) return fallbackProducts
  return data.map(mapProduct)
}

export async function getProduct(slug: string) {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return getFallbackProduct(slug)

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_specs(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return getFallbackProduct(slug)
  return mapProduct(data)
}

export async function upsertCrmContact({
  email,
  phone,
  source,
  metadata,
}: {
  email: string
  phone?: string | null
  source: CrmSource
  metadata?: Record<string, unknown>
}) {
  const supabase = getSupabaseServiceClient()
  if (!supabase || !email) return null

  const normalizedEmail = email.trim().toLowerCase()
  const { data: existing } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle()

  const sources = Array.from(new Set([...(existing?.sources ?? []), source]))

  const payload = {
    email: normalizedEmail,
    phone: phone || existing?.phone || null,
    sources,
    first_source: existing?.first_source ?? source,
    last_source: source,
    metadata: {
      ...(existing?.metadata ?? {}),
      ...(metadata ?? {}),
    },
  }

  const { data } = await supabase
    .from('crm_contacts')
    .upsert(payload, { onConflict: 'email' })
    .select()
    .single()

  return data
}

export async function seedFallbackProducts() {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return { seeded: false }

  for (const product of fallbackProducts) {
    const { data } = await supabase
      .from('products')
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          short_name: product.shortName,
          description: product.description,
          card_tagline: product.cardTagline,
          card_highlight: product.cardHighlight,
          card_bullets: product.cardBullets,
          highlights: product.highlights,
          magnifications: product.magnifications,
          base_price: product.basePrice ?? null,
          price_label: product.priceLabel ?? null,
          is_available: product.isAvailable,
          card_image_src: product.cardImageSrc,
          card_image_alt: product.cardImageAlt,
          image_position: product.imagePosition ?? null,
          display_order: product.displayOrder,
          spec_title: product.specTitle,
          spec_description: product.specDescription,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single()

    if (!data?.id) continue

    await supabase.from('product_images').delete().eq('product_id', data.id)
    await supabase.from('product_specs').delete().eq('product_id', data.id)

    const imageRows = [
      ...product.heroImages.map((image, index) => ({
        product_id: data.id,
        src: image.src,
        alt: image.alt,
        kind: 'hero',
        display_order: index,
      })),
      ...product.specImages.map((image, index) => ({
        product_id: data.id,
        src: image.src,
        alt: image.alt,
        kind: 'spec',
        display_order: index,
      })),
    ]

    if (imageRows.length) await supabase.from('product_images').insert(imageRows)
    if (product.specColumns.length) {
      await supabase.from('product_specs').insert(
        product.specColumns.map((spec, index) => ({
          product_id: data.id,
          title: spec.title,
          items: spec.items,
          display_order: index,
        }))
      )
    }
  }

  return { seeded: true }
}
