import { getCompanyMemberRole } from '@roo/common'
import type { SelectField } from 'payload'

export const memberRoleField: SelectField = {
  name: 'role',
  type: 'select',
  required: true,
  defaultValue: 'editor',
  options: getCompanyMemberRole(['admin', 'manager', 'editor']),
}
