import { adminOrApiKeyAuth } from '@/functions/ACL'
import { CollectionAccess } from './utils'

export const filtersAccess: CollectionAccess = {
  read: () => true,
  update: ({ req }) => adminOrApiKeyAuth(req),
  create: ({ req }) => adminOrApiKeyAuth(req),
  delete: ({ req }) => adminOrApiKeyAuth(req),
}
