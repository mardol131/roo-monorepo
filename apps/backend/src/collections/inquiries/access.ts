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

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const query: Where = {
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
