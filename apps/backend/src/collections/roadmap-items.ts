import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'

export const RoadmapItems: CollectionConfig = {
  slug: 'roadmap-items',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    update: ({ req }) => adminOrApiKeyAuth(req),
    create: ({ req }) => adminOrApiKeyAuth(req),
    delete: ({ req }) => adminOrApiKeyAuth(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'votes',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'in-progress', 'completed'],
      defaultValue: 'planned',
    },
  ],
}
