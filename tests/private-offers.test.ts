import { describe, expect, it } from 'vitest'

import { dollarsToCents, percentOffCents } from '@/lib/money'
import { lightPriceBySlug, resolveLightPrice, resolveProductPrice } from '@/lib/pricing'
import { getPrivateOffer, offerChargeCents, pricedOfferLines } from '@/lib/private-offers'

const TOKEN = 'czqh4dx8Sie_'

describe('Silvia Drekic private offer', () => {
  const offer = getPrivateOffer(TOKEN)

  it('keeps the same token and does not use a shared promotion code', () => {
    expect(offer).not.toBeNull()
    expect(offer?.promotionCode).toBeUndefined()
    expect(JSON.stringify(offer)).not.toContain('RESIDENTNEWTON15')
    expect(JSON.stringify(offer)).not.toContain('HELIOS10')
  })

  it('quotes Newton 3.5x and Sirius with the 10-hour pack at catalogue prices', () => {
    expect(resolveProductPrice('newton', '3.5x')).toBe(725)
    expect(resolveLightPrice('sirius', 'pack-10h')).toBe(755)
    expect(lightPriceBySlug.sirius.name).toBe('Sirius LED Loupe Light')
    expect(offer?.lines.map((line) => [line.name, line.price, line.percentOff, line.discountLabel])).toEqual([
      ['Newton Flip-Up Loupes', 725, 15, '15% resident discount'],
      ['Sirius LED Loupe Light', 755, 10, '10% resident discount'],
    ])
    expect(offer?.lines[1].description).toBe('10-hour extended battery pack')
    expect(offer?.lines[1].metadata).toMatchObject({
      productSlug: 'sirius',
      isLight: 'true',
      lightOption: 'pack-10h',
    })
  })

  it('charges the discounted line amounts and the quoted total', () => {
    expect(percentOffCents(725, 15)).toBe(10875)
    expect(percentOffCents(755, 10)).toBe(7550)
    expect(dollarsToCents(725) - 10875).toBe(61625)
    expect(dollarsToCents(755) - 7550).toBe(67950)

    const lines = pricedOfferLines(offer!)
    expect(lines.map((line) => line.unitAmountCents)).toEqual([61625, 67950])
    expect(offerChargeCents(offer!)).toBe(129575)
    expect(lines[0].description).toBe('3.5x, black sport frame. $725.00, 15% resident discount -$108.75')
    expect(lines[1].description).toBe('10-hour extended battery pack. $755.00, 10% resident discount -$75.50')
    expect(lines[0].metadata).toMatchObject({
      productSlug: 'newton',
      magnification: '3.5x',
      frameColor: 'Black',
      listPriceCents: '72500',
      discountCents: '10875',
      discountLabel: '15% resident discount',
      invoiceLine: '$725.00, 15% resident discount -$108.75',
    })
    expect(lines[1].metadata.invoiceLine).toBe('$755.00, 10% resident discount -$75.50')
  })

  it('keeps the greeting and includes free US shipping', () => {
    expect(offer?.greeting).toBe('Dr. Drekic, your order is ready.')
    expect(offer?.discountNote).toContain('15% off your Newton loupes')
    expect(offer?.discountNote).toContain('10% off your Sirius light')
    expect(offer?.lightsOnly).toBe(false)
    expect(offer?.shippingCountries).toEqual(['US'])
    expect(offer?.shippingDisplayName).toBe('Shipping included')
    expect(offer?.shippingNote).toBe('free, US')
    expect(offer?.id).toBe('newton-flip-up-resident')
  })
})

describe('other private offers', () => {
  it('still discounts Brandon through his own promotion code at catalogue prices', () => {
    const offer = getPrivateOffer('37l_TqVDqJqH')
    expect(offer?.promotionCode).toBe('KEPLERCANOPUS')
    const lines = pricedOfferLines(offer!)
    expect(lines.map((line) => line.unitAmountCents)).toEqual([
      dollarsToCents(offer!.lines[0].price),
      dollarsToCents(offer!.lines[1].price),
    ])
    expect(lines[0].metadata.discountLabel).toBeUndefined()
    expect(lines[0].description).not.toContain('resident discount')
  })
})
