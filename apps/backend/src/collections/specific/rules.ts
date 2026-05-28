import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'
import { getFiltersFields } from '../common/filters-fields'
import { filtersAccess } from '../common/access'

export const Rules: CollectionConfig = {
  slug: 'rules',
  admin: {
    useAsTitle: 'name',
  },
  access: filtersAccess,
  fields: getFiltersFields({ types: ['gastro', 'venue', 'entertainment'] }),
}
