import { ApiHandler } from "sst/node/api"
import { verifyWebhook, handleEvent } from "@statmuse/core/stripe"

export const handler = ApiHandler(async (evt) => {
  const [valid, event] = verifyWebhook(evt)
  if (!valid) {
    const error = event
    return { statusCode: 400, body: error }
  }

  handleEvent(event)

  return { statusCode: 200 }
})
