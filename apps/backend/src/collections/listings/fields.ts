import { Field } from 'payload'
import { getMediaFields, getSeasonalPricesArrayField } from '../common/common-fields'
import {
  COUNTRIES,
  getRecordStatuses,
  PRICING_UNITS_ARRAY,
  PricingUnits,
  TRAVEL_FEE_TYPE_ARRAY,
} from '@roo/common'
import { listingTypes } from './utils'
import { isCompanyManagerOrAbove, payloadAdminOnly } from './access'

export const servicableAreaFields: Field = {
  name: 'servicableArea',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'wholeCountry',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'maxTravelDistanceKm',
      type: 'number',
      min: 1,
      max: 500,
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        const area = data?.servicableArea as Record<string, unknown> | undefined
        if (
          (data?.type === listingTypes.gastro || data?.type === listingTypes.entertainment) &&
          !area?.wholeCountry &&
          !value
        ) {
          return 'Zadejte maximální dojezdovou vzdálenost'
        }
        return true
      },
    },
  ],
}

export const listingLocationField: Field = {
  name: 'location',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'point',
      type: 'point',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      required: true,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRIES,
      required: true,
    },
  ],
}

export const customSectionsFields: Field[] = [
  {
    name: 'customSections',
    type: 'blocks',
    blocks: [
      {
        slug: 'gallery1',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'text', type: 'textarea' },
          {
            name: 'images',
            type: 'array',
            minRows: 1,
            maxRows: 1,
            fields: getMediaFields(true),
            required: true,
          },
        ],
      },
      {
        slug: 'gallery2',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'text', type: 'textarea' },
          {
            name: 'images',
            type: 'array',
            minRows: 2,
            maxRows: 2,
            fields: getMediaFields(true),
            required: true,
          },
        ],
      },
      {
        slug: 'gallery4',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'text', type: 'textarea' },
          { name: 'images', type: 'array', minRows: 4, maxRows: 4, fields: getMediaFields(true) },
        ],
      },
      {
        slug: 'gallery5',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'text', type: 'textarea' },
          {
            name: 'images',
            type: 'array',
            minRows: 5,
            maxRows: 5,
            fields: getMediaFields(true),
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'sectionOrder',
    type: 'array',
    fields: [
      {
        name: 'key',
        type: 'text',
        required: true,
      },
    ],
  },
]

export const priceableOptionFields: Field[] = [
  {
    name: 'pricingUnit',
    type: 'select',
    options: PRICING_UNITS_ARRAY,
    required: true,
  },
  { name: 'unitPrice', type: 'number', required: true },
  { name: 'quantity', type: 'number', required: true, defaultValue: 1, min: 1 },
]

export const listingFilterFields: Field[] = [
  // common
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
    name: 'allEventTypes',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'necessities',
    type: 'relationship',
    relationTo: 'necessities',
    hasMany: true,
  },

  // venue
  {
    name: 'placeTypes',
    type: 'relationship',
    relationTo: 'place-types',
    hasMany: true,
  },
  {
    name: 'venueRules',
    type: 'relationship',
    relationTo: 'venue-rules',
    hasMany: true,
  },

  // entertainment
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

  // gastro
  {
    name: 'gastroRules',
    type: 'relationship',
    relationTo: 'gastro-rules',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'relationship',
    relationTo: 'dietary-options',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'relationship',
    relationTo: 'dish-types',
    hasMany: true,
  },
]

export const listingOptionFields: Field[] = [
  {
    name: 'cuisines',
    type: 'relationship',
    relationTo: 'cuisines',
    hasMany: true,
  },
  {
    name: 'foodPreparationStyles',
    type: 'relationship',
    relationTo: 'food-preparation-styles',
    hasMany: true,
  },
  {
    name: 'services',
    type: 'relationship',
    relationTo: 'services',
    hasMany: true,
  },
  {
    name: 'technologies',
    type: 'relationship',
    relationTo: 'technologies',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
  },
  {
    name: 'amenities',
    type: 'relationship',
    relationTo: 'amenities',
    hasMany: true,
  },
  {
    name: 'activities',
    type: 'relationship',
    relationTo: 'activities',
    hasMany: true,
  },
]

export const listingFields: Field[] = [
  {
    name: 'tariff',
    type: 'select',
    options: ['basic'],
    defaultValue: 'basic',
    required: true,
    access: { update: payloadAdminOnly },
  },
  {
    name: 'type',
    type: 'select',
    options: [listingTypes.venue, listingTypes.gastro, listingTypes.entertainment],
    required: true,
    access: { update: payloadAdminOnly },
  },
  {
    name: 'subType',
    type: 'text',
    validate: (value: string | null | undefined, { data }: { data: Record<string, unknown> }) => {
      if (data?.type !== listingTypes.venue && !value) return 'SubType je povinný'
      return true
    },
  },
  {
    name: 'filters',
    type: 'group',
    fields: listingFilterFields,
    required: true,
  },
  {
    name: 'options',
    type: 'group',
    fields: listingOptionFields,
    required: true,
  },
  {
    name: 'detail',
    type: 'relationship',
    relationTo: [
      'listing-venue-details',
      'listing-gastro-details',
      'listing-entertainment-details',
    ],
    hasMany: false,
    required: true,
    access: { update: payloadAdminOnly },
  },
  listingLocationField,
  servicableAreaFields,
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    access: { update: payloadAdminOnly },
  },
  {
    name: 'status',
    type: 'select',
    options: getRecordStatuses(['active', 'archived', 'inactive', 'disabled']),
    required: true,
    defaultValue: 'active',
    access: { update: isCompanyManagerOrAbove },
  },
  {
    name: 'subscriptionStatus',
    type: 'select',
    options: ['unpaid', 'paid', 'cancelling', 'expired'],
    defaultValue: 'unpaid',
    required: true,
    access: { update: payloadAdminOnly },
  },
  {
    name: 'company',
    type: 'relationship',
    relationTo: 'companies',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
  },
  {
    name: 'shortDescription',
    type: 'text',
    required: true,
  },
  {
    name: 'indoor',
    type: 'checkbox',
  },
  {
    name: 'outdoor',
    type: 'checkbox',
  },
  {
    name: 'guests',
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
      {
        name: 'ztp',
        type: 'checkbox',
      },
      {
        name: 'pets',
        type: 'checkbox',
      },
    ],
  },
  {
    name: 'images',
    type: 'group',
    fields: [
      {
        name: 'coverImage',
        type: 'group',
        fields: getMediaFields(true),
        required: true,
      },
      {
        name: 'logo',
        type: 'group',
        fields: getMediaFields(),
      },
      {
        name: 'gallery',
        type: 'array',
        fields: getMediaFields(true),
        required: true,
        minRows: 4,
      },
    ],
  },
  { name: 'minimumPricePerEvent', type: 'number', min: 0, required: true },
  { name: 'pricingUnit', type: 'select', options: PRICING_UNITS_ARRAY, admin: { readOnly: true } },
  { name: 'minimumVariantPrice', type: 'number', min: 0, admin: { readOnly: true } },
  { name: 'variantPricingUnit', type: 'select', options: PRICING_UNITS_ARRAY, admin: { readOnly: true } },
]
