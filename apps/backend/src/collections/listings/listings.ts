import type { CollectionConfig } from 'payload'
import { listingFields } from './fields'
import { generateSlug } from './hooks/generate-slug'
import { syncSpacesOnDetailTypeChange } from './hooks/sync-spaces-on-detail-type-change'
import { cascadeStatusChange } from './hooks/cascade-status-change'
import { listingAccessControl } from './access'

export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'name',
  },
  access: listingAccessControl,
  fields: listingFields,
  hooks: {
    beforeValidate: [generateSlug],
    afterChange: [syncSpacesOnDetailTypeChange, cascadeStatusChange],
  },
}
