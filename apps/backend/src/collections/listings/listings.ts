import type { CollectionConfig } from 'payload'
import { listingFields } from './fields'
import { generateSlug } from './hooks/generate-slug'
import { clearVariantSpacesOnSpacesTypeChange } from './hooks/clear-variant-spaces-on-spaces-type-change'
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
    afterChange: [clearVariantSpacesOnSpacesTypeChange, cascadeStatusChange],
  },
}
