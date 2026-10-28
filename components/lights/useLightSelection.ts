'use client'

import { useEffect, useState } from 'react'

import { useContact } from '@/components/Contact/ContactProvider'
import { addToCart } from '@/lib/cart'
import { BATTERIES, LIGHTS, lightBySlug, lightPrice, type Light } from '@/lib/lights'

// Selection state shared by the mobile and desktop Lights layouts. Both are in
// the DOM at once, so only the one matching `media` reports what the visitor is
// configuring to the contact form.
export function useLightSelection(media: string) {
  const { setProductContext } = useContact()
  const [slug, setSlug] = useState<Light['slug']>('vega')
  const [batteryId, setBatteryId] = useState(BATTERIES[0].id)
  const [photoIndex, setPhotoIndex] = useState(0)

  const light = lightBySlug(slug) ?? LIGHTS[0]
  const photos = [light.image, ...(light.photos ?? [])]
  const photo = photos[photoIndex] ?? photos[0]

  // Each light opens on its main photo.
  useEffect(() => setPhotoIndex(0), [slug])
  const wireless = light.kind === 'wireless'
  const option = wireless ? 'wireless' : batteryId
  const battery = BATTERIES.find((entry) => entry.id === batteryId) ?? BATTERIES[0]
  const price = lightPrice(light.slug, option)
  const group = LIGHTS.filter((entry) => entry.kind === light.kind)
  const optionName = wireless
    ? `${light.wireless?.batteries} batteries included`
    : `${battery.label} battery, ${battery.hours} hrs`

  useEffect(() => {
    if (!window.matchMedia(media).matches) return
    setProductContext({ slug: `light-${light.slug}`, name: `${light.name} light`, frame: optionName })
  }, [media, light.slug, light.name, optionName, setProductContext])

  const chooseKind = (kind: Light['kind']) => {
    if (kind !== light.kind) setSlug(kind === 'corded' ? 'vega' : 'nova')
  }

  const commit = () => {
    if (!price) return false
    addToCart({
      productSlug: light.slug,
      name: `${light.name} LED Loupe Light`,
      shortName: light.name,
      price,
      quantity: 1,
      image: light.image,
      isLight: true,
      lightOption: option,
      lightOptionName: optionName,
    })
    return true
  }

  return { photos, photo, photoIndex: photos[photoIndex] ? photoIndex : 0, setPhotoIndex, light, setSlug, chooseKind, wireless, batteryId, setBatteryId, battery, option, price, group, optionName, commit }
}
