import { buckets, PRICING_UNITS_ARRAY, TRAVEL_FEE_TYPE_ARRAY } from '@roo/common'
import { Field } from 'payload'

export function getSeasonalPricesArrayField({ required = false }: { required: boolean }): Field {
  return {
    name: 'seasonalPrices',
    type: 'array',
    required,
    minRows: 0,
    fields: [
      {
        name: 'amount',
        type: 'number',
        required: true,
      },
      {
        name: 'adjustmentType',
        type: 'select',
        options: ['surcharge', 'discount'],
        required: true,
      },
      { name: 'valueType', type: 'select', options: ['absolute', 'percentage'], required: true },
      {
        name: 'title',
        type: 'text',
        required: true,
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
  }
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
  {
    name: 'bucket',
    type: 'select',
    options: [buckets['listings-images'], buckets['listings-videos']],
  },
]
