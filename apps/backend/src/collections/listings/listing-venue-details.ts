import type { CollectionConfig } from 'payload'
import { commonListingDetailFields, customSectionsFields } from './fields'
import { listingDetailAccessControl } from './access'

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
      name: 'hasAccommodation',
      type: 'checkbox',
    },
    {
      name: 'accommodationCapacity',
      type: 'number',
    },
    {
      name: 'access',
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
      required: true,
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
      required: true,
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
  ],
}
