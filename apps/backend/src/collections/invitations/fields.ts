import type { Field } from 'payload'
import { memberRoleField } from '../common/member-permissions'

export const invitationsFields: Field[] = [
  {
    name: 'token',
    type: 'text',
    required: true,
    unique: true,
    admin: { readOnly: true },
  },
  {
    name: 'email',
    type: 'email',
    required: true,
  },
  {
    name: 'company',
    type: 'relationship',
    relationTo: 'companies',
    required: true,
  },
  memberRoleField,
  {
    name: 'status',
    type: 'select',
    options: ['pending', 'accepted', 'cancelled'],
    defaultValue: 'pending',
    required: true,
  },
  {
    name: 'invitedBy',
    type: 'relationship',
    relationTo: 'users',
    required: true,
  },
]
