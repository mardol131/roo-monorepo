import { getRecordStatuses } from '@roo/common'
import type { Field } from 'payload'
import { getPhoneField } from '../common/phone'

export const eventsFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: 'planned',
    options: getRecordStatuses(['active', 'archived', 'disabled', 'completed']),
  },
  {
    name: 'eventType',
    type: 'relationship',
    relationTo: 'event-types',
    required: true,
  },
  {
    name: 'budget',
    type: 'number',
    defaultValue: 0,
  },
  {
    name: 'notes',
    type: 'array',
    fields: [
      {
        name: 'note',
        type: 'text',
      },
      {
        name: 'createdAt',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString(),
      },
      {
        name: 'description',
        type: 'text',
      },
    ],
  },
  {
    name: 'checklist',
    type: 'array',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
      },
      {
        name: 'dueDate',
        type: 'date',
      },
      {
        name: 'completed',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'priority',
        type: 'select',
        options: ['low', 'medium', 'high'],
        defaultValue: 'medium',
      },
    ],
  },
  {
    name: 'icon',
    type: 'text',
  },
  {
    name: 'date',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'start',
        type: 'date',
        required: true,
      },
      {
        name: 'end',
        type: 'date',
        required: true,
      },
    ],
  },
  {
    name: 'sharing',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'confirmedInquiries',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'place',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },
  {
    name: 'location',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'type',
        type: 'select',
        required: true,
        defaultValue: 'custom',
        options: ['custom', 'venue'],
      },
      {
        name: 'venue',
        type: 'relationship',
        relationTo: 'listings',
        admin: {
          description: 'Vyberte venue z katalogu služeb.',
        },
      },
      {
        name: 'city',
        type: 'relationship',
        relationTo: 'cities',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.type === 'custom' && !value) {
            return 'Město je povinné, pokud není zvoleno venue z katalogu.'
          }
          return true
        },
      },
      {
        name: 'address',
        type: 'text',
      },
      {
        name: 'spaceType',
        type: 'relationship',
        relationTo: 'space-types',
        validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
          if (siblingData?.type === 'custom' && !value) {
            return 'Typ prostoru je povinný, pokud není zvoleno venue z katalogu.'
          }
          return true
        },
      },
      {
        name: 'description',
        type: 'text',
      },
    ],
  },
  {
    name: 'guests',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'adults',
        type: 'number',
        required: true,
        defaultValue: 0,
      },
      {
        name: 'children',
        type: 'number',
        required: true,
        defaultValue: 0,
      },
      {
        name: 'ztp',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'pets',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
  {
    name: 'contactPerson',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        required: true,
      },
      getPhoneField(false),
    ],
  },
  {
    name: 'owner',
    type: 'relationship',
    relationTo: 'users',
    required: true,
  },
]
