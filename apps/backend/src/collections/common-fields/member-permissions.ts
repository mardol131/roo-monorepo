import type { SelectField } from 'payload'

export const memberRoleField: SelectField = {
  name: 'role',
  type: 'select',
  required: true,
  defaultValue: 'editor',
  options: [
    { label: 'Editor', value: 'editor' },
    { label: 'Správce', value: 'manager' },
  ],
}
