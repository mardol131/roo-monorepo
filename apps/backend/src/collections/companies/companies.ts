import type { CollectionConfig, Where } from 'payload'
import { getPhoneField } from '../common/phone'
import { getRecordStatuses } from '@roo/common'
import { getMediaFields } from '../common/common-fields'
import { memberRoleField } from '../common/member-permissions'
import { membersInviteEndpoint } from './endpoints/members/invite'
import { verifyMemberEndpoint } from './endpoints/members/verify'
import { companyAccess, isCompanyMemberOrOwner } from './access'
import { generateSlug } from './hooks/before-validate'
import { cleanupLogo } from './hooks/before-change'
import { stripForPublic } from './hooks/after-read'
import { companyFields } from './fields'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  endpoints: [membersInviteEndpoint, verifyMemberEndpoint],
  access: companyAccess,
  hooks: {
    beforeValidate: [generateSlug],
    beforeChange: [cleanupLogo],
    afterRead: [stripForPublic],
  },
  fields: companyFields,
}
