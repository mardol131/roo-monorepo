import type { PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  payload: PayloadRequest['payload'],
) {
  const sub = invoice.parent?.subscription_details?.subscription
  const subscriptionId = typeof sub === 'string' ? sub : sub?.id

  if (!subscriptionId) return

  const existing = await payload.find({
    collection: 'listing-subscriptions',
    where: { stripeSubscriptionId: { equals: subscriptionId } },
    overrideAccess: true,
  })

  if (existing.docs.length === 0) return

  const doc = existing.docs[0]
  if (!doc) return

  // Only mark expired if subscription was previously active
  if (doc.status !== 'paid') return

  await payload.update({
    collection: 'listing-subscriptions',
    id: doc.id,
    data: { status: 'expired' },
    overrideAccess: true,
  })
}
