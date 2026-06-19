import type { CollectionAfterChangeHook } from 'payload'

export const syncListingFromDetail: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc.price?.base || !doc.price?.pricingUnit) return

  const result = await req.payload.find({
    collection: 'listings',
    where: { 'detail.value': { equals: doc.id } },
    limit: 1,
    depth: 0,
  })

  if (result.docs.length === 0) return

  await req.payload.update({
    collection: 'listings',
    id: result.docs[0].id,
    data: {
      minimumPricePerEvent: doc.price.base,
      pricingUnit: doc.price.pricingUnit,
    },
  })
}
