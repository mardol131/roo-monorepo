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
    verify: {
      generateEmailHTML: ({ req, token }) => {
        const redirectTo = req.data?.redirectTo as string | undefined
        const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
        const url = new URL(`${baseUrl}/user-verification`)
        url.searchParams.set('emailVerificationToken', token)
        if (redirectTo) url.searchParams.set('redirectTo', redirectTo)
        console.log(req.data)
        console.log(url.toString())

        return `
          <p>Potvrďte svůj účet kliknutím na odkaz níže:</p>
          <a href="${url.toString()}">Ověřit účet</a>
          <p>Odkaz je platný 24 hodin.</p>
        `
      },
    },
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
      name: 'roles',
      type: 'select',
      options: ['user', 'company'],
      defaultValue: 'user',
      hasMany: true,
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
    {
      name: 'loginToken',
      type: 'text',
      admin: {
        disabled: true,
      },
    },
    {
      name: 'loginTokenExpiration',
      type: 'date',
      admin: {
        disabled: true,
      },
    },
  ],
}
