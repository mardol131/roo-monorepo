import { Access } from 'payload'

export type CollectionAccess = {
  read: Access
  create: Access
  update: Access
  delete: Access
}
