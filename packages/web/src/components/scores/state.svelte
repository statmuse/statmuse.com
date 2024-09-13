<script lang="ts">
  import type { MlbGameScore } from '@statmuse/core/gamera/index'
  import * as store from './stores'
  import { onMount } from 'svelte'

  export let games: MlbGameScore[]

  onMount(() => {
    const data = games.reduce<Record<string, MlbGameScore | undefined>>(
      (acc, g) => ({ ...acc, [`${g.domain}-${g.gameId}`]: g }),
      {},
    )
    store.scores.set(data)
    return () => store.scores.set({})
  })
</script>
