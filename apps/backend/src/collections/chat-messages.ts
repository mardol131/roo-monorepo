import type { CollectionConfig } from 'payload'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  admin: {
    useAsTitle: 'content',
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
      type: 'textarea',
      required: true,
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
