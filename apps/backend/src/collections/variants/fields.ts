import { getRecordStatuses, PRICING_UNITS_ARRAY } from '@roo/common'
import { Field } from 'payload'
import { getMediaFields, getSeasonalPricesArrayField } from '../common/common-fields'

export const venueVariantDetails: Field[] = [
  {
    name: 'includedSpaces',
    type: 'relationship',
    relationTo: 'spaces',
    hasMany: true,
  },
  {
    name: 'accommodation',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'included',
        type: 'checkbox',
      },
      {
        name: 'capacity',
        type: 'number',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.included && (value === undefined || value === null)) {
            return 'Zadejte kapacitu ubytování'
          }
          return true
        },
      },
    ],
  },
  {
    name: 'breakfast',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'included',
        type: 'checkbox',
      },
      {
        name: 'price',
        type: 'number',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.included && (value === undefined || value === null)) {
            return 'Zadejte cenu snídaně'
          }
          return true
        },
      },
      {
        name: 'loweredPrice',
        type: 'number',
      },
    ],
  },
]

export const gastroVariantDetails: Field[] = [
  {
    name: 'kidsMenu',
    type: 'checkbox',
  },
  {
    name: 'alcoholIncluded',
    type: 'checkbox',
  },
  {
    name: 'minimumOrderAmount',
    type: 'number',
  },
]

export const entertainmentVariantDetails: Field[] = [
  {
    name: 'audience',
    type: 'select',
    hasMany: true,
    options: ['adults', 'kids', 'seniors'],
  },
  {
    name: 'performance',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'entertainmentIsPerformance',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'numberOfSets',
        type: 'number',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.entertainmentIsPerformance && (value === undefined || value === null)) {
            return 'Zadejte počet setů'
          }
          return true
        },
      },
      {
        name: 'pauseBetweenSetsInMinutes',
        type: 'number',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.entertainmentIsPerformance && (value === undefined || value === null)) {
            return 'Zadejte délku pauzy mezi sety v minutách'
          }
          return true
        },
      },
    ],
  },
]

export const variantsCommonFields: Field[] = [
  {
    name: 'listing',
    type: 'relationship',
    relationTo: 'listings',
    required: true,
    hasMany: false,
  },
  {
    name: 'status',
    type: 'select',
    options: getRecordStatuses(['active', 'archived', 'disabled', 'inactive']),
    defaultValue: 'active',
    required: true,
  },
  {
    name: 'capacity',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'min',
        type: 'number',
      },
      {
        name: 'max',
        type: 'number',
      },
    ],
  },
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'shortDescription',
    type: 'text',
    maxLength: 50,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    maxLength: 1000,
  },

  {
    name: 'price',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'base',
        type: 'number',
        min: 0,
        required: true,
      },
      {
        name: 'pricingUnit',
        type: 'select',
        options: PRICING_UNITS_ARRAY,
        required: true,
      },
      getSeasonalPricesArrayField({ required: false }),
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
    name: 'duration',
    type: 'group',
    fields: [
      {
        name: 'hasExactDuration',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'exactDurationMinutes',
        type: 'number',
        min: 1,
        admin: {
          condition: (_: unknown, siblingData: Record<string, unknown>) =>
            !!siblingData?.hasExactDuration,
        },
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.hasExactDuration && (value === undefined || value === null)) {
            return 'Zadejte přesnou délku v minutách'
          }
          return true
        },
      },
      {
        name: 'maxDurationMinutes',
        type: 'number',
        min: 1,
      },
    ],
  },
  {
    name: 'images',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'coverImage',
        type: 'group',
        required: true,
        fields: getMediaFields(),
      },
      {
        name: 'gallery',
        type: 'array',
        fields: getMediaFields(),
      },
    ],
  },
]

export const variantFields: Field[] = [
  ...variantsCommonFields,

  {
    name: 'details',
    type: 'blocks',
    required: true,
    maxRows: 1,
    blocks: [
      {
        slug: 'venue',
        fields: venueVariantDetails,
      },
      {
        slug: 'gastro',
        fields: gastroVariantDetails,
      },
      {
        slug: 'entertainment',
        fields: entertainmentVariantDetails,
      },
    ],
  },
]
