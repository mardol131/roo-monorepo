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
  priceField,
]

export const variantsCommonFields: Field[] = [
  {
    name: 'listing',
    type: 'relationship',
    relationTo: 'venue-listings',
    hasMany: false,
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
  },
  {
    name: 'availability',
    type: 'select',
    options: ['allDay', 'selectedHours'],
    required: true,
  },
  {
    name: 'selectedHours',
    type: 'group',
    fields: [
      {
        name: 'from',
        type: 'text',
      },
      {
        name: 'to',
        type: 'text',
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
]
