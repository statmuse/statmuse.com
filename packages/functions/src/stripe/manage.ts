import { ApiHandler } from 'sst/node/api'
import { createBillingSession } from '@statmuse/core/stripe'

type Request = {
  customerId: string
  returnUrl: string
}

export const handler = ApiHandler(async (evt) => {
  if (!evt.body) return { statusCode: 400, body: 'Missing body' }

  const body = JSON.parse(evt.body) as Request
  if (!body.returnUrl || !body.customerId) {
    return {
      statusCode: 400,
      body: 'Missing required fields (customerId, returnUrl)',
    }
  }

  const session = await createBillingSession(body)

  if (!session.url) {
    return {
      statusCode: 500,
      body: 'Failed to create checkout session',
    }
  }

  return {
    body: JSON.stringify({ url: session.url }),
  }
})
