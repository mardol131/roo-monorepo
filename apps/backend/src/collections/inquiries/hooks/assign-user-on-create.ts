import type { CollectionBeforeChangeHook } from 'payload'

export const assignUserOnCreate: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  if (operation !== 'create') return data
  if (!data || !req.user) return data

  data.user = req.user.id
  return data
}
