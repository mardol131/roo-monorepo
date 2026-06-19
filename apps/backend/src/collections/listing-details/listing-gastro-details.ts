import type { CollectionConfig, Field } from 'payload'
import { listingDetailAccessControl } from '../listings/access'
import { customSectionsFields, priceableOptionFields } from '../listings/fields'
import { commonListingDetailFields, commonListingDetailPriceField } from './common'
import { syncListingFromDetail } from './hooks/sync-listing-from-detail'

export const listingGastroDetailFilters: Field = {
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
      name: 'dishTypes',
      type: 'relationship',
      relationTo: 'dish-types',
      hasMany: true,
    },
    {
      name: 'necessities',
      type: 'relationship',
      relationTo: 'necessities',
      hasMany: true,
    },
    {
      name: 'dietaryOptions',
      type: 'relationship',
      relationTo: 'dietary-options',
      hasMany: true,
    },
    {
      name: 'gastroRules',
      type: 'relationship',
      relationTo: 'gastro-rules',
      hasMany: true,
    },
  ],
}

export const listingGastroDetailOptions: Field = {
  name: 'options',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'cuisines',
      type: 'array',
      fields: [
        { name: 'cuisine', type: 'relationship', relationTo: 'cuisines', required: true },
        ...priceableOptionFields,
      ],
    },
    {
      name: 'foodPreparationStyles',
      type: 'array',
      fields: [
        {
          name: 'foodPreparationStyle',
          type: 'relationship',
          relationTo: 'food-preparation-styles',
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
    {
      name: 'personnel',
      type: 'array',
      fields: [
        { name: 'personnel', type: 'relationship', relationTo: 'personnel', required: true },
        ...priceableOptionFields,
      ],
    },
  ],
}

export const ListingGastroDetails: CollectionConfig = {
  slug: 'listing-gastro-details',
  access: listingDetailAccessControl,
  hooks: {
    afterChange: [syncListingFromDetail],
  },
  fields: [
    ...customSectionsFields,
    commonListingDetailPriceField,
    ...commonListingDetailFields,
    {
      name: 'type',
      type: 'select',
      options: ['gastro'],
      required: true,
      defaultValue: 'gastro',
    },
    {
      name: 'alcohol',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'servesAlcohol',
          type: 'checkbox',
          required: true,
          defaultValue: false,
        },
        {
          name: 'pricingUnit',
          type: 'select',
          options: ['per_person', 'per_event'],
          required: true,
        },
      ],
    },

    {
      name: 'kidsMenu',
      type: 'checkbox',
    },
    listingGastroDetailFilters,
    listingGastroDetailOptions,
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
