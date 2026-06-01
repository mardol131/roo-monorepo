import type { CollectionConfig, Where } from 'payload'
import { getMediaFields } from './common/common-fields'
import { getRecordStatuses } from '@roo/common'
import { adminOrApiKeyAuth } from '@/functions/ACL'

export const UserMedia: CollectionConfig = {
  slug: 'user-media',
  access: {
    create: ({ req }) => !!req.user,
    read: async ({ req }) => {
      const query: Where = {
        and: [{ user: { equals: req.user?.id } }, { status: { equals: 'active' } }],
      }

      return query
    },
    update: ({ req }) => {
      const query: Where = {
        and: [{ user: { equals: req.user?.id } }, { status: { equals: 'active' } }],
      }

      return query
    },
    delete: ({ req }) => adminOrApiKeyAuth(req),
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req, originalDoc }) => {
        if (operation === 'update' && !adminOrApiKeyAuth(req)) {
          return { ...originalDoc, status: data.status }
        }
        return data
      },
    ],
  },
  fields: [
    ...getMediaFields(true),
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: getRecordStatuses(['active', 'archived', 'disabled']),
      defaultValue: 'active',
      required: true,
    },
  ],
}
