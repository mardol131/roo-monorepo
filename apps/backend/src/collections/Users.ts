import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'
import { getPhoneField } from './common-fields/phone'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24, // 1 day
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    getPhoneField(false),
    {
      name: 'type',
      type: 'select',
      options: ['user', 'company'],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'required'
        }
        return true
      },
    },
    {
      name: 'termsOfUseConsent',
      type: 'checkbox',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'required'
        }
        return true
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
    },
  ],
}
