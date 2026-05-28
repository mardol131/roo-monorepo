import type { CollectionConfig } from 'payload'
import { variantsAccessControl } from './access'
import { variantFields } from './fields'
import { cancelPendingInquiriesOnDeactivation } from './hooks/cancel-pending-inquiries-on-deactivation'

export const Variants: CollectionConfig = {
  slug: 'variants',
  access: variantsAccessControl,
  hooks: {
    afterChange: [cancelPendingInquiriesOnDeactivation],
  },
  fields: variantFields,
}
