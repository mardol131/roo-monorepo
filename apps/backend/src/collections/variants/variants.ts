import type { CollectionConfig } from 'payload'
import { variantsAccessControl } from './access'
import { variantFields } from './fields'
import { cancelPendingInquiriesOnDeactivation } from './hooks/cancel-pending-inquiries-on-deactivation'
import { syncListingVariantPrice, syncListingVariantPriceOnDelete } from './hooks/sync-listing-variant-price'

export const Variants: CollectionConfig = {
  slug: 'variants',
  access: variantsAccessControl,
  hooks: {
    afterChange: [cancelPendingInquiriesOnDeactivation, syncListingVariantPrice],
    afterDelete: [syncListingVariantPriceOnDelete],
  },
  fields: variantFields,
}
