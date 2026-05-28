import { adminOrApiKeyAuth } from '@/functions/ACL'
import type { CollectionConfig } from 'payload'
import { getFiltersFields } from '../common/filters-fields'
import { filtersAccess } from '../common/access'

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'name',
  },
  access: filtersAccess,
  fields: getFiltersFields({}),
}
