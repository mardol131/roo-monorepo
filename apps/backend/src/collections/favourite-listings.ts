import type { CollectionConfig } from 'payload'

export const FavouriteListings: CollectionConfig = {
  slug: 'favourite-listings',
  admin: {
    useAsTitle: 'user',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'addedAt',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString(),
    },
  ],
}
