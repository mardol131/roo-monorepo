import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { sendEmailTask } from './jobs/tasks/sendEmailTask'

import { sendPushNotificationTask } from './jobs/tasks/sendPushNotification'
import { Variants } from './collections/variants/variants'
import { Activities } from './collections/filters/activities'
import { Services } from './collections/filters/services'
import { EventTypes } from './collections/filters/event-types'
import { Listings } from './collections/listings/listings'
import { Spaces } from './collections/spaces'
import { Personnel } from './collections/filters/personnel'
import { Companies } from './collections/companies/companies'
import { Cities } from './collections/locality/cities'

import { PlaceTypes } from './collections/filters/place-types'
import { Rules } from './collections/specific/rules'
import { Technologies } from './collections/filters/technologies'
import { Amenities } from './collections/filters/amenities'
import { RoomAmenities } from './collections/specific/room-amenities'
import { Cuisines } from './collections/filters/cuisines'
import { Events } from './collections/events'
import { Inquiries } from './collections/inquiries'
import { ChatMessages } from './collections/chat-messages'
import { Admins } from './collections/admins'
import { Districts } from './collections/locality/districts'
import { Regions } from './collections/locality/regions'
import { DishTypes } from './collections/filters/dish-types'
import { Necessities } from './collections/specific/necessities'
import { EntertainmentTypes } from './collections/filters/entertainment-types'
import { DietaryOptions } from './collections/filters/dietary-options'
import { FoodServiceStyle } from './collections/filters/food-service-style'
import { CalendarEvents } from './collections/calendar-events'
import { FavouriteListings } from './collections/favourite-listings'
import { Invitations } from './collections/invitations'

import { SpaceTypes } from './collections/specific/space-types'
import { uploadFileToCloud } from './endpoints/upload-file-to-cloud/upload-file-to-cloud'
import { Users } from './collections/users'
import { Media } from './collections/media'
import { ListingEntertainmentDetails } from './collections/listings/listing-entertainment-details'
import { ListingGastroDetails } from './collections/listings/listing-gastro-details'
import { ListingVenueDetails } from './collections/listings/listing-venue-details'
import { getFiltersAndSpecifics } from './endpoints/get-filters-and-specific/get-filters-and-specifics'

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
    Districts,
    Necessities,
    EntertainmentTypes,
    DietaryOptions,
    FoodServiceStyle,
    Regions,
    DishTypes,
    Users,
    Admins,
    Media,
    Variants,
    Activities,
    Services,
    EventTypes,
    Listings,
    Spaces,
    Personnel,
    Companies,
    Cities,
    PlaceTypes,
    Rules,
    Technologies,
    Amenities,
    RoomAmenities,
    Cuisines,
    Events,
    ChatMessages,
    Inquiries,
    CalendarEvents,
    FavouriteListings,
    Invitations,
    SpaceTypes,
    ListingEntertainmentDetails,
    ListingGastroDetails,
    ListingVenueDetails,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  endpoints: [uploadFileToCloud, getFiltersAndSpecifics],
  plugins: [],
  cors: ['http://localhost:3000', process.env.NEXT_PUBLIC_WEBSITE_URL || ''],
  csrf: ['http://localhost:3000', process.env.NEXT_PUBLIC_WEBSITE_URL || ''],
})
