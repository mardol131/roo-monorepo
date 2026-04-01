import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    // Základní informace
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'ico',
      type: 'text',
      required: true,
      unique: true,
      minLength: 8,
      maxLength: 8,
      admin: { description: 'IČO — 8 číslic' },
    },
    {
      name: 'description',
      type: 'textarea',
    },

    // Kontaktní údaje
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },

    // Vazba na uživatele (vlastník účtu)
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
