import type { CollectionConfig } from 'payload'

export const EventTypes: CollectionConfig = {
  slug: 'event-types',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
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
  ],
}
