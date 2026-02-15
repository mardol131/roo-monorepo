import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'

import { Users } from './collections/Users'

import { sendEmailTask } from './jobs/tasks/sendEmailTask'

import { sendPushNotificationTask } from './jobs/tasks/sendPushNotification'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const getQueueName = (name: 'monthlyNotificationsQueue') => {
  return name
}

export default buildConfig({
  jobs: {
    shouldAutoRun: () => true,
    autoRun: [
      {
        cron: process.env.CRON_MONTHLY_NOTIFICATION_QUEUE || '0 16 * * *',
        queue: getQueueName('monthlyNotificationsQueue'),
      },
    ],
    tasks: [sendEmailTask, sendPushNotificationTask],
    workflows: [],
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  plugins: [],
  cors: [
    'http://localhost:3000/',
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://osvc365.cz',
    'https://www.osvc365.cz',
  ],
})
