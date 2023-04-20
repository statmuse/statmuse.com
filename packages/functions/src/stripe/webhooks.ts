import { ApiHandler } from "sst/node/api"
import { Config } from "sst/node/config"
import { stripe, handleEvent } from "@statmuse/core/stripe"

export const handler = ApiHandler(async (event) => {
  if (!event.body) return { statusCode: 400, body: "Request has no body" }
  if (!event.headers["stripe-signature"])
    return { statusCode: 400, body: "Request has no signature" }

  const payload = event.body
  const signature = event.headers["stripe-signature"]

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      payload,
      signature,
      Config.STRIPE_WEBHOOK_SECRET
    )
    await handleEvent(stripeEvent)
    return { statusCode: 200 }
  } catch (err) {
    console.error(err)
    return { statusCode: 400, body: err as string }
  }
})
