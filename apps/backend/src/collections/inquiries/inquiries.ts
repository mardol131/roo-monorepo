import type { CollectionConfig } from 'payload'
import { inquiryFields } from './fields'
import { assignUserOnCreate } from './hooks/assign-user-on-create'
import { snapshotOnConfirmation } from './hooks/snapshot-on-confirmation'
import { validateCompanyConfirmation } from './hooks/validate-company-confirmation'
import { inquiryAccess } from './access'
import { getAcceptedInquiriesOnEventEndpoint } from './endpoints/get-accepted-inquiries-on-event'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'id',
  },
  access: inquiryAccess,
  endpoints: [getAcceptedInquiriesOnEventEndpoint],
  hooks: {
    beforeChange: [assignUserOnCreate, validateCompanyConfirmation, snapshotOnConfirmation],
  },
  fields: inquiryFields,
}
