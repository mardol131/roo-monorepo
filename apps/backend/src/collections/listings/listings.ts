import { getRecordStatuses, slugify } from '@roo/common'
import type { CollectionConfig, Field, PayloadRequest } from 'payload'
import { getMediaFields } from '../common-fields/common-fields'
import { listingAccessControl, listingTypes, listingLocationField } from './utils'
import { Listing } from '@/payload-types'

export const listingFilters: Field[] = [
  {
    name: 'eventTypes',
    type: 'text',
    hasMany: true,
    required: true,
    minRows: 1,
  },
  {
    name: 'placeTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'gastroRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'venueRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'entertainmentRules',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'services',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'technologies',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'amenities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'activities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'cuisines',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'foodServiceStyles',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'necessities',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'entertainmentTypes',
    type: 'text',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'text',
    hasMany: true,
  },
]

export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'name',
  },
  access: listingAccessControl,
  fields: [
    {
      name: 'tariff',
      type: 'select',
      options: ['basic', 'premium'],
      defaultValue: 'basic',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [listingTypes.venue, listingTypes.gastro, listingTypes.entertainment],
      required: true,
    },
    {
      name: 'properties',
      type: 'group',
      fields: listingFilters,
      required: true,
    },
    {
      name: 'detail',
      type: 'relationship',
      relationTo: [
        'listing-venue-details',
        'listing-gastro-details',
        'listing-entertainment-details',
      ],
      hasMany: false,
      required: true,
    },
    listingLocationField,
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: getRecordStatuses(['active', 'archived', 'inactive', 'disabled']),
      required: true,
      defaultValue: 'inactive',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      type: 'text',
    },
    {
      name: 'indoor',
      type: 'checkbox',
    },
    {
      name: 'outdoor',
      type: 'checkbox',
    },
    {
      name: 'guests',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'min',
          type: 'number',
        },
        {
          name: 'max',
          type: 'number',
        },
        {
          name: 'ztp',
          type: 'checkbox',
        },
        {
          name: 'pets',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'coverImage',
          type: 'group',
          fields: getMediaFields(true),
          required: true,
        },
        {
          name: 'logo',
          type: 'group',
          fields: getMediaFields(),
        },
        {
          name: 'gallery',
          type: 'array',
          fields: getMediaFields(true),
          required: true,
          minRows: 4,
        },
      ],
    },
    {
      name: 'price',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'startsAt',
          type: 'number',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        if (!data.slug) {
          data.slug = slugify(data.name, true)
        }
      },
    ],
    afterChange: [
      async ({
        doc,
        previousDoc,
        req,
      }: {
        doc: Listing
        previousDoc: Listing | null
        req: PayloadRequest
      }) => {
        if (!doc.detail?.value || !previousDoc?.detail?.value) return

        let docDetail = doc.detail.value
        let prevDocDetail = previousDoc.detail.value

        if (typeof doc.detail.value === 'string') {
          const detailRes = await req.payload.findByID({
            collection: doc.detail.relationTo,
            id: doc.detail.value,
          })
          if (!detailRes) throw new Error('Failed to fetch listing detail')
          docDetail = detailRes
        }

        if (typeof prevDocDetail === 'string' && previousDoc) {
          const detailRes = await req.payload.findByID({
            collection: previousDoc.detail.relationTo,
            id: prevDocDetail,
          })
          if (!detailRes) throw new Error('Failed to fetch listing detail')
          prevDocDetail = detailRes
        }

        if (typeof docDetail !== 'string' && 'spacesType' in docDetail) {
          const newSpacesType = docDetail.spacesType
          const prevSpacesType =
            typeof prevDocDetail !== 'string' && 'spacesType' in prevDocDetail
              ? prevDocDetail.spacesType
              : undefined

          if (!newSpacesType || newSpacesType === prevSpacesType) return

          await req.payload.update({
            collection: 'spaces',
            where: { listing: { equals: doc.id } },
            data: { status: 'disabled' },
          })
        }
      },
      async ({ doc, previousDoc, req }) => {
        if (doc.status === previousDoc?.status) return
        if (doc.status === 'active') return

        const listingFilter = { listing: { equals: doc.id } }

        if (doc.status === 'inactive' || doc.status === 'archived' || doc.status === 'disabled') {
          await req.payload.update({
            collection: 'inquiries',
            where: {
              and: [
                listingFilter,
                {
                  or: [
                    { 'status.company': { not_equals: 'confirmed' } },
                    { 'status.user': { not_equals: 'confirmed' } },
                  ],
                },
              ],
            },
            data: { status: { listing: 'unavailable' } },
          })
        }

        if (doc.status === 'archived' || doc.status === 'disabled') {
          await Promise.all([
            req.payload.update({
              collection: 'variants',
              where: listingFilter,
              data: { status: 'disabled' },
            }),
            req.payload.update({
              collection: 'spaces',
              where: listingFilter,
              data: { status: 'disabled' },
            }),
            req.payload.update({
              collection: 'calendar-events',
              where: listingFilter,
              data: { status: 'cancelled' },
            }),
          ])
        }
      },
    ],
  },
}
