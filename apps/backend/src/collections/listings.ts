import type { CollectionConfig, Field } from 'payload'
import { listingsCommonFields } from './common-fields/common-fields'
import { slugify } from '@roo/common'

export const venueListingDetails: Field[] = [
  {
    name: 'location',
    type: 'group',
    fields: [
      {
        name: 'address',
        type: 'text',
        required: true,
      },
      {
        name: 'city',
        type: 'relationship',
        relationTo: 'cities',
        required: true,
      },
      {
        name: 'latitude',
        type: 'number',
      },
      {
        name: 'longitude',
        type: 'number',
      },
    ],
  },
  {
    name: 'placeTypes',
    type: 'relationship',
    relationTo: 'place-types',
    hasMany: true,
  },
  {
    name: 'spacesType',
    type: 'select',
    options: ['area', 'building', 'room'],
    required: true,
  },
  {
    name: 'capacity',
    type: 'number',
    required: true,
  },
  {
    name: 'area',
    type: 'number',
    required: true,
  },
  {
    name: 'canBeBookedAsWhole',
    type: 'checkbox',
  },
  {
    name: 'hasAccommodation',
    type: 'checkbox',
  },
  {
    name: 'accommodationCapacity',
    type: 'number',
  },
  {
    name: 'foodAndDrinkRules',
    type: 'relationship',
    relationTo: 'rules',
    hasMany: true,
  },
  {
    name: 'venueRules',
    type: 'relationship',
    relationTo: 'rules',
    hasMany: true,
  },
  {
    name: 'services',
    type: 'relationship',
    relationTo: 'services',
    hasMany: true,
  },
  {
    name: 'technology',
    type: 'relationship',
    relationTo: 'technologies',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
  },
  {
    name: 'amenities',
    type: 'relationship',
    relationTo: 'amenities',
    hasMany: true,
  },
  {
    name: 'activities',
    type: 'relationship',
    relationTo: 'activities',
    hasMany: true,
  },
  {
    name: 'access',
    type: 'group',
    fields: [
      {
        name: 'vehicleTypes',
        type: 'select',
        options: ['car', 'truck', 'van', 'bus'],
        hasMany: true,
      },
      {
        name: 'helpWithLoadingAndUnloading',
        type: 'checkbox',
      },
      {
        name: 'loadingRamp',
        type: 'checkbox',
      },
      {
        name: 'loadingElevator',
        type: 'checkbox',
      },
      {
        name: 'serviceAccess',
        type: 'checkbox',
      },
      {
        name: 'serviceArea',
        type: 'checkbox',
      },
    ],
  },
  {
    name: 'storage',
    type: 'array',
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'area',
        type: 'number',
        required: true,
      },
      {
        name: 'space',
        type: 'relationship',
        relationTo: 'spaces',
      },
      {
        name: 'accessedFrom',
        type: 'relationship',
        relationTo: 'spaces',
      },
    ],
  },
  {
    name: 'parking',
    type: 'group',
    fields: [
      {
        name: 'hasParking',
        type: 'checkbox',
      },
      {
        name: 'parkingCapacity',
        type: 'number',
      },
      {
        name: 'parkingIsIncludedInPrice',
        type: 'checkbox',
      },
      {
        name: 'parkingPrice',
        type: 'number',
      },
    ],
  },
  {
    name: 'activityAddons',
    type: 'array',
    fields: [
      {
        name: 'activity',
        type: 'relationship',
        relationTo: 'activities',
        required: true,
      },
      {
        name: 'price',
        type: 'number',
        required: true,
      },
      {
        name: 'space',
        type: 'relationship',
        relationTo: 'spaces',
      },
      {
        name: 'type',
        type: 'select',
        options: ['indoor', 'outdoor'],
        required: true,
      },
    ],
  },
  {
    name: 'breakfast',
    type: 'group',
    fields: [
      {
        name: 'included',
        type: 'checkbox',
      },
      {
        name: 'allowAccommodationWithoutBreakfast',
        type: 'checkbox',
      },
      {
        name: 'allowMoreBreakfastsThanAccommodation',
        type: 'checkbox',
      },
      {
        name: 'breakfastIsIncludedInPrice',
        type: 'checkbox',
      },
      {
        name: 'price',
        type: 'number',
      },
      {
        name: 'pricePer',
        type: 'select',
        options: ['person', 'booking'],
        defaultValue: 'person',
      },
      {
        name: 'timeFrom',
        type: 'text',
        admin: {
          description: 'Čas, od kterého je snídaně k dispozici (např. 07:00)',
        },
      },
      {
        name: 'timeTo',
        type: 'text',
        admin: {
          description: 'Čas, do kterého je snídaně k dispozici (např. 10:00)',
        },
      },
    ],
  },
]

type LocationSiblings = {
  municipality?: unknown[]
  region?: unknown[]
  city?: unknown[]
}

const validateAtLeastOneLocation = (
  value: string | null | undefined,
  { siblingData }: { siblingData: LocationSiblings },
): true | string => {
  const hasAny =
    value?.trim() ||
    siblingData.municipality?.length ||
    siblingData.region?.length ||
    siblingData.city?.length
  return hasAny ? true : 'Zadejte alespoň adresu, část obce, kraj nebo město'
}

const fullLocationFields: Field[] = [
  {
    name: 'location',
    type: 'group',
    fields: [
      {
        name: 'address',
        type: 'text',
        validate: validateAtLeastOneLocation,
      },
      {
        name: 'region',
        type: 'relationship',
        relationTo: 'regions',
        hasMany: true,
      },
      {
        name: 'district',
        type: 'relationship',
        relationTo: 'districts',
        hasMany: true,
      },
      {
        name: 'city',
        type: 'relationship',
        relationTo: 'cities',
        hasMany: true,
      },
    ],
  },
]

export const gastroListingDetails: Field[] = [
  ...fullLocationFields,
  {
    name: 'cuisines',
    type: 'relationship',
    relationTo: 'cuisines',
    hasMany: true,
  },
  {
    name: 'dishTypes',
    type: 'relationship',
    relationTo: 'dish-types',
    hasMany: true,
  },
  {
    name: 'dietaryOptions',
    type: 'relationship',
    relationTo: 'dietary-options',
    hasMany: true,
  },
  {
    name: 'foodServiceStyles',
    type: 'relationship',
    hasMany: true,
    relationTo: 'food-service-styles',
  },
  {
    name: 'hasAlcoholLicense',
    type: 'checkbox',
  },
  {
    name: 'capacity',
    type: 'number',
    required: true,
  },
  {
    name: 'minimumCapacity',
    type: 'number',
  },
  {
    name: 'kidsMenu',
    type: 'checkbox',
  },
  {
    name: 'foodAndDrinkRules',
    type: 'relationship',
    relationTo: 'rules',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
  },
  {
    name: 'necessities',
    type: 'relationship',
    relationTo: 'necessities',
    hasMany: true,
  },
]

export const entertainmentListingDetails: Field[] = [
  ...fullLocationFields,
  {
    name: 'entertainmentTypes',
    type: 'relationship',
    relationTo: 'entertainment-types',
    hasMany: true,
  },
  {
    name: 'capacity',
    type: 'number',
    required: true,
  },
  {
    name: 'minimumCapacity',
    type: 'number',
  },
  {
    name: 'audience',
    type: 'select',
    hasMany: true,
    options: ['adults', 'kids', 'seniors'],
  },
  {
    name: 'setupAndTearDownRules',
    type: 'group',
    fields: [
      {
        name: 'setupTime',
        type: 'number',
      },
      {
        name: 'tearDownTime',
        type: 'number',
      },
    ],
  },
  {
    name: 'rules',
    type: 'relationship',
    relationTo: 'rules',
    hasMany: true,
  },
  {
    name: 'personnel',
    type: 'relationship',
    relationTo: 'personnel',
    hasMany: true,
  },
  {
    name: 'necessities',
    type: 'relationship',
    relationTo: 'necessities',
    hasMany: true,
  },
]

export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => {
      return !!req.user
    },
    read: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'admins') return true
      return { 'company.owner': { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    ...listingsCommonFields,
    {
      name: 'details',
      type: 'blocks',
      maxRows: 1,
      required: true,
      blocks: [
        {
          slug: 'venue',
          fields: venueListingDetails,
        },
        {
          slug: 'gastro',
          fields: gastroListingDetails,
        },
        {
          slug: 'entertainment',
          fields: entertainmentListingDetails,
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return

        if (!data.slug) {
          data.slug = slugify(data.name)
        }
      },
    ],
  },
}
