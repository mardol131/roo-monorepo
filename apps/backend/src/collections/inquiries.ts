import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'companyStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: ['pending', 'confirmed', 'declined'],
    },
    {
      name: 'userStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: ['pending', 'confirmed', 'cancelled'],
    },
    {
      name: 'sentAt',
      type: 'date',
      required: true,
    },
    {
      name: 'lastCompanyMessageSentAt',
      type: 'date',
    },
    {
      name: 'lastUserMessageSentAt',
      type: 'date',
    },
    {
      name: 'lastUserSeenAt',
      type: 'date',
    },
    {
      name: 'lastCompanySeenAt',
      type: 'date',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'listingType',
      type: 'select',
      required: true,
      options: ['venue', 'gastro', 'entertainment'],
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: ['entertainment-variants', 'gastro-variants', 'venue-variants'],
      required: true,
    },
  ],
}
