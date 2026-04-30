import type { CollectionConfig } from 'payload'
import { getPhoneField } from './common-fields/phone'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => {
      console.log('THIS IS IT')
      console.log('Create company access check, user:', req.user)
      return !!req.user
    },
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.collection === 'admins',
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
    {
      name: 'logo',
      type: 'text',
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
      defaultValue: ({ user }) => user?.id,
    },

    //Fakturační údaje
    {
      name: 'billingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },

    // Daně a účetnictví

    {
      name: 'vatId',
      type: 'text',
    },

    // Collaboration fields
    {
      name: 'collaborators',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'permissions',
          type: 'group',
          required: true,
          fields: [
            {
              name: 'companies',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Vytvářet', value: 'create' },
                { label: 'Upravovat', value: 'edit' },
                { label: 'Mazat', value: 'delete' },
              ],
            },
            {
              name: 'listings',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Vytvářet', value: 'create' },
                { label: 'Upravovat', value: 'edit' },
                { label: 'Mazat', value: 'delete' },
                { label: 'Aktivovat katalog', value: 'activateCatalog' },
                { label: 'Deaktivovat katalog', value: 'deactivateCatalog' },
              ],
            },
            {
              name: 'inquiries',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Označit jako přijaté', value: 'accept' },
                { label: 'Mazat', value: 'delete' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
