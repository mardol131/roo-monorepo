import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const eventsAccessControl: CollectionAccess = {
  create: ({ req }) => !!req.user,

  read: async ({ req, id }) => {
    if (req.user?.collection === 'admins') return true
    if (!req.user) return false

    const userId = req.user.id

    if (!id) {
      const { docs } = await req.payload.find({
        collection: 'inquiries',
        where: {
          or: [
            { 'listing.company.owner': { equals: userId } },
            { 'listing.company.members.user': { equals: userId } },
          ] as Where[],
        },
        overrideAccess: true,
        depth: 0,
        limit: 0,
      })

      const accessibleEventIds = docs
        .map((inq) => (typeof inq.event === 'string' ? inq.event : inq.event?.id))
        .filter(Boolean)

      return {
        or: [
          { owner: { equals: userId } },
          ...(accessibleEventIds.length > 0 ? [{ id: { in: accessibleEventIds } }] : []),
        ] as Where[],
      }
    }

    const event = await req.payload.findByID({
      collection: 'events',
      id,
      depth: 0,
      overrideAccess: true,
    })

    if (event.owner === userId) return true

    const { totalDocs } = await req.payload.find({
      collection: 'inquiries',
      where: {
        and: [
          { event: { equals: id } },
          {
            or: [
              { 'listing.company.owner': { equals: userId } },
              { 'listing.company.members.user': { equals: userId } },
            ] as Where[],
          },
        ],
      },
      overrideAccess: true,
      depth: 0,
      limit: 1,
    })

    return totalDocs > 0
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    return { owner: { equals: req.user.id } }
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
