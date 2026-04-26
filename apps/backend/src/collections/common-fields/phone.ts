import { Field } from 'payload'

export function getPhoneField(required = false): Field {
  return {
    name: 'phone',
    type: 'group',
    required,
    fields: [
      {
        name: 'countryCode',
        type: 'select',
        options: ['420'],
        required,
      },

      {
        name: 'number',
        type: 'text',
        required,
      },
    ],
  }
}
