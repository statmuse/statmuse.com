import { ApiHandler } from "sst/node/api"
import { stripe } from "@statmuse/core/stripe"
import { deleteUser } from "@statmuse/core/user"

type Request = {
  userId: string
  customerId?: string
}

export const handler = ApiHandler(async (evt) => {
  if (!evt.body) return { statusCode: 400, body: "Missing body" }

  const body = JSON.parse(evt.body) as Request
  if (!body.userId) {
    return {
      statusCode: 400,
      body: "Missing required fields (userId)",
    }
  }

  await deleteUser(body.userId)

  if (body.customerId) {
    try {
      await stripe.customers.del(body.customerId)
    } catch (error) {
      console.error("Error deleting Stripe customer; already deleted?", error)
    }
  }

  return { body: JSON.stringify({}) }
})
