import type { CollectionConfig } from 'payload'
import { userNotificationFields } from './fields'
import { userNotificationAccess } from './access'
import { setTimestamps } from './hooks/set-timestamps'

export const UserNotifications: CollectionConfig = {
  slug: 'user-notifications',
  admin: {
    useAsTitle: 'heading',
  },
  access: userNotificationAccess,
  hooks: {
    beforeChange: [setTimestamps],
  },
  fields: userNotificationFields,
}
