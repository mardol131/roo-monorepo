import type { CollectionConfig } from 'payload'
import { usersAccessControl } from './access'
import { usersFields } from './fields'
import { generateVerificationEmail } from './hooks/generate-verification-email'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24, // 1 day
    verify: {
      generateEmailHTML: generateVerificationEmail,
    },
  },
  access: usersAccessControl,
  fields: usersFields,
}
