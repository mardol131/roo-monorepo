import { adminOrApiKeyAuth } from '@/functions/ACL'
import { COUNTRIES, slugify } from '@roo/common'
import type { CollectionConfig, Where } from 'payload'
import { filtersAccess } from '../common/access'

export const Districts: CollectionConfig = {
  slug: 'districts',
  admin: {
    useAsTitle: 'name',
  },
  access: filtersAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'region',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRIES,
      required: true,
    },
    { name: 'bboxMinLon', type: 'number', required: true },
    { name: 'bboxMinLat', type: 'number', required: true },
    { name: 'bboxMaxLon', type: 'number', required: true },
    { name: 'bboxMaxLat', type: 'number', required: true },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) return
        if (data.name) {
          data.slug = slugify(data.name)
        }
      },
    ],
  },
}
