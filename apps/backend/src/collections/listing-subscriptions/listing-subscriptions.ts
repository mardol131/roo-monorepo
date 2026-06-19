import type { CollectionConfig } from 'payload'
import { listingSubscriptionFields } from './fields'
import { listingSubscriptionAccessControl } from './access'
import { setValidUntil } from './hooks/before-change'
import { syncListingOnPayment } from './hooks/after-change'

export const ListingSubscriptions: CollectionConfig = {
  slug: 'listing-subscriptions',
  admin: {
    useAsTitle: 'stripeSubscriptionId',
  },
  access: listingSubscriptionAccessControl,
  fields: listingSubscriptionFields,
  hooks: {
    beforeChange: [setValidUntil],
    afterChange: [syncListingOnPayment],
  },
}
