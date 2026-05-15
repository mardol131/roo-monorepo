import type { CollectionConfig } from 'payload'
import { getPhoneField } from './common-fields/phone'
import { getRecordStatuses, slugify } from '@roo/common'
import { getMediaFields } from './common-fields/common-fields'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { status: { equals: 'active' } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { status: { equals: 'active' } }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        if (!data.slug) {
          data.slug = slugify(data.name, true)
        }
      },
    ],
    beforeChange: [
      async ({ data }) => {
        if (data.logo.filename === '') {
          delete data.logo
        }

        return data
      },
    ],
  },
  fields: [
    // Základní informace
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
      options: getRecordStatuses(['active', 'archived', 'disabled']),
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'ico',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'group',
      fields: getMediaFields(),
      // Stable object with nullable fields
      required: true,
    },

    // Kontaktní údaje
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    getPhoneField(true),
    {
      name: 'website',
      type: 'text',
    },

    // Vazba na uživatele (vlastník účtu)
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
    },

    //Fakturační údaje
    {
      name: 'billingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },

    // Daně a účetnictví

    {
      name: 'vatId',
      type: 'text',
    },

    // Collaboration fields
    {
      name: 'collaborators',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'permissions',
          type: 'group',
          required: true,
          fields: [
            {
              name: 'companies',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Vytvářet', value: 'create' },
                { label: 'Upravovat', value: 'edit' },
                { label: 'Mazat', value: 'delete' },
              ],
            },
            {
              name: 'listings',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Vytvářet', value: 'create' },
                { label: 'Upravovat', value: 'edit' },
                { label: 'Mazat', value: 'delete' },
                { label: 'Aktivovat katalog', value: 'activateCatalog' },
                { label: 'Deaktivovat katalog', value: 'deactivateCatalog' },
              ],
            },
            {
              name: 'inquiries',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Označit jako přijaté', value: 'accept' },
                { label: 'Mazat', value: 'delete' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
