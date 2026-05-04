import { getRecordStatuses } from '@roo/common'
import { Field } from 'payload'

export const priceField: Field = {
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
}

export const listingsCommonFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    options: ['draft', 'active', 'archived'],
    required: true,
    defaultValue: 'draft',
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
    name: 'eventTypes',
    type: 'relationship',
    relationTo: 'event-types',
    hasMany: true,
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
    name: 'images',
    type: 'group',
    fields: [
      {
        name: 'coverImage',
        type: 'text',
        required: true,
      },
      {
        name: 'logo',
        type: 'text',
      },
      {
        name: 'gallery',
        type: 'array',
        fields: [
          {
            name: 'url',
            type: 'text',
          },
        ],
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
        name: 'groupedBy',
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
        type: 'text',
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
        type: 'text',
      },
    ],
  },
  {
    name: 'rules',
    type: 'relationship',
    relationTo: 'rules',
    hasMany: true,
  },
  {
    name: 'technologies',
    type: 'relationship',
    relationTo: 'technologies',
    hasMany: true,
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
]
