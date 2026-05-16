import type { CollectionConfig } from 'payload'

export const FavouriteListings: CollectionConfig = {
  slug: 'favourite-listings',
  admin: {
    useAsTitle: 'user',
  },
  access: {
    create: ({ req }) => {
      if (!req.user) return false
      return true
    },
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (!req.user) return false
      return { user: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { user: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { user: { equals: req.user.id } }
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data || !req) return data
        if (!data.user && req.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
  ],
}
