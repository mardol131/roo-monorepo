import type { Field } from 'payload'

export const listingSubscriptionFields: Field[] = [
  {
    name: 'listing',
    type: 'relationship',
    relationTo: 'listings',
    required: true,
  },
  {
    name: 'company',
    type: 'relationship',
    relationTo: 'companies',
    required: true,
  },
  {
    name: 'tariff',
    type: 'select',
    options: ['basic'],
    required: true,
  },
  {
    name: 'amount',
    type: 'number',
    required: true,
    min: 0,
    admin: {
      description: 'Očekávaná částka v Kč',
    },
  },
  {
    name: 'status',
    type: 'select',
    options: ['pending', 'paid', 'cancelling', 'expired'],
    required: true,
    defaultValue: 'pending',
  },
  {
    name: 'validUntil',
    type: 'date',
    admin: {
      description: 'Datum expirace subscription',
    },
  },
  {
    name: 'paidAt',
    type: 'date',
  },
  {
    name: 'stripeCustomerId',
    type: 'text',
    admin: {
      description: 'Stripe Customer ID (cus_...)',
    },
  },
  {
    name: 'stripeSubscriptionId',
    type: 'text',
    admin: {
      description: 'Stripe Subscription ID (sub_...) pro opakované platby',
    },
  },
  {
    name: 'stripePaymentIntentId',
    type: 'text',
    admin: {
      description: 'Stripe Payment Intent ID (pi_...) pro jednorázové platby',
    },
  },
  {
    name: 'stripePriceId',
    type: 'text',
    admin: {
      description: 'Stripe Price ID (price_...) — který produkt/tariff byl zakoupen',
    },
  },
]
