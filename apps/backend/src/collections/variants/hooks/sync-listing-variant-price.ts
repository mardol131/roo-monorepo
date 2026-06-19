import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

type SeasonalPrice = {
  amount: number
  adjustmentType: 'surcharge' | 'discount'
  valueType: 'absolute' | 'percentage'
}

function effectiveMin(base: number, seasonalPrices: SeasonalPrice[] = []): number {
  const discountedPrices = seasonalPrices
    .filter((sp) => sp.adjustmentType === 'discount')
    .map((sp) =>
      sp.valueType === 'absolute' ? base - sp.amount : base * (1 - sp.amount / 100),
    )
  return Math.min(base, ...discountedPrices)
}

function resolveListingId(listing: string | { id: string } | null | undefined): string | null {
  if (!listing) return null
  return typeof listing === 'string' ? listing : listing.id
}

async function syncVariantPrice(listingId: string, req: PayloadRequest) {
  const result = await req.payload.find({
    collection: 'variants',
    where: {
      and: [
        { listing: { equals: listingId } },
        { status: { equals: 'active' } },
      ],
    },
    limit: 1000,
    depth: 0,
  })

  if (result.docs.length === 0) {
    await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { minimumVariantPrice: null, variantPricingUnit: null },
    })
    return
  }

  let minPrice = Infinity
  let minPricingUnit: string | null = null

  for (const variant of result.docs) {
    const base = variant.price?.base ?? 0
    const seasonal = variant.price?.seasonalPrices ?? []
    const effective = effectiveMin(base, seasonal)
    if (effective < minPrice) {
      minPrice = effective
      minPricingUnit = variant.price?.pricingUnit ?? null
    }
  }

  await req.payload.update({
    collection: 'listings',
    id: listingId,
    data: {
      minimumVariantPrice: minPrice === Infinity ? null : minPrice,
      variantPricingUnit: minPricingUnit,
    },
  })
}

export const syncListingVariantPrice: CollectionAfterChangeHook = async ({ doc, req }) => {
  const listingId = resolveListingId(doc.listing)
  if (!listingId) return
  await syncVariantPrice(listingId, req)
}

export const syncListingVariantPriceOnDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const listingId = resolveListingId(doc.listing)
  if (!listingId) return
  await syncVariantPrice(listingId, req)
}
