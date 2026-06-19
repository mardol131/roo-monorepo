import type { Endpoint, PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { getIdFromRelationshipField } from '@roo/common'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export const getPaymentHistoryEndpoint: Endpoint = {
  path: '/stripe/subscriptions/payment-history',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url ?? '', 'http://localhost')
    const subscriptionId = url.searchParams.get('subscriptionId')

    if (!subscriptionId) {
      return Response.json({ error: 'Missing required param: subscriptionId' }, { status: 400 })
    }

    const existing = await req.payload.findByID({
      collection: 'listing-subscriptions',
      id: subscriptionId,
      depth: 1,
      overrideAccess: true,
    })

    if (!existing) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const companyId = getIdFromRelationshipField(existing.company)
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
    const isMember = company.members?.some((m) => {
      const memberId = getIdFromRelationshipField(m.user)
      return memberId === userId && (m.role === 'admin' || m.role === 'manager')
    })

    if (!isOwner && !isMember) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!existing.stripeSubscriptionId) {
      return Response.json({ invoices: [] }, { status: 200 })
    }

    try {
      const invoices = await stripe.invoices.list({
        subscription: existing.stripeSubscriptionId,
        limit: 24,
      })

      const result = invoices.data.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status,
        paidAt: invoice.status_transitions.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          : null,
        invoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
      }))

      return Response.json({ invoices: result }, { status: 200 })
    } catch (err) {
      req.payload.logger.error({ err }, 'Failed to fetch Stripe invoices')
      return Response.json({ error: 'Failed to fetch payment history' }, { status: 502 })
    }
  },
}
