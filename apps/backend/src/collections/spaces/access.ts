import { getIdFromRelationshipField } from '@roo/common'
import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const spacesAccess: CollectionAccess = {
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

    if (!listing?.company) return false
    const companyId = getIdFromRelationshipField(listing.company)

    const company = await req.payload.findByID({
      collection: 'companies',
      id: companyId,
      overrideAccess: true,
      context: { skipPublicStrip: true },
    })

    if (!company) return false

    const ownerId = getIdFromRelationshipField(company.owner)
    if (ownerId === req.user.id) return true

    return (
      company.members?.some((member) => {
        const memberId = getIdFromRelationshipField(member.user)
        return memberId === req.user?.id
      }) ?? false
    )
  },

  read: ({ req }) => {
    if (req.user?.collection === 'admins') return true
    return { status: { equals: 'active' } }
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { 'listing.company.owner': { equals: req.user.id } },
        { 'listing.company.members.user': { equals: req.user.id } },
      ],
    }
    return where
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
