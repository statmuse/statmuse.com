import { Handler } from 'sst/context'
import { KinesisStreamEvent, KinesisStreamBatchResponse } from 'aws-lambda'
import { Analytics } from '@segment/analytics-node'
import { Config } from 'sst/node/config'
import { randomUUID } from 'crypto'

declare module 'sst/context' {
  interface Handlers {
    kinesis_stream: {
      event: KinesisStreamEvent
      response: KinesisStreamBatchResponse
    }
  }
}

const analytics = () =>
  new Analytics({
    maxEventsInBatch: 1,
    writeKey: Config.SEGMENT_WRITE_KEY,
  }).on('error', console.error)

const parseCookie = (cookieString: string) => {
  const cookieObj = {} as { [key: string]: string | undefined }
  if (!cookieString) return cookieObj

  const cookiePairs = cookieString.split('; ')
  for (const pair of cookiePairs) {
    const [key, value] = pair.split('=')
    cookieObj[key] = value
  }

  return cookieObj
}

export const handler = Handler('kinesis_stream', async (event, ctx) => {
  const incomplete: string[] = event.Records.map((r) => r.eventID).reverse()

  const { Records } = event
  for (const record of Records) {
    const raw = Buffer.from(record.kinesis.data, 'base64').toString('utf-8')
    const parts = raw.split('\t')
    const [
      timestamp,
      ip,
      ttfb,
      status,
      method,
      uri,
      edgeLocation,
      timeTaken,
      userAgent,
      referrer,
      cookieString,
      resultType,
      contentType,
      country,
      headerString,
      asn,
    ] = parts

    const cookies = parseCookie(decodeURIComponent(cookieString))

    if (contentType === 'text/html') {
      try {
        await new Promise((resolve) =>
          analytics().track(
            {
              timestamp: new Date(Number.parseFloat(timestamp) * 1000),
              event: 'CDN Request',
              userId: cookies['ajs_user_id'],
              anonymousId: cookies['ajs_anonymous_id'] || randomUUID(),
              properties: {
                headers: decodeURIComponent(headerString),
                cookie: decodeURIComponent(cookieString),
                uri,
                contentType,
                country,
                method,
                status,
              },
              context: {
                ip,
                // @ts-ignore
                page: uri,
                // @ts-ignore
                referrer,
                userAgent,
              },
            },
            resolve,
          ),
        )
      } catch (error) {
        console.error(error)
        continue
      }
    }

    incomplete.pop()
  }

  const response = {
    batchItemFailures: incomplete.map((id) => ({
      itemIdentifier: id,
    })),
  }

  return response
})
