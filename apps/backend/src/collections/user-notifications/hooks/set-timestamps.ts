import type { CollectionBeforeChangeHook } from 'payload'

export const setTimestamps: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (data.seen && !originalDoc?.seen) {
    data.seenAt = new Date().toISOString()
  }

  if (data.clicked && !originalDoc?.clicked) {
    data.clickedAt = new Date().toISOString()
  }

  return data
}
