import { getRecordStatuses } from '@roo/common'
import { Field, Where } from 'payload'

const INQUIRY_STATUS = ['pending', 'confirmed', 'cancelled']

export const inquiryFields: Field[] = [
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
    relationTo: 'listings',
    required: true,
  },
  {
    name: 'variant',
    type: 'relationship',
    relationTo: 'variants',
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
        access: {
          update: async ({ req, id }) => {
            if (req.user?.collection === 'admins') return true
            if (!req.user || !id) return false
            const { totalDocs } = await req.payload.find({
              collection: 'inquiries',
              where: {
                and: [
                  { id: { equals: id } },
                  {
                    or: [
                      { 'listing.company.owner': { equals: req.user.id } },
                      {
                        and: [
                          { 'listing.company.members.user': { equals: req.user.id } },
                          { 'listing.company.members.role': { in: ['admin', 'manager'] } },
                        ],
                      },
                    ] as Where[],
                  },
                ],
              },
              overrideAccess: true,
              depth: 0,
              limit: 1,
            })
            return totalDocs > 0
          },
        },
      },
      {
        name: 'user',
        type: 'select',
        required: true,
        defaultValue: 'pending',
        options: INQUIRY_STATUS,
        access: {
          update: async ({ req, id }) => {
            if (req.user?.collection === 'admins') return true
            if (!req.user || !id) return false
            const { totalDocs } = await req.payload.find({
              collection: 'inquiries',
              where: {
                and: [{ id: { equals: id } }, { user: { equals: req.user.id } }],
              },
              overrideAccess: true,
              depth: 0,
              limit: 1,
            })
            return totalDocs > 0
          },
        },
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
]
