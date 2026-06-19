import type { PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  payload: PayloadRequest['payload'],
) {
  const listingSubscriptionId = session.metadata?.listingSubscriptionId
  const subscriptionId = session.subscription as string | null
  const customerId = session.customer as string | null

  if (!listingSubscriptionId || !subscriptionId || !customerId) return

  const doc = await payload.findByID({
    collection: 'listing-subscriptions',
    id: listingSubscriptionId,
    overrideAccess: true,
  })

  if (!doc || doc.status === 'paid') return

  await payload.update({
    collection: 'listing-subscriptions',
    id: listingSubscriptionId,
    data: {
      status: 'paid',
      paidAt: new Date().toISOString(),
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      ...(session.amount_total != null && { amount: session.amount_total / 100 }),
    },
    overrideAccess: true,
  })
}
