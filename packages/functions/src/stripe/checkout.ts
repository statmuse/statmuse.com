import { ApiHandler } from "sst/node/api"
import { Config } from "sst/node/config"
import { stripe } from "@statmuse/core/stripe"

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

  let customerId = body.customerId

  if (body.customerId) {
    if (body.referral) {
      await stripe.customers.update(body.customerId, {
        metadata: { referral: body.referral },
        coupon: body.referral ? "referral" : undefined,
      })
    }
  } else {
    const customer = await stripe.customers.create({
      email: body.email,
      metadata: body.referral ? { referral: body.referral } : undefined,
      coupon: body.referral ? "referral" : undefined,
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
    mode: "subscription",
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
    customer: customerId,
    client_reference_id: body.userId,
    allow_promotion_codes: true,
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
