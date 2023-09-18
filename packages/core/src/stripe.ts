/// <reference types="stripe-event-types" />
import Stripe from 'stripe'
import { Config } from 'sst/node/config'
import { db } from './db'

export const stripe = new Stripe(Config.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
})

export async function handleEvent(untypedEvent: Stripe.Event) {
  const event = untypedEvent as Stripe.DiscriminatedEvent

  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutSessionCompleted(event)
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      return handleSubscriptionCreatedOrUpdated(event)
    default:
      console.log(`Unhandled webhook event type: ${event.type}`)
  }
}

async function handleCheckoutSessionCompleted(
  event: Stripe.DiscriminatedEvent.CheckoutSessionEvent
) {
  const session = event.data.object

  await db
    .updateTable('users')
    .set({
      stripe_customer_id: session.customer as string,
      stripe_subscription_status: 'active',
    })
    .where('users.id', '=', session.client_reference_id)
    .executeTakeFirst()
}

async function handleSubscriptionCreatedOrUpdated(
  event: Stripe.DiscriminatedEvent.CustomerSubscriptionEvent
) {
  const subscription = event.data.object
  if (subscription.status === 'incomplete') return

  if (subscription.status !== 'active') {
    // console.log(JSON.stringify(subscription))
    console.log(
      `${subscription.customer} has non-active status ${subscription.status}`
    )
  }

  await db
    .updateTable('users')
    .set({ stripe_subscription_status: subscription.status })
    .where('users.stripe_customer_id', '=', subscription.customer as string)
    .executeTakeFirst()
}

export async function createCheckoutSession(options: {
  email: string
  userId: string
  successUrl: string
  cancelUrl: string
  referral?: string
  customerId?: string
}) {
  let customerId = options.customerId

  if (options.customerId) {
    if (options.referral) {
      await stripe.customers.update(options.customerId, {
        metadata: { referral: options.referral },
        coupon: options.referral ? 'referral' : undefined,
      })
    }
  } else {
    const customer = await stripe.customers.create({
      email: options.email,
      metadata: options.referral ? { referral: options.referral } : undefined,
      coupon: options.referral ? 'referral' : undefined,
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: Config.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: customerId,
    client_reference_id: options.userId,
    allow_promotion_codes: true,
  })

  return session
}

export async function createBillingSession(options: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: options.returnUrl,
  })

  return session
}

export async function deleteCustomer(options: { customerId: string }) {
  try {
    await stripe.customers.del(options.customerId)
  } catch (error) {
    console.error('Error deleting Stripe customer; already deleted?', error)
  }
}
