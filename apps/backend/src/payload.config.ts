import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { sendEmailTask } from './jobs/tasks/sendEmailTask'

import { sendPushNotificationTask } from './jobs/tasks/sendPushNotification'
import { VenueVariants } from './collections/variants/venue-variants'
import { Activities } from './collections/filters/activities'
import { Services } from './collections/filters/services'
import { EventTypes } from './collections/filters/event-types'
import { VenueListings } from './collections/listings/venue-listings'
import { Spaces } from './collections/spaces'
import { Personnel } from './collections/filters/personnel'
import { Companies } from './collections/companies'
import { Cities } from './collections/locality/cities'
import { Users } from './collections/users'
import { Media } from './collections/media'
import { PlaceTypes } from './collections/filters/place-types'
import { Rules } from './collections/specific/rules'
import { Technologies } from './collections/filters/technologies'
import { Amenities } from './collections/filters/amenities'
import { RoomAmenities } from './collections/specific/room-amenities'
import { FoodTypes } from './collections/filters/food-types'
import { Events } from './collections/events'
import { Inquiries } from './collections/inquiries'
import { ChatMessages } from './collections/chat-messages'
import { GastroListings } from './collections/listings/gastro-listings'
import { EntertainmentListings } from './collections/listings/entertainment-listings'
import { GastroVariants } from './collections/variants/gastro-variants'
import { EntertainmentVariants } from './collections/variants/entertainment-variants'
import { Admins } from './collections/admins'

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
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Admins,
    Media,
    VenueVariants,
    GastroVariants,
    EntertainmentVariants,
    Activities,
    Services,
    EventTypes,
    VenueListings,
    GastroListings,
    EntertainmentListings,
    Spaces,
    Personnel,
    Companies,
    Cities,
    PlaceTypes,
    Rules,
    Technologies,
    Amenities,
    RoomAmenities,
    FoodTypes,
    Events,
    ChatMessages,
    Inquiries,
  ],
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
