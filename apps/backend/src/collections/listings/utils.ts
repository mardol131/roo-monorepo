import { Access, Where } from 'payload'
import { getIdFromRelationshipField } from '@roo/common'
import { CollectionAccess } from '../common/utils'
import { Company } from '@/payload-types'

export const listingTypes = {
  venue: 'venue',
  gastro: 'gastro',
  entertainment: 'entertainment',
}
