import { getRecordStatuses, PRICING_UNITS_ARRAY } from '@roo/common'
import { Field } from 'payload'
import { getMediaFields } from '../common/common-fields'

export const variantFields: Field[] = [
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
    maxLength: 150,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    maxLength: 1000,
  },
  {
    name: 'capacity',
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
    ],
  },
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
      // Cena balíčku nezávisí na čase — délka je popis služby, ne cenová
      // proměnná. Hodinové/denní sazby patří do custom poptávky.
      {
        name: 'pricingUnit',
        type: 'select',
        options: PRICING_UNITS_ARRAY.filter((u) => u === 'lump_sum' || u === 'per_person'),
        required: true,
      },
    ],
  },
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
  // Jednorázová služba (dodavatel přijede v daný čas) vs. služba s trváním
  // (od–do). Řídí, jaký výběr času se zobrazí v poptávce.
  {
    name: 'isOneTime',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'durationMinutes',
    type: 'number',
    min: 1,
    admin: {
      condition: (_: unknown, siblingData: Record<string, unknown>) => !siblingData?.isOneTime,
    },
    validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
      if (!siblingData?.isOneTime && (value === undefined || value === null)) {
        return 'Zadejte orientační délku v minutách, nebo označte službu jako jednorázovou'
      }
      return true
    },
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
        fields: getMediaFields(true),
      },
      {
        name: 'gallery',
        type: 'array',
        fields: getMediaFields(),
      },
    ],
  },
]
