import type { CollectionConfig } from 'payload'
import { chatMessagesAccessControl } from './access'
import { chatMessagesFields } from './fields'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  admin: {
    useAsTitle: 'id',
  },
  access: chatMessagesAccessControl,
  fields: chatMessagesFields,
}
