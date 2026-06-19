import type { CollectionConfig } from 'payload'

export const OAuthAccounts: CollectionConfig = {
  slug: 'oauth-accounts',
  admin: {
    useAsTitle: 'email',
    group: 'Users',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: ['google'],
    },
    {
      name: 'providerAccountId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
    },
  ],
}
