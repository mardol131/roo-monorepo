import type { CollectionConfig } from 'payload'
import { getPhoneField } from './common-fields/phone'

export const Companies: CollectionConfig = {
  slug: 'companies',
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
    getPhoneField(true),
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
