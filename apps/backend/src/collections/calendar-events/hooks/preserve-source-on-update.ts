import type { CollectionBeforeChangeHook } from 'payload'

export const preserveSourceOnUpdate: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) => {
  if (originalDoc?.source && operation === 'update') {
    data.source = originalDoc.source
  }
  return data
}
