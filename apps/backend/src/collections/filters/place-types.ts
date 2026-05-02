import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'

export const PlaceTypes: CollectionConfig = {
  slug: 'place-types',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    update: ({ req }) => adminOrApiKeyAuth(req),
    create: ({ req }) => adminOrApiKeyAuth(req),
    delete: ({ req }) => adminOrApiKeyAuth(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
