import { ApiHandler } from "sst/node/api"
import { createCheckoutSession } from "@statmuse/core/stripe"

type Request = {
  email: string
  userId: string
  referral?: string
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

  const session = await createCheckoutSession(body)

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
