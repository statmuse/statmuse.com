import { Config } from 'sst/node/config'
import type { APIGatewayRequestSimpleAuthorizerHandlerV2 } from 'aws-lambda'

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (
  event,
) => {
  const authorization =
    event.headers?.Authorization || event.headers?.authorization

  if (authorization?.trim() === Config.API_KEY.trim()) {
    return { isAuthorized: true }
  }

  return { isAuthorized: false }
}
