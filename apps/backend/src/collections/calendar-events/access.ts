import { getIdFromRelationshipField } from '@roo/common'
import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const calendarEventsAccessControl: CollectionAccess = {
  create: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    if (!data?.listing) return false

    const listingId = getIdFromRelationshipField(data.listing)
    const listing = await req.payload.findByID({
      collection: 'listings',
      id: listingId,
      depth: 2,
      overrideAccess: true,
    })
    const company = await req.payload.findByID({
      collection: 'companies',
      id: getIdFromRelationshipField(listing?.company),
      overrideAccess: true,
      context: {
        skipPublicStrip: true,
      },
    })

    if (!company || typeof company === 'string') return false

    if (company.owner && getIdFromRelationshipField(company.owner) === req.user?.id) return true

    const member = company.members?.find(
      (m) => m.user && getIdFromRelationshipField(m.user) === req.user?.id,
    )

    console.log(company)

    if (!member) return false
    if (member.role === 'admin' || member.role === 'manager') return true
    if (member.role === 'editor') return data?.source === 'manual'

    return false
  },

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const query: Where = {
      or: [
        { 'listing.company.owner': { equals: req.user.id } },
        { 'listing.company.members.user': { equals: req.user.id } },
      ],
    }
    return query
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { 'listing.company.owner': { equals: req.user.id } },
        {
          and: [
            { 'listing.company.members.user': { equals: req.user.id } },
            { 'listing.company.members.role': { in: ['admin', 'manager'] } },
          ],
        },
        {
          and: [
            { 'listing.company.members.user': { equals: req.user.id } },
            { 'listing.company.members.role': { equals: 'editor' } },
            { source: { equals: 'manual' } },
          ],
        },
      ],
    }
    return where
  },

  delete: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
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
}
