import type { CollectionConfig, Where } from 'payload'

export const FavouriteListings: CollectionConfig = {
  slug: 'favourite-listings',
  admin: {
    useAsTitle: 'user',
  },
  access: {
    create: ({ req }) => {
      return !!req.user
    },
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (!req.user) {
        const query: Where = { status: { equals: 'active' } }
        return query
      }
      return {
        or: [
          {
            and: [
              { 'company.owner': { equals: req.user.id } },
              { status: { in: ['active', 'inactive'] } },
            ],
          },
          {
            and: [
              { 'company.owner': { not_equals: req.user.id } },
              { status: { equals: 'active' } },
            ],
          },
        ],
      }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'company.owner': { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'addedAt',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString(),
    },
  ],
}
