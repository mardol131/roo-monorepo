import type { CollectionConfig, Field } from 'payload'
import { customSectionsFields, priceableOptionFields } from '../listings/fields'
import { listingDetailAccessControl } from '../listings/access'
import { commonListingDetailFields } from './common'

export const listingVenueDetailFilters: Field = {
  name: 'filters',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'allEventTypes',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'eventTypes',
      type: 'relationship',
      relationTo: 'event-types',
      hasMany: true,
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!siblingData?.allEventTypes && !(value as unknown[])?.length) {
          return 'Vyberte alespoň jeden typ akce'
        }
        return true
      },
    },

    {
      name: 'placeTypes',
      type: 'relationship',
      relationTo: 'place-types',
      hasMany: true,
    },
    {
      name: 'venueRules',
      type: 'relationship',
      relationTo: 'venue-rules',
      hasMany: true,
    },
    {
      name: 'necessities',
      type: 'relationship',
      relationTo: 'necessities',
      hasMany: true,
    },
  ],
}

export const listingVenueDetailOptions: Field = {
  name: 'options',
  type: 'group',
  required: true,
  fields: [
    {
      name: 'activities',
      type: 'array',
      fields: [
        { name: 'activity', type: 'relationship', relationTo: 'activities', required: true },
        ...priceableOptionFields,
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'relationship',
          relationTo: 'technologies',
          required: true,
        },
        ...priceableOptionFields,
      ],
    },
    {
      name: 'personnel',
      type: 'array',
      fields: [
        { name: 'personnel', type: 'relationship', relationTo: 'personnel', required: true },
        ...priceableOptionFields,
      ],
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [
        { name: 'amenity', type: 'relationship', relationTo: 'amenities', required: true },
        ...priceableOptionFields,
      ],
    },
    {
      name: 'services',
      type: 'array',
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services', required: true },
        ...priceableOptionFields,
      ],
    },
  ],
}

export const ListingVenueDetails: CollectionConfig = {
  slug: 'listing-venue-details',
  access: listingDetailAccessControl,
  fields: [
    ...customSectionsFields,
    ...commonListingDetailFields,
    {
      name: 'type',
      type: 'select',
      options: ['venue'],
      required: true,
      defaultValue: 'venue',
    },
    {
      name: 'spacesType',
      type: 'select',
      options: ['area', 'building', 'room'],
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
      name: 'accomodation',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'hasAccommodation',
          type: 'checkbox',
        },
        {
          name: 'accommodationCapacity',
          type: 'number',
        },
      ],
    },

    {
      name: 'propertyAccess',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'vehicleTypes',
          type: 'select',
          options: ['car', 'truck', 'van', 'bus'],
          hasMany: true,
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
      required: true,
      fields: [
        {
          name: 'hasParking',
          type: 'checkbox',
        },
        {
          name: 'parkingCapacity',
          type: 'number',
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (siblingData?.hasParking && (value === undefined || value === null)) {
              return 'Zadejte kapacitu parkování'
            }
            return true
          },
        },
        {
          name: 'parkingIsIncludedInPrice',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'parkingPrice',
          type: 'number',
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (siblingData?.parkingIsIncludedInPrice && (value === undefined || value === null)) {
              return 'Zadejte cenu parkování'
            }
            return true
          },
        },
      ],
    },
    listingVenueDetailFilters,
    listingVenueDetailOptions,
    {
      name: 'breakfast',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'breakfastIncluded',
          type: 'checkbox',
          required: true,
          defaultValue: false,
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
          defaultValue: false,
        },
        {
          name: 'price',
          type: 'number',
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (
              siblingData?.breakfastIsIncludedInPrice &&
              (value === undefined || value === null)
            ) {
              return 'Zadejte cenu snídaně'
            }
            return true
          },
        },
        {
          name: 'priceUnit',
          type: 'select',
          options: ['person', 'booking'],
          defaultValue: 'person',
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (
              siblingData?.breakfastIsIncludedInPrice &&
              (value === undefined || value === null)
            ) {
              return 'Zadejte jednotku ceny snídaně'
            }
            return true
          },
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
  ],
}
