import type { CollectionConfig } from 'payload'

export const CalendarEvents: CollectionConfig = {
  slug: 'calendar-events',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'listing.company.owner': { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'listing.company.owner': { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'listing.company.owner': { equals: req.user.id } }
    },
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (originalDoc?.source && operation === 'update') {
          data.source = originalDoc.source
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'spaces',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: true,
    },
    {
      name: 'inquiry',
      type: 'relationship',
      relationTo: 'inquiries',
    },
    {
      name: 'startsAt',
      type: 'date',
      required: true,
    },
    {
      name: 'endsAt',
      type: 'date',
      required: true,
    },
    {
      name: 'allDay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'source',
      type: 'select',
      options: ['manual', 'inquiry'],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['confirmed', 'tentative', 'cancelled'],
      defaultValue: 'tentative',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
