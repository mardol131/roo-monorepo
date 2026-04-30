import type { CollectionConfig } from 'payload'

const INQUIRY_STATUS = ['pending', 'confirmed', 'cancelled']

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'id',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation !== 'update') return data

        const bothConfirmed =
          (data.companyStatus ?? originalDoc.companyStatus) === 'confirmed' &&
          (data.userStatus ?? originalDoc.userStatus) === 'confirmed'

        const alreadySnapped = originalDoc.dataSnapshots?.listing != null

        if (!bothConfirmed || alreadySnapped) return data

        const listingId =
          typeof originalDoc.listing === 'object' ? originalDoc.listing?.id : originalDoc.listing
        const variantId =
          typeof originalDoc.variant === 'object' ? originalDoc.variant?.id : originalDoc.variant

        const listing = await req.payload.findByID({
          collection: 'listings',
          id: listingId,
          depth: 2,
        })

        const variant = variantId
          ? await req.payload.findByID({
              collection: 'variants',
              id: variantId,
              depth: 2,
            })
          : null

        data.dataSnapshots = { listing, variant }

        return data
      },
    ],
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
    {
      name: 'customRequirements',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'dataSnapshots',
      type: 'group',
      fields: [
        {
          name: 'listing',
          type: 'json',
        },
        {
          name: 'variant',
          type: 'json',
        },
      ],
    },
  ],
}
