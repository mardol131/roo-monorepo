import type { CollectionConfig } from 'payload'
import { companyAccess } from './access'
import { membersInviteEndpoint } from './endpoints/members/invite'
import { verifyMemberEndpoint } from './endpoints/members/verify'
import { companyFields } from './fields'
import { stripForPublic } from './hooks/after-read'
import { cleanupLogo } from './hooks/before-change'
import { generateSlug } from './hooks/before-validate'

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
  },
  fields: companyFields,
}
