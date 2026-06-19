import { Field } from 'payload'
import { memberRoleField } from '../common/member-permissions'
import { isCompanyMemberOrOwner } from './access'
import { getPhoneField } from '../common/phone'
import { getMediaFields } from '../common/common-fields'
import { getRecordStatuses } from '@roo/common'

export const companyFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    access: {
      update: ({ req }) => req.user?.collection === 'admins',
    },
  },
  {
    name: 'status',
    type: 'select',
    options: getRecordStatuses(['active', 'archived', 'disabled']),
    defaultValue: 'active',
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
    type: 'group',
    fields: getMediaFields(),
    required: true,
  },
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
  {
    name: 'owner',
    type: 'relationship',
    relationTo: 'users',
    required: true,
    defaultValue: ({ user }) => user?.id,
    access: {
      update: ({ req }) => req.user?.collection === 'admins',
    },
  },
  {
    name: 'billingAddress',
    type: 'group',
    required: true,
    access: {
      read: isCompanyMemberOrOwner,
    },
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
  {
    name: 'vatId',
    type: 'text',
  },
  {
    name: 'members',
    type: 'array',
    fields: [
      {
        name: 'user',
        type: 'relationship',
        relationTo: 'users',
        required: true,
      },
      {
        name: 'invitationEmail',
        type: 'email',
        required: true,
      },
      memberRoleField,
    ],
  },
  {
    name: 'stripeCustomerId',
    type: 'text',
    admin: {
      description: 'Stripe Customer ID (cus_...)',
      readOnly: true,
    },
    access: {
      update: ({ req }) => req.user?.collection === 'admins',
    },
  },
]
