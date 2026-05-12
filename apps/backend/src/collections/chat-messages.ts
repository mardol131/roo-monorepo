import type { CollectionConfig, Where } from 'payload'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    create: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      const query: Where = {
        or: [
          { 'inquiry.user': { equals: req.user.id } },
          { 'inquiry.listing.company.owner': { equals: req.user.id } },
        ],
      }
      return query
    },
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      const query: Where = {
        or: [
          { 'inquiry.user': { equals: req.user.id } },
          { 'inquiry.listing.company.owner': { equals: req.user.id } },
        ],
      }
      return query
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return false
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return false
    },
  },
  fields: [
    {
      name: 'inquiry',
      type: 'relationship',
      relationTo: 'inquiries',
      required: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'senderType',
      type: 'select',
      required: true,
      options: [
        { label: 'Uživatel', value: 'user' },
        { label: 'Firma', value: 'company' },
      ],
    },
    {
      name: 'content',
      type: 'blocks',
      minRows: 1,
      maxRows: 1,
      blocks: [
        {
          slug: 'text',
          labels: { singular: 'Zpráva', plural: 'Zprávy' },
          fields: [
            {
              name: 'text',
              type: 'textarea',
            },
          ],
        },
        {
          slug: 'question',
          labels: { singular: 'Otázka', plural: 'Otázky' },
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'answer',
              type: 'text',
            },
            {
              name: 'answeredAt',
              type: 'date',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'sentAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
