import { Field } from 'payload'
import { COUNTRY_CODES } from '@roo/common'

export function getPhoneField(required = false): Field {
  return {
    name: 'phone',
    type: 'group',
    required,
    fields: [
      {
        name: 'countryCode',
        type: 'select',
        options: COUNTRY_CODES,
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
