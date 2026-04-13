import type { CollectionConfig } from 'payload'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
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
      name: 'type',
      type: 'select',
      required: true,
      options: ['area', 'building', 'room'],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: false,
    },
    {
      name: 'listing',
      type: 'relationship',
      relationTo: 'listings',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'capacity',
      type: 'number',
      admin: { description: 'Maximální kapacita osob' },
    },
    {
      name: 'area',
      type: 'number',
      admin: { description: 'Plocha v m²' },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'hasAccommodation',
      type: 'checkbox',
      admin: { description: 'Indikuje, zda prostor nabízí ubytování' },
    },
    {
      name: 'accommodationCapacity',
      type: 'number',
      admin: { description: 'Kapacita ubytování (počet lůžek)' },
    },
    {
      name: 'rooms',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'capacity',
          type: 'number',
          required: true,
        },
        {
          name: 'countOfRoomsOfThisType',
          type: 'number',
          required: true,
        },
        {
          name: 'amenities',
          type: 'relationship',
          relationTo: 'room-amenities',
          hasMany: true,
        },
      ],
    },
    {
      name: 'spaceRules',
      type: 'relationship',
      relationTo: 'rules',
      hasMany: true,
    },
  ],
}
