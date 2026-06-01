import { COUNTRIES, slugify } from '@roo/common'
import type { CollectionConfig } from 'payload'
import { filtersAccess } from '../common/access'

export const Countries: CollectionConfig = {
  slug: 'countries',
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

    { name: 'latitude', type: 'number', required: true },
    { name: 'longitude', type: 'number', required: true },
    { name: 'bboxMinLon', type: 'number', required: true },
    { name: 'bboxMinLat', type: 'number', required: true },
    { name: 'bboxMaxLon', type: 'number', required: true },
    { name: 'bboxMaxLat', type: 'number', required: true },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return
        if (data.name) {
          data.slug = slugify(data.name)
        }
        if (data.district && !data.region) {
          const district = await req.payload.findByID({
            collection: 'districts',
            id: data.district,
          })
          data.region = district.region
        }
      },
    ],
  },
}
