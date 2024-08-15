<script lang="ts">
  import type {
    MlbGameDataResponse,
    MlbPlayByPlayResponse,
  } from '@statmuse/core/gamera/index'
  import * as store from './stores'
  import { onMount } from 'svelte'

  export let gameData: MlbGameDataResponse
  export let playByPlay: MlbPlayByPlayResponse

  onMount(() => {
    store.init({ gameData, playByPlay })
    window.store = store
    return () => store.gameState.set({})
  })
</script>
