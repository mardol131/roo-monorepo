import type { CollectionBeforeChangeHook } from 'payload'

export const setValidUntil: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation !== 'update') return data
  if (data.status !== 'paid' || data.validUntil) return data

  const validUntil = new Date()
  validUntil.setFullYear(validUntil.getFullYear() + 1)
  data.validUntil = validUntil.toISOString()

  return data
}
