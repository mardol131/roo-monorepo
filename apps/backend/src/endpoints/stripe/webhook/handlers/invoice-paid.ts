import type { PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export async function handleInvoicePaid(
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
  if (!doc || doc.status === 'paid') return

  const validUntil = new Date()
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  await payload.update({
    collection: 'listing-subscriptions',
    id: doc.id,
    data: {
      status: 'paid',
      paidAt: new Date().toISOString(),
      validUntil: validUntil.toISOString(),
      amount: invoice.amount_paid / 100,
    },
    overrideAccess: true,
  })
}
