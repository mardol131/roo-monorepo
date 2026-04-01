import type { CollectionConfig } from 'payload'

export const VenueVariants: CollectionConfig = {
  slug: 'venue-variants',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      maxLength: 50,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'type',
      type: 'select',
      options: ['allYear', 'seasonal'],
    },
    {
      name: 'availability',
      type: 'select',
      options: ['allDay', 'selectedHours'],
      required: true,
    },
    {
      name: 'selectedHours',
      type: 'group',
      fields: [
        {
          name: 'from',
          type: 'text',
        },
        {
          name: 'to',
          type: 'text',
        },
      ],
    },

    {
      name: 'price',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'generalPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'seasonalPrices',
          type: 'array',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'from',
              type: 'date',
              required: true,
            },
            {
              name: 'to',
              type: 'date',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'includes',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
        },
      ],
    },
    {
      name: 'excludes',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
        },
      ],
    },
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
