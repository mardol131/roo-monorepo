import type { CollectionBeforeChangeHook } from 'payload'

export const setOwnerOnCreate: CollectionBeforeChangeHook = ({ req, operation }) => {
  if (operation !== 'create') return
  if (!req.user || !req.data) return
  req.data.owner = req.user.id
}
