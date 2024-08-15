<script lang="ts">
  import { iot, mqtt } from 'aws-iot-device-sdk-v2'
  import { v4 as uuidv4 } from 'uuid'
  import { onMount } from 'svelte'
  import * as store from '../pages/[league]/game/_components/stores'

  export let gameId: string

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
        gameId,
      )
      .with_keep_alive_seconds(1200)
      .build()

    const client = new mqtt.MqttClient()
    connection = client.new_connection(config)

    connection.on('connect', async () => {
      console.log('WS connected')

      await connection.subscribe(
        `statmuse/${import.meta.env.PUBLIC_STAGE}/mlb/game/${gameId}/#`,
        mqtt.QoS.AtLeastOnce,
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
      console.log('full topic: ', fullTopic)
      const data = JSON.parse(new TextDecoder('utf8').decode(payload))
      store.update(data)
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
