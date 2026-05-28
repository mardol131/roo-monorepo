import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const invitationsAccessControl: CollectionAccess = {
  create: ({ req }) => req.user?.collection === 'admins',

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const query: Where = {
      and: [
        {
          or: [
            { 'company.owner': { equals: req.user.id } },
            {
              and: [
                { 'company.members.user': { equals: req.user.id } },
                { 'company.members.role': { equals: 'admin' } },
              ],
            },
          ],
        },
        { status: { in: ['pending', 'accepted'] } },
      ],
    }
    return query
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { 'company.owner': { equals: req.user.id } },
        {
          and: [
            { 'company.members.user': { equals: req.user.id } },
            { 'company.members.role': { equals: 'admin' } },
          ],
        },
      ],
    }
    return where
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
