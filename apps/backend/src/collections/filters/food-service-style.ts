import type { CollectionConfig } from 'payload'

export const FoodServiceStyle: CollectionConfig = {
  slug: 'food-service-styles',
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
