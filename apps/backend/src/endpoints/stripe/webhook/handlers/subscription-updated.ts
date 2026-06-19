import type { PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export async function handleSubscriptionUpdated(
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
  if (!doc) return

  if (subscription.status === 'active') {
    if (subscription.cancel_at_period_end) {
      if (doc.status !== 'cancelling') {
        await payload.update({
          collection: 'listing-subscriptions',
          id: doc.id,
          data: { status: 'cancelling' },
          overrideAccess: true,
        })
      }
      return
    }
    if (doc.status !== 'paid') {
      await payload.update({
        collection: 'listing-subscriptions',
        id: doc.id,
        data: { status: 'paid' },
        overrideAccess: true,
      })
    }
    return
  }

  if (
    (subscription.status === 'canceled' || subscription.status === 'unpaid') &&
    doc.status !== 'expired'
  ) {
    await payload.update({
      collection: 'listing-subscriptions',
      id: doc.id,
      data: { status: 'expired' },
      overrideAccess: true,
    })
  }
}
