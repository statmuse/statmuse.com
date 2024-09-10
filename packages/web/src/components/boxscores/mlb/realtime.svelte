<script lang="ts">
  import Realtime from '@components/realtime.svelte'
  import * as stores from './stores'

  export let gameId: number
</script>

<Realtime
  connectionParams={[
    {
      gameId,
      domain: 'MLB',
      topic: 'box',
    },
  ]}
  subscriptionHandler={(_topic, payload) => stores.update(payload)}
/>
