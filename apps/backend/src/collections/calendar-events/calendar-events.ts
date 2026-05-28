import type { CollectionConfig } from 'payload'
import { calendarEventsAccessControl } from './access'
import { calendarEventsFields } from './fields'
import { preserveSourceOnUpdate } from './hooks/preserve-source-on-update'

export const CalendarEvents: CollectionConfig = {
  slug: 'calendar-events',
  admin: {
    useAsTitle: 'name',
  },
  access: calendarEventsAccessControl,
  hooks: {
    beforeChange: [preserveSourceOnUpdate],
  },
  fields: calendarEventsFields,
}
