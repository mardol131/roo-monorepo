import { getRecordStatuses } from '@roo/common'
import { CollectionAccess } from '../common/utils'
import { Where } from 'payload'

export const variantsAccessControl: CollectionAccess = {
  create: ({ req }) => {
    return !!req.user
  },
  read: ({ req }) => {
    if (req.user?.collection === 'admins') return true
    if (req.user) {
      const query: Where = {
        or: [
          { status: { equals: 'active' } },
          {
            and: [
              {
                or: [
                  { 'listing.company.owner': { equals: req.user.id } },
                  { 'listing.company.members.user': { equals: req.user.id } },
                ],
              },
              { status: { in: getRecordStatuses(['active', 'inactive']) } },
            ],
          },
        ],
      }
      return query
    }
    return { status: { equals: 'active' } }
  },
  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      and: [
        {
          or: [
            { 'listing.company.owner': { equals: req.user.id } },
            { 'listing.company.members.user': { equals: req.user.id } },
          ],
        },
        { status: { in: getRecordStatuses(['active', 'inactive']) } },
      ],
    }
    return where
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}
