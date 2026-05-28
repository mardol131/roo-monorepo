import type { Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const userNotificationAccess: CollectionAccess = {
  create: ({ req }) => req.user?.collection === 'admins',

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = { user: { equals: req.user.id } }
    return where
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const where: Where = { user: { equals: req.user.id } }
    return where
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
