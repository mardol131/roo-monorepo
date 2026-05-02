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
          (data.status?.company ?? originalDoc.status?.company) === 'confirmed' &&
          (data.status?.user ?? originalDoc.status?.user) === 'confirmed'

        const alreadySnapped = originalDoc.snapshots?.listing != null

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

        data.snapshots = { listing, variant }

        return data
      },
    ],
  },
  fields: [
    // ── Relace ──────────────────────────────────────────────────────────────────
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
    // ── Request ─────────────────────────────────────────────────────────────────
    {
      name: 'request',
      type: 'group',
      fields: [
        {
          name: 'note',
          type: 'textarea',
        },
        {
          name: 'requirements',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
      ],
    },
    // ── Status ──────────────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'group',
      fields: [
        {
          name: 'company',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: INQUIRY_STATUS,
        },
        {
          name: 'user',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: INQUIRY_STATUS,
        },
      ],
    },
    // ── Pricing ─────────────────────────────────────────────────────────────────
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'mode',
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
      ],
    },

    // ── Activity ─────────────────────────────────────────────────────────────────
    {
      name: 'activity',
      type: 'group',
      fields: [
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
      ],
    },
    // ── Snapshots ────────────────────────────────────────────────────────────────
    {
      name: 'snapshots',
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
