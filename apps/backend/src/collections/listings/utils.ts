import { Access, Block, Field, Where } from 'payload'
import { getMediaFields } from '../common-fields/common-fields'

type LocationSiblings = {
  type?: string
  district?: unknown[]
  region?: unknown[]
  city?: unknown[]
}

export const listingTypes = {
  venue: 'venue',
  gastro: 'gastro',
  entertainment: 'entertainment',
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

export const listingAccessControl: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  create: ({ req }) => {
    return !!req.user
  },
  read: ({ req }) => {
    if (req.user?.collection === 'admins') return true
    if (!req.user) {
      const query: Where = { status: { equals: 'active' } }
      return query
    }
    return {
      or: [
        {
          and: [
            { 'company.owner': { equals: req.user.id } },
            { status: { in: ['active', 'inactive'] } },
          ],
        },
        {
          and: [{ 'company.owner': { not_equals: req.user.id } }, { status: { equals: 'active' } }],
        },
      ],
    }
  },
  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    return { 'company.owner': { equals: req.user.id } }
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}

export const listingDetailAccessControl: {
  create: Access
  read: Access
  update: Access
  delete: Access
} = {
  read: () => true,
  create: ({ req }) => !!req.user,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => req.user?.collection === 'admins',
}
