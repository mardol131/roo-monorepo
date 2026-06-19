import type { Endpoint, PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { getIdFromRelationshipField } from '@roo/common'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export const cancelSubscriptionEndpoint: Endpoint = {
  path: '/stripe/subscriptions/cancel',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json!()
    const { listingId } = body ?? {}

    if (!listingId) {
      return Response.json({ error: 'Missing required field: listingId' }, { status: 400 })
    }

    const existing = await req.payload.find({
      collection: 'listing-subscriptions',
      where: {
        and: [
          { listing: { equals: listingId } },
          { status: { equals: 'paid' } },
        ],
      },
      depth: 1,
      overrideAccess: true,
    })

    const doc = existing.docs[0]
    if (!doc) {
      return Response.json({ error: 'No active subscription found for this listing' }, { status: 404 })
    }

    const companyId = getIdFromRelationshipField(doc.company)
    if (!companyId) {
      return Response.json({ error: 'Subscription has no company' }, { status: 400 })
    }

    const company = await req.payload.findByID({
      collection: 'companies',
      id: companyId,
      overrideAccess: true,
    })

    const userId = req.user.id
    const isOwner = getIdFromRelationshipField(company.owner) === userId
    const isMember = company.members?.some((m) => getIdFromRelationshipField(m.user) === userId)

    if (!isOwner && !isMember) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!doc.stripeSubscriptionId) {
      return Response.json({ error: 'Subscription has no Stripe subscription ID' }, { status: 400 })
    }

    try {
      await stripe.subscriptions.update(doc.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Failed to update Stripe subscription')
      return Response.json({ error: 'Failed to cancel Stripe subscription' }, { status: 502 })
    }

    await req.payload.update({
      collection: 'listing-subscriptions',
      id: doc.id,
      data: { status: 'cancelling' },
      overrideAccess: true,
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
