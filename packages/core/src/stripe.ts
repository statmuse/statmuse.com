/// <reference types="stripe-event-types" />
import Stripe from "stripe"
import { Config } from "sst/node/config"
import { db } from "./mothra/db"

export const stripe = new Stripe(Config.STRIPE_SECRET, {
  apiVersion: "2022-11-15",
})

export async function handleEvent(untypedEvent: Stripe.Event) {
  const event = untypedEvent as Stripe.DiscriminatedEvent

  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event)
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return handleSubscriptionCreatedOrUpdated(event)
    default:
      console.log(`Unhandled webhook event type: ${event.type}`)
  }
}

async function handleCheckoutSessionCompleted(
  event: Stripe.DiscriminatedEvent.CheckoutSessionEvent
) {
  const session = event.data.object
  const sessionWithSubscription = await stripe.checkout.sessions.retrieve(
    session.id,
    { expand: ["subscription"] }
  )

  const response = await db
    .updateTable("users")
    .set({
      stripe_customer_id: session.customer as string,
      stripe_subscription_status: sessionWithSubscription.status,
    })
    .where("users.id", "=", session.client_reference_id)
    .executeTakeFirst()

  console.log(JSON.stringify(response, undefined, 2))
}

async function handleSubscriptionCreatedOrUpdated(
  event: Stripe.DiscriminatedEvent.CustomerSubscriptionEvent
) {
  const subscription = event.data.object

  const response = await db
    .updateTable("users")
    .set({ stripe_subscription_status: subscription.status })
    .where("users.stripe_customer_id", "=", subscription.customer as string)
    .executeTakeFirst()

  console.log(JSON.stringify(response, undefined, 2))
}
