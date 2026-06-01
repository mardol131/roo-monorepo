import type { CollectionConfig } from 'payload'
import { commonListingDetailFields, customSectionsFields, priceableOptionFields } from './fields'
import { listingDetailAccessControl } from './access'

export const ListingEntertainmentDetails: CollectionConfig = {
  slug: 'listing-entertainment-details',
  access: listingDetailAccessControl,
  fields: [
    ...customSectionsFields,
    ...commonListingDetailFields,
    {
      name: 'type',
      type: 'select',
      options: ['entertainment'],
      required: true,
      defaultValue: 'entertainment',
    },
    {
      name: 'audience',
      type: 'select',
      hasMany: true,
      options: ['adults', 'kids', 'seniors'],
    },
    {
      name: 'filters',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'allEventTypes',
          type: 'checkbox',
          required: true,
          defaultValue: false,
        },
        {
          name: 'eventTypes',
          type: 'relationship',
          relationTo: 'event-types',
          hasMany: true,
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (!siblingData?.allEventTypes && !(value as unknown[])?.length) {
              return 'Vyberte alespoň jeden typ akce'
            }
            return true
          },
        },

        {
          name: 'necessities',
          type: 'relationship',
          relationTo: 'necessities',
          hasMany: true,
        },
        {
          name: 'musicGenres',
          type: 'relationship',
          relationTo: 'music-genres',
          hasMany: true,
        },
        {
          name: 'entertainmentRules',
          type: 'relationship',
          relationTo: 'entertainment-rules',
          hasMany: true,
        },
      ],
    },
    {
      name: 'options',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'technologies',
          type: 'array',
          fields: [
            {
              name: 'technology',
              type: 'relationship',
              relationTo: 'technologies',
              required: true,
            },
            ...priceableOptionFields,
          ],
        },

        {
          name: 'services',
          type: 'array',
          fields: [
            { name: 'service', type: 'relationship', relationTo: 'services', required: true },
            ...priceableOptionFields,
          ],
        },
      ],
    },
    {
      name: 'setupAndTearDown',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'setupTime',
          type: 'number',
        },
        {
          name: 'tearDownTime',
          type: 'number',
        },
      ],
    },
  ],
}
