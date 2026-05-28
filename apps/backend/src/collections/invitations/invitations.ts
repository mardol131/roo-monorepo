import type { CollectionConfig } from 'payload'
import { invitationsAccessControl } from './access'
import { invitationsFields } from './fields'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {
    useAsTitle: 'email',
  },
  access: invitationsAccessControl,
  fields: invitationsFields,
}
