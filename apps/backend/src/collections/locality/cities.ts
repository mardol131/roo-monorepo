import { slugify } from '@roo/common'
import type { CollectionConfig } from 'payload'

export const Cities: CollectionConfig = {
  slug: 'cities',
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
