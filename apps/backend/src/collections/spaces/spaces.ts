import type { CollectionConfig } from 'payload'
import { spacesFields } from './fields'
import { spacesAccess } from './access'
import { cascadeStatusToChildren } from './hooks/cascade-status-to-children'
import { syncListingFromSpaces, syncListingFromSpacesOnDelete } from './hooks/sync-listing-from-spaces'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  admin: {
    useAsTitle: 'name',
  },
  access: spacesAccess,
  fields: spacesFields,
  hooks: {
    afterChange: [cascadeStatusToChildren, syncListingFromSpaces],
    afterDelete: [syncListingFromSpacesOnDelete],
  },
}
