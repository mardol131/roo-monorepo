import { CollectionAccess } from '../common/utils'

export const usersAccessControl: CollectionAccess = {
  create: () => true,

  read: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    return { id: { equals: req.user.id } }
  },

  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    return { id: { equals: req.user.id } }
  },

  delete: ({ req }) => req.user?.collection === 'admins',
}
