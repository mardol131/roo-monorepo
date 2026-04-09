import type { CollectionConfig } from 'payload'
import { variantsCommonFields } from '../common-fields/common-fields'

export const EntertainmentVariants: CollectionConfig = {
  slug: 'entertainment-variants',
  fields: [
    ...variantsCommonFields,
    {
      name: 'includedSpaces',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: true,
    },
    {
      name: 'activities',
      type: 'relationship',
      relationTo: 'activities',
      hasMany: true,
    },
    {
      name: 'personnel',
      type: 'relationship',
      relationTo: 'personnel',
      hasMany: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'breakfast',
      type: 'group',
      fields: [
        {
          name: 'included',
          type: 'checkbox',
        },
        {
          name: 'price',
          type: 'number',
        },
        {
          name: 'loweredPrice',
          type: 'number',
        },
      ],
    },
    {
      name: 'eventTypes',
      type: 'relationship',
      relationTo: 'event-types',
      hasMany: true,
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'mainImage',
          type: 'text',
          required: true,
        },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
