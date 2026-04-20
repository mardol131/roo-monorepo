import type { CollectionConfig } from 'payload'

export const CalendarEvents: CollectionConfig = {
  slug: 'calendar-events',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: 'spaces',
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
  ],
}
