import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const chatMessagesAccessControl: CollectionAccess = {
  create: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { 'inquiry.user': { equals: req.user.id } },
        { 'inquiry.listing.company.owner': { equals: req.user.id } },
        {
          and: [
            { 'inquiry.listing.company.members.user': { equals: req.user.id } },
            { 'inquiry.listing.company.members.role': { in: ['admin', 'manager'] } },
          ],
        },
      ],
    }
    return where
  },

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = {
      or: [
        { 'inquiry.user': { equals: req.user.id } },
        { 'inquiry.listing.company.owner': { equals: req.user.id } },
        { 'inquiry.listing.company.members.user': { equals: req.user.id } },
      ],
    }
    return where
  },

  update: ({ req }) => {
    if (!req.user) return false
    return req.user.collection === 'admins'
  },

  delete: ({ req }) => {
    if (!req.user) return false
    return req.user.collection === 'admins'
  },
}
