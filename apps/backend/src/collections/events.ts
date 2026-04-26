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
      type: 'blocks',
      maxRows: 1,
      blocks: [
        {
          slug: 'venue',
          fields: [
            {
              name: 'venue',
              type: 'relationship',
              relationTo: 'listings',
              admin: {
                description: 'Vyberte venue z katalogu služeb.',
              },
            },
          ],
        },
        {
          slug: 'custom',
          fields: [
            {
              name: 'city',
              type: 'relationship',
              relationTo: 'cities',
            },
            {
              name: 'address',
              type: 'text',
              admin: {
                placeholder: 'Ulice a číslo popisné',
              },
            },
            {
              name: 'buildingType',
              type: 'select',
              options: [
                { label: 'Hotel', value: 'hotel' },
                { label: 'Restaurace', value: 'restaurant' },
                { label: 'Konferenční centrum', value: 'conference_center' },
                { label: 'Venkovní prostory', value: 'outdoor' },
                { label: 'Soukromé prostory', value: 'private' },
                { label: 'Jiné', value: 'other' },
              ],
              admin: {
                description: 'Nepovinné.',
              },
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Nepovinný popis místa (např. „Zahrada u rodinného domu").',
              },
            },
          ],
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
