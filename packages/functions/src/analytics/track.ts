import { unzipSync } from 'zlib'
import { Handler } from 'sst/context'
import { KinesisStreamEvent, KinesisStreamBatchResponse } from 'aws-lambda'

declare module 'sst/context' {
  interface Handlers {
    kinesis_stream: {
      event: KinesisStreamEvent
      response: KinesisStreamBatchResponse
    }
  }
}

export const handler = Handler('kinesis_stream', async (event, ctx) => {
  const incomplete: string[] = event.Records.map((r) => r.eventID).reverse()

  const { Records } = event
  for (const record of Records) {
    const decoded = JSON.parse(
      unzipSync(Buffer.from(record.kinesis.data, 'base64')).toString(),
    )
    console.log(JSON.stringify(decoded, undefined, 2))
    incomplete.pop()
    // if (decoded.messageType !== 'DATA_MESSAGE') {
    //   incomplete.pop()
    //   continue
    // }
    // try {
    //   // await Issue.extract(decoded);
    //   incomplete.pop()
    // } catch (ex) {
    //   console.error(ex)
    // }
  }

  const response = {
    batchItemFailures: incomplete.map((id) => ({
      itemIdentifier: id,
    })),
  }

  return response
})
