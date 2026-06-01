import { Field } from 'payload'
import { getMediaFields, getSeasonalPricesArrayField } from '../common/common-fields'
import { getRecordStatuses, PRICING_UNITS_ARRAY } from '@roo/common'

export const spacesFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    options: getRecordStatuses(['active', 'disabled', 'archived']),
    defaultValue: 'active',
    required: true,
  },
  {
    name: 'price',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'base',
        type: 'number',
        required: true,
      },
      {
        name: 'pricingUnit',
        type: 'select',
        options: PRICING_UNITS_ARRAY,
        required: true,
      },
      getSeasonalPricesArrayField({ required: false }),
    ],
  },
  {
    name: 'name',
    type: 'text',
    required: true,
  },

  {
    name: 'type',
    type: 'select',
    required: true,
    options: ['area', 'building', 'room'],
  },
  {
    name: 'parent',
    type: 'relationship',
    relationTo: 'spaces',
    hasMany: false,
  },
  {
    name: 'listing',
    type: 'relationship',
    relationTo: 'listings',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
  },
  {
    name: 'capacity',
    type: 'number',
    admin: { description: 'Maximální kapacita osob' },
  },
  {
    name: 'area',
    type: 'number',
    admin: { description: 'Plocha v m²' },
  },
  {
    name: 'images',
    type: 'array',
    fields: getMediaFields(),
  },
  {
    name: 'hasAccommodation',
    type: 'checkbox',
    admin: {
      description: 'Indikuje, zda prostor nabízí ubytování',
      condition: (data) => data?.type !== 'room',
    },
  },
  {
    name: 'accommodationCapacity',
    type: 'number',
    admin: {
      description: 'Kapacita ubytování (počet lůžek)',
      condition: (data) => data?.type !== 'room' && data?.hasAccommodation === true,
    },
  },
  {
    name: 'accommodationRooms',
    type: 'array',
    admin: {
      condition: (data) => data?.type !== 'room' && data?.hasAccommodation === true,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'capacity',
        type: 'number',
        required: true,
      },
      {
        name: 'countOfRoomsOfThisType',
        type: 'number',
        required: true,
      },
      {
        name: 'amenities',
        type: 'relationship',
        relationTo: 'room-amenities',
        hasMany: true,
      },
    ],
    label: 'Typy ubytovacích pokojů',
  },
  {
    name: 'spaceRules',
    type: 'relationship',
    relationTo: 'space-rules',
    hasMany: true,
  },
]
