import { Endpoint } from 'payload'
import { cancelSubscriptionEndpoint } from './cancel-subscription/cancel-subscription'
import { resumeSubscriptionPaymentsEndpoint } from './resume-subscription-payments/resume-subscription-payments'
import { getPaymentHistoryEndpoint } from './get-payment-history/get-payment-history'

export const stripeSubscriptionEndpoints: Endpoint[] = [
  cancelSubscriptionEndpoint,
  resumeSubscriptionPaymentsEndpoint,
  getPaymentHistoryEndpoint,
]
