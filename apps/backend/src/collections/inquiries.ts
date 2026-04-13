import type { CollectionConfig } from 'payload'

const INQUIRY_STATUS = ['pending', 'confirmed', 'cancelled']

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
      options: INQUIRY_STATUS,
    },
    {
      name: 'userStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: INQUIRY_STATUS,
    },
    {
      name: 'pricingMode',
      type: 'select',
      required: true,
      defaultValue: 'fixed',
      options: ['fixed', 'open'],
    },
    {
      name: 'quotedPrice',
      type: 'number',
    },
    {
      name: 'agreedPrice',
      type: 'number',
    },
    {
      name: 'customRequest',
      type: 'textarea',
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
      name: 'listing',
      type: 'relationship',
      relationTo: ['listings'],
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
      relationTo: ['variants'],
    },
  ],
}
