import type { CollectionConfig, Where } from 'payload'
import { memberRoleField } from './common/member-permissions'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'admins',
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      const query: Where = {
        and: [
          { 'company.owner': { equals: req.user.id } },
          { status: { in: ['pending', 'accepted'] } },
        ],
      }
      return query
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'company.owner': { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    memberRoleField,
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'accepted', 'cancelled'],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
