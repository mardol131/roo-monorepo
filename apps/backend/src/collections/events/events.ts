import type { CollectionConfig } from 'payload'
import { eventsAccessControl } from './access'
import { eventsFields } from './fields'
import { setOwnerOnCreate } from './hooks/set-owner-on-create'
import { restrictEventFieldsForMembers } from './hooks/restrict-fields-for-members'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
  },
  access: eventsAccessControl,
  hooks: {
    beforeChange: [setOwnerOnCreate],
    afterRead: [restrictEventFieldsForMembers],
  },
  fields: eventsFields,
}
