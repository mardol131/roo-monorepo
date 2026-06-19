import { getRecordStatuses, PRICING_UNITS_ARRAY } from '@roo/common'
import { Field, Where } from 'payload'
import { priceableOptionFields } from '../listings/fields'

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
    name: 'customRequest',
    type: 'group',
    required: true,
    fields: [
      {
        name: 'note',
        type: 'textarea',
      },
      {
        name: 'addons',
        type: 'array',
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'optionId',
            type: 'text',
            required: true,
          },
          ...priceableOptionFields,
        ],
      },
      {
        name: 'spaces',
        type: 'array',
        fields: [
          {
            name: 'spaceId',
            type: 'text',
            required: true,
          },
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'price',
            type: 'number',
          },
          {
            name: 'pricingUnit',
            type: 'select',
            options: PRICING_UNITS_ARRAY,
            required: true,
          },
        ],
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
        name: 'accommodation',
        type: 'group',
        fields: [{ name: 'guests', type: 'number', min: 0 }],
      },
      {
        name: 'breakfast',
        type: 'group',
        fields: [{ name: 'guests', type: 'number', min: 0 }],
      },
      {
        name: 'parking',
        type: 'group',
        fields: [{ name: 'spots', type: 'number', min: 0 }],
      },
    ],
  },
  // ── Service time ────────────────────────────────────────────────────────────
  {
    name: 'serviceTime',
    type: 'group',
    fields: [
      {
        name: 'startTime',
        type: 'date',
        admin: { date: { pickerAppearance: 'dayAndTime' } },
      },
      {
        name: 'endTime',
        type: 'date',
        admin: { date: { pickerAppearance: 'dayAndTime' } },
      },
      {
        name: 'arrivalTime',
        type: 'date',
        admin: { date: { pickerAppearance: 'dayAndTime' } },
      },
    ],
  },
  // ── Travel fee estimate ──────────────────────────────────────────────────────
  {
    name: 'travelFeeAmount',
    type: 'number',
    min: 0,
    admin: {
      description: 'Odhadovaná cena cestovného (pouze informativní, nezahrnuje se do ceny)',
    },
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
