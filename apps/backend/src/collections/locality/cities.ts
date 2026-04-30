import { adminOrApiKeyAuth } from '@/functions/ACL'
import { COUNTRIES, slugify } from '@roo/common'
import type { CollectionConfig } from 'payload'

export const Cities: CollectionConfig = {
  slug: 'cities',
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
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRIES,
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) return
        if (data.name) {
          data.slug = slugify(data.name)
        }
      },
    ],
  },
}
