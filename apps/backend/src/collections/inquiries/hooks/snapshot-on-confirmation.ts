import type { CollectionBeforeChangeHook } from 'payload'

export const snapshotOnConfirmation: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update') return data

  const bothConfirmed =
    (data.status?.company ?? originalDoc.status?.company) === 'confirmed' &&
    (data.status?.user ?? originalDoc.status?.user) === 'confirmed'

  const alreadySnapped = originalDoc.snapshots?.listing != null

  if (!bothConfirmed || alreadySnapped) return data

  const listingId =
    typeof originalDoc.listing === 'object' ? originalDoc.listing?.id : originalDoc.listing
  const variantId =
    typeof originalDoc.variant === 'object' ? originalDoc.variant?.id : originalDoc.variant

  const listing = await req.payload.findByID({
    collection: 'listings',
    id: listingId,
    depth: 2,
  })

  const variant = variantId
    ? await req.payload.findByID({
        collection: 'variants',
        id: variantId,
        depth: 2,
      })
    : null

  data.snapshots = { listing, variant }

  return data
}
