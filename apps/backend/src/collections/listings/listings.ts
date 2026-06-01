import type { CollectionConfig } from 'payload'
import { listingFields } from './fields'
import { generateSlug } from './hooks/generate-slug'
import { clearVariantSpacesOnSpacesTypeChange } from './hooks/clear-variant-spaces-on-spaces-type-change'
import { cascadeStatusChange } from './hooks/cascade-status-change'
import { listingAccessControl } from './access'
import { getMapPins } from './endpoints/get-map-pins/get-map-pins'
import { getCalendarAvailability } from './endpoints/calendar-availability/calendar-availability'

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
  endpoints: [getMapPins, getCalendarAvailability],
}
