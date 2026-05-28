import type { Field } from 'payload'

export const calendarEventsFields: Field[] = [
  {
    name: 'listing',
    type: 'relationship',
    relationTo: 'listings',
    required: true,
  },
  {
    name: 'spaces',
    type: 'relationship',
    relationTo: 'spaces',
    hasMany: true,
  },
  {
    name: 'inquiry',
    type: 'relationship',
    relationTo: 'inquiries',
  },
  {
    name: 'startsAt',
    type: 'date',
    required: true,
  },
  {
    name: 'endsAt',
    type: 'date',
    required: true,
  },
  {
    name: 'allDay',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'source',
    type: 'select',
    options: ['manual', 'inquiry'],
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    options: ['confirmed', 'tentative', 'cancelled'],
    defaultValue: 'tentative',
    required: true,
  },
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
  },
]
