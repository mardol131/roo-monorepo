import type { CollectionConfig } from 'payload'
import { usersAccessControl } from './access'
import { confirmNewEmailEndpoint } from './endpoints/confirm-new-email'
import { verifyNewEmailEndpoint } from './endpoints/verify-new-email'
import { oauthEndpoint } from './endpoints/oauth/oauth'
import { usersFields } from './fields'
import { sendAccountVerificationEmail } from './utils/send-account-verification-email'
import { sendPasswordChangeEmail } from './utils/send-password-change-email'
import { magicLinkLoginEndpoint } from './endpoints/magic-link-login/magic-link-login'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },

  auth: {
    tokenExpiration: 60 * 60 * 24, // 1 day
    verify: {
      generateEmailHTML: sendAccountVerificationEmail,
    },
    forgotPassword: {
      generateEmailHTML: sendPasswordChangeEmail,
    },
  },
  access: usersAccessControl,
  fields: usersFields,
  endpoints: [
    verifyNewEmailEndpoint,
    confirmNewEmailEndpoint,
    oauthEndpoint,
    ...magicLinkLoginEndpoint,
  ],
}
