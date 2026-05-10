import { getRecordStatuses } from '@roo/common'
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
      name: 'variant',
      type: 'relationship',
      relationTo: ['variants'],
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

    // ── Request ─────────────────────────────────────────────────────────────────
    {
      name: 'request',
      type: 'group',
      required: true,
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
      required: true,
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
        {
          name: 'listing',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: getRecordStatuses(['active', 'unavailable']),
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: getRecordStatuses(['active', 'unavailable']),
        },
      ],
    },
    // ── Pricing ─────────────────────────────────────────────────────────────────
    {
      name: 'pricing',
      type: 'group',
      required: true,
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
      required: true,
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
      required: true,
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
