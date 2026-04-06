import type { CollectionConfig } from 'payload'

export const VenueListings: CollectionConfig = {
  slug: 'venue-listings',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      type: 'text',
    },
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
          name: 'postalCode',
          type: 'text',
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
      name: 'indoor',
      type: 'checkbox',
    },
    {
      name: 'outdoor',
      type: 'checkbox',
    },
    {
      name: 'eventTypes',
      type: 'relationship',
      relationTo: 'event-types',
      hasMany: true,
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'coverImage',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'text',
        },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            {
              name: 'url',
              type: 'text',
            },
          ],
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
      name: 'venueRules',
      type: 'relationship',
      relationTo: 'rules',
      hasMany: true,
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
      name: 'amenities',
      type: 'relationship',
      relationTo: 'amenities',
      hasMany: true,
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
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
        {
          name: 'foodTypes',
          type: 'relationship',
          relationTo: 'food-types',
          hasMany: true,
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
        {
          name: 'groupedBy',
          type: 'select',
          options: ['general', 'booking', 'cancellation', 'payment', 'other'],
          defaultValue: 'general',
        },
      ],
    },
    {
      name: 'references',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'text',
        },
        {
          name: 'eventName',
          type: 'text',
        },
        {
          name: 'clientName',
          type: 'text',
        },
        {
          name: 'eventType',
          type: 'relationship',
          relationTo: 'event-types',
        },
      ],
    },
    {
      name: 'employees',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
