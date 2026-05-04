import { getRecordStatuses } from '@roo/common'
import type { CollectionConfig } from 'payload'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      return { status: { equals: 'active' } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return {
        status: { equals: 'active' },
        'listing.company.owner': { equals: req.user.id },
      }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      options: getRecordStatuses(),
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['area', 'building', 'room'],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: false,
    },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'capacity',
      type: 'number',
      admin: { description: 'Maximální kapacita osob' },
    },
    {
      name: 'area',
      type: 'number',
      admin: { description: 'Plocha v m²' },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'text',
        },
      ],
    },
    {
      name: 'hasAccommodation',
      type: 'checkbox',
      admin: { description: 'Indikuje, zda prostor nabízí ubytování' },
    },
    {
      name: 'accommodationCapacity',
      type: 'number',
      admin: { description: 'Kapacita ubytování (počet lůžek)' },
    },
    {
      name: 'rooms',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'capacity',
          type: 'number',
          required: true,
        },
        {
          name: 'countOfRoomsOfThisType',
          type: 'number',
          required: true,
        },
        {
          name: 'amenities',
          type: 'relationship',
          relationTo: 'room-amenities',
          hasMany: true,
        },
      ],
    },
    {
      name: 'spaceRules',
      type: 'relationship',
      relationTo: 'rules',
      hasMany: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.status === previousDoc?.status) return
        if (doc.status === 'active') return

        await req.payload.update({
          collection: 'spaces',
          where: { parent: { equals: doc.id } },
          data: { status: 'disabled' },
        })
      },
    ],
  },
}
