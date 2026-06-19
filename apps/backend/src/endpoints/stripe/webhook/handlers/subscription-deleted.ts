import type { PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  payload: PayloadRequest['payload'],
) {
  const existing = await payload.find({
    collection: 'listing-subscriptions',
    where: { stripeSubscriptionId: { equals: subscription.id } },
    overrideAccess: true,
  })

  if (existing.docs.length === 0) return

  const doc = existing.docs[0]
  if (!doc || doc.status === 'expired') return

  await payload.update({
    collection: 'listing-subscriptions',
    id: doc.id,
    data: { status: 'expired' },
    overrideAccess: true,
  })
}
