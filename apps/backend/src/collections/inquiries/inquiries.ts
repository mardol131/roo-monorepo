import type { CollectionConfig } from 'payload'
import { inquiryFields } from './fields'
import { assignUserOnCreate } from './hooks/assign-user-on-create'
import { snapshotOnConfirmation } from './hooks/snapshot-on-confirmation'
import { inquiryAccess } from './access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'id',
  },
  access: inquiryAccess,
  hooks: {
    beforeChange: [assignUserOnCreate, snapshotOnConfirmation],
  },
  fields: inquiryFields,
}
