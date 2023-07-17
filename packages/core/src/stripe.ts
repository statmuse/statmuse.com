/// <reference types="stripe-event-types" />
import Stripe from "stripe"
import { Config } from "sst/node/config"
import { db } from "./db"

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

  await db
    .updateTable("users")
    .set({
      stripe_customer_id: session.customer as string,
      stripe_subscription_status: "active",
    })
    .where("users.id", "=", session.client_reference_id)
    .executeTakeFirst()
}

async function handleSubscriptionCreatedOrUpdated(
  event: Stripe.DiscriminatedEvent.CustomerSubscriptionEvent
) {
  const subscription = event.data.object
  if (subscription.status === "incomplete") return

  if (subscription.status !== "active") {
    // console.log(JSON.stringify(subscription))
    console.log(
      `${subscription.customer} has non-active status ${subscription.status}`
    )
  }

  await db
    .updateTable("users")
    .set({ stripe_subscription_status: subscription.status })
    .where("users.stripe_customer_id", "=", subscription.customer as string)
    .executeTakeFirst()
}
