import type { Field } from 'payload'
import { getPhoneField } from '../common/phone'

export const usersFields: Field[] = [
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
      if (!value) return 'required'
      return true
    },
  },
  {
    name: 'termsOfUseConsent',
    type: 'checkbox',
    required: true,
    validate: (value) => {
      if (!value) return 'required'
      return true
    },
  },
  {
    name: 'lastRoadmapVoteAt',
    type: 'date',
  },
  {
    name: 'marketingConsent',
    type: 'checkbox',
  },
  {
    name: 'loginToken',
    type: 'text',
    admin: { disabled: true },
  },
  {
    name: 'loginTokenExpiration',
    type: 'date',
    admin: { disabled: true },
  },
  {
    name: 'emailVerificationToken',
    type: 'text',
    admin: { disabled: true },
  },
  {
    name: 'emailVerificationTokenExpiration',
    type: 'date',
    admin: { disabled: true },
  },
  {
    name: 'pendingEmail',
    type: 'text',
    admin: { disabled: true },
  },
]
