import type { CollectionConfig } from 'payload'
import {
  commonListingDetailFields,
  customSectionsFields,
  listingDetailAccessControl,
} from './utils'

export const ListingEntertainmentDetails: CollectionConfig = {
  slug: 'listing-entertainment-details',
  access: listingDetailAccessControl,
  fields: [
    ...customSectionsFields,
    ...commonListingDetailFields,
    {
      name: 'type',
      type: 'select',
      options: ['entertainment'],
      required: true,
      defaultValue: 'entertainment',
    },
    {
      name: 'audience',
      type: 'select',
      hasMany: true,
      options: ['adults', 'kids', 'seniors'],
    },
    {
      name: 'setupAndTearDownRules',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'setupTime',
          type: 'number',
        },
        {
          name: 'tearDownTime',
          type: 'number',
        },
      ],
    },
  ],
}
