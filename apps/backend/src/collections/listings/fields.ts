import { Field } from 'payload'
import { getMediaFields, getSeasonalPricesArrayField } from '../common/common-fields'
import {
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
      name: 'regions',
      type: 'text',
      hasMany: true,
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        const area = data?.servicableArea as Record<string, unknown> | undefined
        if (
          (data?.type === listingTypes.gastro || data?.type === listingTypes.entertainment) &&
          !area?.wholeCountry &&
          !(value as unknown[])?.length
        ) {
          return 'Vyberte alespoň jeden kraj'
        }
        return true
      },
    },
    {
      name: 'districts',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'cities',
      type: 'text',
      hasMany: true,
    },
  ],
}

export const listingLocationField: Field = {
  name: 'location',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'latitude',
      type: 'number',
      required: true,
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
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

export const commonListingDetailFields: Field[] = [
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
      {
        name: 'travelFeeEnabled',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'travelFeePerKm',
        type: 'number',
        min: 0,
        admin: {
          condition: (data) => data?.price?.travelFeeEnabled,
        },
      },
      {
        name: 'travelFeeType',
        type: 'select',
        options: TRAVEL_FEE_TYPE_ARRAY,
        admin: {
          condition: (data) => data?.price?.travelFeeEnabled,
        },
      },
      {
        name: 'travelFeeStartsAtKm',
        type: 'number',
        min: 0,
        admin: {
          condition: (data) => data?.price?.travelFeeEnabled,
        },
      },
    ],
  },
  {
    name: 'faq',
    type: 'array',
    fields: [
      {
        name: 'active',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        name: 'question',
        type: 'text',
        required: true,
      },
      {
        name: 'answer',
        type: 'textarea',
        required: true,
      },
      {
        name: 'group',
        type: 'select',
        options: ['general', 'booking', 'cancellation', 'payment', 'other'],
        defaultValue: 'general',
      },
    ],
  },
  {
    name: 'references',
    type: 'array',
    fields: [
      {
        name: 'image',
        type: 'group',
        required: true,
        fields: getMediaFields(),
      },
      {
        name: 'eventName',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'clientName',
        type: 'text',
      },
      {
        name: 'eventType',
        type: 'relationship',
        relationTo: 'event-types',
      },
    ],
  },
  {
    name: 'employees',
    type: 'array',
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'role',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'image',
        type: 'group',
        required: true,
        fields: getMediaFields(),
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
    type: 'text',
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
    type: 'text',
    hasMany: true,
  },

  // venue
  {
    name: 'placeTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'venueRules',
    type: 'text',
    hasMany: true,
  },

  // entertainment
  {
    name: 'musicGenres',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'entertainmentRules',
    type: 'text',
    hasMany: true,
  },

  // gastro
  {
    name: 'gastroRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'text',
    hasMany: true,
  },
]

export const listingOptionFields: Field[] = [
  {
    name: 'cuisines',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'foodServiceStyles',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'services',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'technologies',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'amenities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'activities',
    type: 'text',
    hasMany: true,
  },
]

export const listingFields: Field[] = [
  {
    name: 'tariff',
    type: 'select',
    options: ['basic', 'premium'],
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
    defaultValue: 'inactive',
    access: { update: isCompanyManagerOrAbove },
  },
  {
    name: 'subscriptionActive',
    type: 'checkbox',
    defaultValue: false,
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
]
