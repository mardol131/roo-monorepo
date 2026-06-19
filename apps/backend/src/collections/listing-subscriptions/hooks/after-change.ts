import type { CollectionAfterChangeHook } from 'payload'
import { getIdFromRelationshipField } from '@roo/common'

export const syncListingOnPayment: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === previousDoc?.status) return

  const listingId = getIdFromRelationshipField(doc.listing)
  if (!listingId) return

  if (doc.status === 'paid') {
    await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { subscriptionStatus: 'paid', tariff: doc.tariff },
      overrideAccess: true,
    })
    return
  }

  if (doc.status === 'expired') {
    await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { subscriptionStatus: 'expired' },
      overrideAccess: true,
    })
    return
  }

  if (doc.status === 'cancelling') {
    console.log('CANCELLING')
    const res = await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { subscriptionStatus: 'cancelling' },
      overrideAccess: true,
    })
    console.log(res)
    return
  }

  if (doc.status === 'expired') {
    await req.payload.update({
      collection: 'listings',
      id: listingId,
      data: { subscriptionStatus: 'expired' },
      overrideAccess: true,
    })
  }
}
