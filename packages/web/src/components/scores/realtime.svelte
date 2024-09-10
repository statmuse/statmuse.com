<script lang="ts">
  import Realtime from '@components/realtime.svelte'
  import * as stores from './stores'
  import type { GameraDomain } from '@statmuse/core/gamera'

  type ConnectionParam = {
    domain: GameraDomain
    gameId: number
    topic: string
  }

  export let connectionParams: ConnectionParam[]
</script>

<Realtime
  {connectionParams}
  subscriptionHandler={(_topic, payload) => {
    stores.addMlbGame(payload)
  }}
/>
