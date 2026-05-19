import { getRecordStatuses } from '@roo/common'
import { Access, Field, Where } from 'payload'
import { getMediaFields, priceField } from '../common-fields/common-fields'

export const variantsAccessControl: {
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
    if (req.user) {
      const query: Where = {
        or: [
          { status: { equals: 'active' } },
          {
            and: [
              { 'listing.company.owner': { equals: req.user.id } },
              { status: { in: getRecordStatuses(['active', 'inactive']) } },
            ],
          },
        ],
      }
      return query
    }
    return { status: { equals: 'active' } }
  },
  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    return {
      'listing.company.owner': { equals: req.user.id },
      status: { in: getRecordStatuses(['active', 'inactive']) },
    }
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}

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
