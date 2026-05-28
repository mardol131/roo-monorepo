import { getIdFromRelationshipField } from '@roo/common'
import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const inquiryAccess: CollectionAccess = {
  create: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    if (!data?.listing) return false

    const listingId = getIdFromRelationshipField(data.listing)

    const listing = await req.payload.findByID({
      collection: 'listings',
      id: listingId,
      depth: 0,
      overrideAccess: true,
    })

    return listing?.status === 'active' && listing?.subscriptionActive === true
  },

  read: async ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    // Vlastní poptávky (jako zákazník nebo firma)
    const ownQuery: Where = {
      or: [
        { user: { equals: req.user.id } },
        { 'listing.company.owner': { equals: req.user.id } },
        { 'listing.company.members.user': { equals: req.user.id } },
      ],
    }

    // Eventy s povoleným sdílením potvrzených dodavatelů, kde má user vlastní poptávku
    const myInquiries = await req.payload.find({
      collection: 'inquiries',
      where: ownQuery,
      overrideAccess: true,
      depth: 0,
      limit: 200,
    })

    const eventIds = [
      ...new Set(
        myInquiries.docs
          .map((i) => (typeof i.event === 'string' ? i.event : i.event?.id))
          .filter(Boolean),
      ),
    ]

    if (eventIds.length === 0) return ownQuery

    const sharedEvents = await req.payload.find({
      collection: 'events',
      where: {
        and: [
          { id: { in: eventIds } },
          { 'sharing.confirmedInquiries': { equals: true } },
        ],
      },
      overrideAccess: true,
      depth: 0,
      limit: 200,
    })

    const sharedEventIds = sharedEvents.docs.map((e) => e.id)

    if (sharedEventIds.length === 0) return ownQuery

    const query: Where = {
      or: [
        ...((ownQuery.or as Where[]) ?? []),
        {
          and: [
            { event: { in: sharedEventIds } },
            { 'status.company': { equals: 'confirmed' } },
          ],
        },
      ],
    }
    return query
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { user: { equals: req.user.id } },
        { 'listing.company.owner': { equals: req.user.id } },
        {
          and: [
            { 'listing.company.members.user': { equals: req.user.id } },
            { 'listing.company.members.role': { in: ['admin', 'manager'] } },
          ],
        },
      ],
    }
    return where
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
