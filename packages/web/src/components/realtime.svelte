<script lang="ts">
  import { iot, mqtt } from 'aws-iot-device-sdk-v2'
  import { v4 as uuidv4 } from 'uuid'
  import { onMount } from 'svelte'
  import type { GameraDomain } from '@statmuse/core/gamera'

  type ConnectionParam = {
    domain: GameraDomain
    gameId: number
    topic: string
  }

  type SubscriptionHandler = (topic: string, payload: any) => void

  export let connectionParams: ConnectionParam[]
  export let subscriptionHandler: SubscriptionHandler

  let connection: mqtt.MqttClientConnection

  async function createConnection() {
    if (connection) await connection.disconnect()
    const config = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id('client_' + uuidv4())
      .with_endpoint(import.meta.env.PUBLIC_IOT_HOST)
      .with_custom_authorizer(
        '',
        `${import.meta.env.PUBLIC_STAGE}-statmuse-authorizer`,
        '',
        connectionParams
          .map((p) => `${p.domain.toLowerCase()}:${p.gameId}`)
          .join(' '),
      )
      .with_keep_alive_seconds(1200)
      .build()

    const client = new mqtt.MqttClient()
    connection = client.new_connection(config)

    connection.on('connect', async () => {
      console.log('WS connected')

      await Promise.allSettled(
        connectionParams.map((p) =>
          connection.subscribe(
            `statmuse/${
              import.meta.env.PUBLIC_STAGE
            }/${p.domain.toLowerCase()}/game/${p.gameId}/${p.topic}`,
            mqtt.QoS.AtLeastOnce,
          ),
        ),
      )
    })

    connection.on('interrupt', (e) => {
      console.log('interrupted, restarting', e, JSON.stringify(e))
      createConnection()
    })

    connection.on('error', (e) => {
      console.log(
        'connection error',
        e,
        e.error,
        e.name,
        e.cause,
        e.message,
        e.error_code,
        e.error_name,
      )
    })

    connection.on('resume', console.log)

    connection.on('message', (fullTopic, payload) => {
      const data = JSON.parse(new TextDecoder('utf8').decode(payload))
      subscriptionHandler(fullTopic, data)
    })

    connection.on('disconnect', console.log)

    await connection.connect()
  }

  onMount(() => {
    createConnection()

    return () => {
      if (connection) connection.disconnect()
    }
  })
</script>
