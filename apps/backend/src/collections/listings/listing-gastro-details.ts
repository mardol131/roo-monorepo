import type { CollectionConfig } from 'payload'
import {
  commonListingDetailFields,
  customSectionsFields,
  listingDetailAccessControl,
} from './utils'

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
