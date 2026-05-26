import type { CollectionConfig } from 'payload'
import { commonListingDetailFields, customSectionsFields } from './fields'
import { listingDetailAccessControl } from './access'

export const ListingGastroDetails: CollectionConfig = {
  slug: 'listing-gastro-details',
  access: listingDetailAccessControl,
  fields: [
    ...customSectionsFields,
    ...commonListingDetailFields,
    {
      name: 'type',
      type: 'select',
      options: ['gastro'],
      required: true,
      defaultValue: 'gastro',
    },
    {
      name: 'hasAlcoholLicense',
      type: 'checkbox',
    },
    {
      name: 'kidsMenu',
      type: 'checkbox',
    },
  ],
}
