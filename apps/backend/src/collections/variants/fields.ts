import { getRecordStatuses } from '@roo/common'
import { Field } from 'payload'
import { getMediaFields, priceField } from '../common/common-fields'

export const venueVariantDetails: Field[] = [
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
        required: true,
      },
    ],
  },
  {
    name: 'amenities',
    type: 'relationship',
    relationTo: 'amenities',
    hasMany: true,
  },
  {
    name: 'technology',
    type: 'relationship',
    relationTo: 'technologies',
    hasMany: true,
  },
  {
    name: 'canBeBookedAsWhole',
    type: 'checkbox',
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
      },
    ],
  },
  {
    name: 'parking',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'included',
        type: 'checkbox',
      },
      {
        name: 'spots',
        type: 'number',
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
    name: 'cuisines',
    type: 'relationship',
    relationTo: 'cuisines',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'relationship',
    relationTo: 'dish-types',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'relationship',
    relationTo: 'dietary-options',
    hasMany: true,
  },
  {
    name: 'foodServiceStyle',
    type: 'relationship',
    relationTo: 'food-service-styles',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
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
        required: true,
      },
    ],
  },
  {
    name: 'pricePerPerson',
    type: 'number',
  },
  {
    name: 'necessities',
    type: 'relationship',
    relationTo: 'necessities',
    hasMany: true,
  },
  {
    name: 'kidsMenu',
    type: 'checkbox',
  },
  {
    name: 'alcoholIncluded',
    type: 'checkbox',
  },
  {
    name: 'minimumOrderCount',
    type: 'number',
  },
]

export const entertainmentVariantDetails: Field[] = [
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
  },
  {
    name: 'necessities',
    type: 'relationship',
    relationTo: 'necessities',
    hasMany: true,
  },
  {
    name: 'audience',
    type: 'select',
    hasMany: true,
    options: ['adults', 'kids', 'seniors'],
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
        required: true,
      },
    ],
  },
  {
    name: 'performanceDuration',
    type: 'number',
    admin: {
      description: 'Délka vystoupení v minutách',
    },
  },
  {
    name: 'numberOfSets',
    type: 'number',
    admin: {
      description: 'Počet setů/bloků vystoupení',
    },
  },
  {
    name: 'breakDuration',
    type: 'number',
    admin: {
      description: 'Délka přestávky mezi sety v minutách',
    },
  },
  {
    name: 'setupAndTeardown',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'setupTime',
        type: 'number',
        admin: {
          description: 'Čas potřebný na přípravu v minutách',
        },
      },
      {
        name: 'teardownTime',
        type: 'number',
        admin: {
          description: 'Čas potřebný na úklid v minutách',
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
    name: 'type',
    type: 'select',
    options: ['allYear', 'seasonal'],
    required: true,
  },
  {
    name: 'selectedSeasons',
    type: 'array',
    fields: [
      {
        name: 'from',
        type: 'text',
        required: true,
      },
      {
        name: 'to',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    name: 'availability',
    type: 'select',
    options: ['allDay', 'selectedHours'],
    required: true,
  },
  {
    name: 'selectedHours',
    type: 'array',
    fields: [
      {
        name: 'from',
        type: 'text',
        required: true,
      },
      {
        name: 'to',
        type: 'text',
        required: true,
      },
    ],
  },
  priceField,
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
    name: 'eventTypes',
    type: 'relationship',
    relationTo: 'event-types',
    hasMany: true,
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
