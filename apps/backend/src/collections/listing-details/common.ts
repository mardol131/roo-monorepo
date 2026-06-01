import { PRICING_UNITS_ARRAY, TRAVEL_FEE_TYPE_ARRAY } from '@roo/common'
import { Field } from 'payload'
import { getMediaFields, getSeasonalPricesArrayField } from '../common/common-fields'

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
