import { Field } from 'payload'
import { getMediaFields } from '../common/common-fields'
import { getRecordStatuses } from '@roo/common'
import { listingTypes } from './utils'
import { isCompanyManagerOrAbove, payloadAdminOnly } from './access'

type LocationSiblings = {
  type?: string
  district?: unknown[]
  region?: unknown[]
  city?: unknown[]
}

const validateRequiredForExact = (
  value: any,
  { siblingData }: { siblingData: LocationSiblings },
): true | string => {
  if (siblingData.type === 'exact' && (value === null || value === undefined)) {
    return 'Toto pole je povinné pro přesnou lokaci'
  }
  return true
}

export const listingLocationField: Field = {
  name: 'location',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['regions', 'exact'],
      required: true,
    },
    {
      name: 'latitude',
      type: 'number',
      validate: validateRequiredForExact,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'exact',
      },
    },
    {
      name: 'longitude',
      type: 'number',
      validate: validateRequiredForExact,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'exact',
      },
    },
    {
      name: 'address',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'exact',
      },
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      validate: validateRequiredForExact,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'exact',
      },
    },
    {
      name: 'districts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'regions',
      },
    },
    {
      name: 'regions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
      validate: (value, { siblingData }: { siblingData: LocationSiblings }) => {
        if (siblingData.type === 'regions' && !(value as any[])?.length) {
          return 'Kraj je povinný pro typ oblasti'
        }
        return true
      },
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'regions',
      },
    },
    {
      name: 'cities',
      type: 'relationship',
      relationTo: 'cities',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'regions',
      },
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

export const listingFilters: Field[] = [
  {
    name: 'eventTypes',
    type: 'text',
    hasMany: true,
    required: true,
    minRows: 1,
  },
  {
    name: 'placeTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'gastroRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'venueRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'entertainmentRules',
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
    name: 'amenities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'activities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'cuisines',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'foodServiceStyles',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'necessities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'entertainmentTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'personnel',
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
    name: 'properties',
    type: 'group',
    fields: listingFilters,
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
  {
    name: 'price',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'startsAt',
        type: 'number',
        required: true,
      },
    ],
  },
]
