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

export const getMediaFields = (required?: boolean): Field[] => [
  {
    name: 'filename',
    type: 'text',
    required,
  },
  {
    name: 'alt',
    type: 'text',
  },
  {
    name: 'width',
    type: 'number',
  },
  {
    name: 'height',
    type: 'number',
  },
  {
    name: 'size',
    type: 'number',
  },
  {
    name: 'mimeType',
    type: 'text',
  },
]
