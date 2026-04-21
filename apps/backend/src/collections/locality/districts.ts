import type { CollectionConfig } from 'payload'

export const Districts: CollectionConfig = {
  slug: 'districts',
  admin: {
    useAsTitle: 'name',
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
