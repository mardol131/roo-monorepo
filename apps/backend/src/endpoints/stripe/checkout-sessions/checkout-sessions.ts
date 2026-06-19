import { Endpoint } from 'payload'
import { activateListingSubscriptionEndpoint } from './activate-listing-subscription/activate-listing-subscription'

export const stripeCheckoutSessionEndpoints: Endpoint[] = [activateListingSubscriptionEndpoint]
