import { ApiHandler, useBody, useCookies } from 'sst/node/api'
import { Config } from 'sst/node/config'
import { Analytics } from '@segment/analytics-node'

const analytics = new Analytics({ writeKey: Config.SEGMENT_WRITE_KEY })

export const handler = ApiHandler(async (_evt) => {
  console.log('analtics.track Pageview')
  const body = useBody()
  console.log(body)
  console.log(useCookies())
  return {
    statusCode: 200,
    body: 'ok',
  }
})
