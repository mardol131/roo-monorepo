import type { CollectionConfig } from 'payload'

export const RoomAmenities: CollectionConfig = {
  slug: 'room-amenities',
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
