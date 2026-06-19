import type { Endpoint, PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { getIdFromRelationshipField } from '@roo/common'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export const activateListingSubscriptionEndpoint: Endpoint = {
  path: '/stripe/checkout-sessions/activate-listing-subscription',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const priceId = process.env.STRIPE_PRICE_BASIC
    if (!priceId) {
      return Response.json({ error: 'STRIPE_PRICE_BASIC is not configured' }, { status: 500 })
    }

    const body = await req.json!()
    const { listingId, successUrl, cancelUrl } = body ?? {}

    if (!listingId || !successUrl || !cancelUrl) {
      return Response.json(
        { error: 'Missing required fields: listingId, successUrl, cancelUrl' },
        { status: 400 },
      )
    }

    const listing = await req.payload.findByID({
      collection: 'listings',
      id: listingId,
      depth: 1,
      overrideAccess: true,
    })

    if (!listing) {
      return Response.json({ error: 'Listing not found' }, { status: 404 })
    }

    const listingCompanyId = getIdFromRelationshipField(listing.company)

    const company = await req.payload.findByID({
      collection: 'companies',
      id: listingCompanyId,
      overrideAccess: true,
    })
    if (!company) {
      return Response.json({ error: 'Listing has no company' }, { status: 400 })
    }

    const userId = req.user.id

    const isOwner = getIdFromRelationshipField(company.owner) === userId

    const isMember = company.members?.some((m) => getIdFromRelationshipField(m.user) === userId)

    if (!isOwner && !isMember) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const existingActive = await req.payload.find({
      collection: 'listing-subscriptions',
      where: {
        and: [
          { listing: { equals: listingId } },
          { status: { in: ['paid', 'pending', 'cancelling'] } },
        ],
      },
      overrideAccess: true,
    })

    if (existingActive.docs.length > 0) {
      return Response.json({ error: 'Listing already has an active subscription' }, { status: 409 })
    }

    let stripeCustomerId = company.stripeCustomerId ?? null

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: company.name,
        email: company.email,
        metadata: { companyId: company.id },
      })
      stripeCustomerId = customer.id
      await req.payload.update({
        collection: 'companies',
        id: company.id,
        data: { stripeCustomerId },
        overrideAccess: true,
      })
    }

    const subscriptionDoc = await req.payload.create({
      collection: 'listing-subscriptions',
      data: {
        listing: listingId,
        company: company.id,
        tariff: 'basic',
        amount: 0,
        status: 'pending',
        stripeCustomerId,
      },
      overrideAccess: true,
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
          metadata: {
            listingSubscriptionId: subscriptionDoc.id,
            userId: req.user.id,
            listingId: listing.id,
          },
        },
      ],
      custom_text: {
        submit: { message: `Aktivujete předplatné pro inzerát: ${listing.name}` },
      },
      metadata: {
        listingSubscriptionId: subscriptionDoc.id,
        listingName: listing.name,
        userId: req.user.id,
        listingId: listing.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return Response.json({ url: session.url }, { status: 200 })
  },
}
