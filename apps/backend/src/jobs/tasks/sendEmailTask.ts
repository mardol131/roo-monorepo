import { sendEmail } from '@test/email-builder'

import { Field, TaskConfig } from 'payload'

const sendEmailInputSchema: Field[] = [
  {
    name: 'email',
    type: 'text',
    required: true,
  },
  {
    name: 'body',
    type: 'textarea',
    required: true,
  },
  {
    name: 'subject',
    type: 'text',
    required: true,
  },
]

export const sendEmailTask: TaskConfig<any> = {
  retries: 3,
  slug: 'sendEmail',
  inputSchema: sendEmailInputSchema,
  handler: async ({ input }) => {
    try {
      const res = await sendEmail(
        'OSVČ365 <info@osvc365.cz>',
        [input.email],
        input.subject,
        input.body,
      )
    } catch (error) {
      console.error(`Error sending monthly notification to ${input.email}:`, error)
      throw error
    }
    return {
      output: {
        success: true,
      },
    }
  },
}
