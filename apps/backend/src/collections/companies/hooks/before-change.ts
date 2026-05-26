import type { CollectionBeforeChangeHook } from 'payload'

export const cleanupLogo: CollectionBeforeChangeHook = async ({ data }) => {
  if (data.logo.filename === '') {
    delete data.logo
  }

  return data
}
