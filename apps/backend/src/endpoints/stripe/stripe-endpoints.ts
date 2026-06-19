import { Endpoint } from 'payload'
import { stripeWebhookEndpoint } from './webhook/webhook'
import { activateListingSubscriptionEndpoint } from './checkout-sessions/activate-listing-subscription/activate-listing-subscription'
import { stripeCheckoutSessionEndpoints } from './checkout-sessions/checkout-sessions'
import { stripeSubscriptionEndpoints } from './subscriptions/subscriptions'

export const stripeEndpoints: Endpoint[] = [
  stripeWebhookEndpoint,
  ...stripeCheckoutSessionEndpoints,
  ...stripeSubscriptionEndpoints,
]
