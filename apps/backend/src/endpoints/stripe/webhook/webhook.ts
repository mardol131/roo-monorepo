import type { Endpoint, PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { handleCheckoutSessionCompleted } from './handlers/checkout-session-completed'
import { handleInvoicePaid } from './handlers/invoice-paid'
import { handleInvoicePaymentFailed } from './handlers/invoice-payment-failed'
import { handleSubscriptionDeleted } from './handlers/subscription-deleted'
import { handleSubscriptionUpdated } from './handlers/subscription-updated'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Stripe webhook secret is not configured')
      return new Response('Webhook secret not configured', { status: 500 })
    }

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    let rawBody: string
    try {
      rawBody = await req.text!()
    } catch {
      console.error('Failed to read request body')
      return new Response('Failed to read request body', { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
      console.error('Invalid webhook signature')
      return new Response('Invalid webhook signature', { status: 400 })
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          await handleCheckoutSessionCompleted(event.data.object, req.payload)
          break
        }

        case 'invoice.paid': {
          await handleInvoicePaid(event.data.object, req.payload)
          break
        }

        case 'invoice.payment_failed': {
          await handleInvoicePaymentFailed(event.data.object, req.payload)
          break
        }

        case 'customer.subscription.deleted': {
          await handleSubscriptionDeleted(event.data.object, req.payload)
          break
        }

        case 'customer.subscription.updated': {
          await handleSubscriptionUpdated(event.data.object, req.payload)
          break
        }
      }
    } catch (err) {
      req.payload.logger.error({ err, eventType: event.type }, 'Stripe webhook handler error')
      return new Response('Internal server error', { status: 500 })
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}

export { stripeWebhookEndpoint }
