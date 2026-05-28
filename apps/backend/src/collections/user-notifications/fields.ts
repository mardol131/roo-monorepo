import type { Field, FieldAccess } from 'payload'

const adminOnly: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const userNotificationFields: Field[] = [
  {
    name: 'user',
    type: 'relationship',
    relationTo: 'users',
    required: true,
    index: true,
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'type',
    type: 'select',
    required: true,
    options: [
      { label: 'Obecné', value: 'general' },
      { label: 'Poptávka', value: 'inquiry' },
      { label: 'Událost', value: 'event' },
      { label: 'Systém', value: 'system' },
    ],
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'heading',
    type: 'text',
    required: true,
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'text',
    type: 'text',
    required: true,
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'link',
    type: 'text',
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'seen',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'seenAt',
    type: 'date',
    admin: {
      date: { pickerAppearance: 'dayAndTime' },
    },
    access: { create: adminOnly, update: adminOnly },
  },
  {
    name: 'clicked',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'clickedAt',
    type: 'date',
    admin: {
      date: { pickerAppearance: 'dayAndTime' },
    },
    access: { create: adminOnly, update: adminOnly },
  },
]
