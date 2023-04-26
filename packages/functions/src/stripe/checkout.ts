import { ApiHandler } from "sst/node/api"
import { Config } from "sst/node/config"
import { stripe } from "@statmuse/core/stripe"

type Request = {
  email: string
  userId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
}

export const handler = ApiHandler(async (evt) => {
  if (!evt.body) return { statusCode: 400, body: "Missing body" }

  const body = JSON.parse(evt.body) as Request
  if (!body.email || !body.userId || !body.successUrl || !body.cancelUrl) {
    return {
      statusCode: 400,
      body: "Missing required fields (email, userId, successUrl, cancelUrl)",
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: Config.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
    customer_email: body.customerId ? undefined : body.email,
    customer: body.customerId ? body.customerId : undefined,
    client_reference_id: body.userId,
  })

  if (!session.url) {
    return {
      statusCode: 500,
      body: "Failed to create checkout session",
    }
  }

  return {
    body: JSON.stringify({ url: session.url }),
  }
})
