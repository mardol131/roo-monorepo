import { getIdFromRelationshipField } from '@roo/common'
import type { CollectionAccess } from '../common/utils'

export const listingSubscriptionAccessControl: CollectionAccess = {
  create: ({ req }) => req.user?.collection === 'admins',
  read: async ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const companies = await req.payload.find({
      collection: 'companies',
      where: {
        or: [{ owner: { equals: req.user.id } }, { 'members.user': { equals: req.user.id } }],
      },
      overrideAccess: true,
      depth: 0,
    })

    const allowedCompanyIds = companies.docs
      .filter((company) => {
        const ownerId = getIdFromRelationshipField(company.owner)
        if (ownerId === req.user!.id) return true
        return company.members?.some((member) => {
          const memberId = getIdFromRelationshipField(member.user)
          return memberId === req.user!.id && (member.role === 'admin' || member.role === 'manager')
        })
      })
      .map((c) => c.id)

    if (allowedCompanyIds.length === 0) return false

    return { company: { in: allowedCompanyIds.join(',') } }
  },
  update: ({ req }) => req.user?.collection === 'admins',
  delete: ({ req }) => req.user?.collection === 'admins',
}
