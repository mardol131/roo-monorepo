import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
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
      options: ['planning', 'deactivated', 'completed'],
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
      ],
    },
    {
      name: 'checklist',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
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
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'city',
          type: 'relationship',
          relationTo: 'cities',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'venue',
          type: 'relationship',
          relationTo: 'venue-listings',
        },
      ],
    },
    {
      name: 'guests',
      type: 'group',
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
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
