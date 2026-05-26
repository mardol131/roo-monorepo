import type { CollectionBeforeValidateHook } from 'payload'
import { slugify } from '@roo/common'

export const generateSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  if (!data.slug) {
    data.slug = slugify(data.name, true)
  }
}
