import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

async function syncListing(listingId: string, req: PayloadRequest) {
  const result = await req.payload.find({
    collection: 'spaces',
    where: {
      and: [{ listing: { equals: listingId } }, { status: { equals: 'active' } }],
    },
    limit: 1000,
    depth: 0,
  })

  if (result.docs.length === 0) {
    await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { status: 'inactive' },
    })
    console.log(`No active spaces found for listing ${listingId}. Setting status to inactive.`)
    return
  }

  const cheapest = result.docs.reduce((min, space) =>
    space.price.base < min.price.base ? space : min,
  )

  await req.payload.update({
    collection: 'listings',
    id: listingId,
    data: {
      minimumPricePerEvent: cheapest.price.base,
      pricingUnit: cheapest.price.pricingUnit,
    },
  })
}

function resolveListingId(listing: string | { id: string } | null | undefined): string | null {
  if (!listing) return null
  return typeof listing === 'string' ? listing : listing.id
}

export const syncListingFromSpaces: CollectionAfterChangeHook = async ({ doc, req }) => {
  const listingId = resolveListingId(doc.listing)
  if (!listingId) return
  await syncListing(listingId, req)
}

export const syncListingFromSpacesOnDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const listingId = resolveListingId(doc.listing)
  if (!listingId) return
  await syncListing(listingId, req)
}
