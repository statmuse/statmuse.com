import { ApiHandler, useJsonBody, useCookies, useHeaders } from 'sst/node/api'
import { Config } from 'sst/node/config'
import { Analytics, TrackParams } from '@segment/analytics-node'

const analytics = process.env.IS_LOCAL
  ? { track: (x: TrackParams) => console.log(x) }
  : new Analytics({ writeKey: Config.SEGMENT_WRITE_KEY })

// get from session & cookies
const anonymousId = ''
const visitor_id = ''
const user_id = ''
const userId = ''

const flattenObj = (key: string, obj?: {}): {} => {
  return !obj
    ? {}
    : Object.entries(obj).reduce((x, [k, v]) => {
        return {
          ...x,
          [`${key}.${k}`]: v,
        }
      }, {})
}

export const handler = ApiHandler(async (_evt) => {
  const { context, disposition, tokenizationScore, ...props } = useJsonBody()
  const headers = useHeaders()
  analytics.track({
    userId,
    anonymousId,
    event: 'Pageview',
    context: {
      ip: headers['x-forwarded-for'],
      userAgent: headers['user-agent'],
      ...context,
    },
    properties: {
      ...props,
      ...flattenObj('disposition', disposition),
      ...flattenObj('tokenizationScore', tokenizationScore),
      visitor_id,
      user_id,
    },
  })
  return {
    statusCode: 200,
    body: 'ok',
  }
})
