import { ApiHandler } from 'sst/node/api'
import { deleteCustomer } from '@statmuse/core/stripe'
import { deleteUser } from '@statmuse/core/user'

type Request = {
  userId: string
  customerId?: string
}

export const handler = ApiHandler(async (evt) => {
  if (!evt.body) return { statusCode: 400, body: 'Missing body' }

  const body = JSON.parse(evt.body) as Request
  if (!body.userId) {
    return {
      statusCode: 400,
      body: 'Missing required fields (userId)',
    }
  }

  await deleteUser(body.userId)

  if (body.customerId) {
    await deleteCustomer({ customerId: body.customerId })
  }

  return { body: JSON.stringify({}) }
})
