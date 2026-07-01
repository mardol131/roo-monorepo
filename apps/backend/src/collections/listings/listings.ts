import type { CollectionConfig } from 'payload'
import { listingFields } from './fields'
import { generateSlug } from './hooks/generate-slug'
import { cascadeStatusChange } from './hooks/cascade-status-change'
import { listingAccessControl } from './access'
import { getMapPins } from './endpoints/get-map-pins/get-map-pins'
import { getCalendarAvailability } from './endpoints/calendar-availability/calendar-availability'
import { getListingsAvailability } from './endpoints/get-listings-availability/get-listings-availability'
import { geoSearch } from './endpoints/geo-search/geo-search'

export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'name',
  },
  access: listingAccessControl,
  fields: listingFields,
  hooks: {
    beforeValidate: [generateSlug],
    afterChange: [cascadeStatusChange],
  },
  endpoints: [getMapPins, getCalendarAvailability, getListingsAvailability, geoSearch],
}
