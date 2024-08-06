import {
  IoTDataPlaneClient,
  PublishCommand,
} from '@aws-sdk/client-iot-data-plane'
import { Config } from 'sst/node/config'

const data = new IoTDataPlaneClient({})

export async function publish(topic: string, properties: any) {
  await data.send(
    new PublishCommand({
      payload: Buffer.from(JSON.stringify(properties)),
      topic: `statmuse/${Config.STAGE}/${topic}`,
    }),
  )
}
