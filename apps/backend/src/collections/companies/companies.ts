import type { CollectionConfig } from 'payload'
import { getPhoneField } from '../common-fields/phone'
import { getRecordStatuses, slugify } from '@roo/common'
import { getMediaFields } from '../common-fields/common-fields'
import { memberRoleField } from '../common-fields/member-permissions'
import { membersInviteEndpoint } from './endpoints/members/invite'
import { verifyMemberEndpoint } from './endpoints/members/verify'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  endpoints: [membersInviteEndpoint, verifyMemberEndpoint],
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => true,
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
      name: 'members',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        memberRoleField,
      ],
    },
  ],
}
