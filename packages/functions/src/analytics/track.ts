import { Handler } from 'sst/context'
import { KinesisStreamEvent, KinesisStreamBatchResponse } from 'aws-lambda'
import { Analytics } from '@segment/analytics-node'
import { Config } from 'sst/node/config'

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
      cookie,
      resultType,
      contentType,
      country,
      headers,
      asn,
    ] = parts

    try {
      await new Promise((resolve) =>
        analytics().track(
          {
            timestamp: new Date(Number.parseFloat(timestamp) * 1000),
            event: 'CDN Request',
            // userId: '',
            // anonymousId: '',
            properties: {
              headers,
              cookie,
              uri,
              contentType,
              country,
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

    incomplete.pop()
  }

  const response = {
    batchItemFailures: incomplete.map((id) => ({
      itemIdentifier: id,
    })),
  }

  return response
})
