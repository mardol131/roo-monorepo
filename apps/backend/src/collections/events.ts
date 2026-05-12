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
          name: 'contactDetails',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'confirmedInquiries',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'place',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'location',
      type: 'blocks',
      maxRows: 1,
      minRows: 1,
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
              required: true,
            },
            {
              name: 'address',
              type: 'text',
              admin: {
                placeholder: 'Ulice a číslo popisné',
              },
            },
            {
              name: 'spaceType',
              type: 'relationship',
              relationTo: 'space-types',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
          ],
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
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation }) => {
        if (operation === 'update') {
          return
        }
        if (!req.user || !req.data) {
          return
        }
        const { user } = req
        if (user) {
          req.data.owner = user.id
        }
      },
    ],
  },
}
