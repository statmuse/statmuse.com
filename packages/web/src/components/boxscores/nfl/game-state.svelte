<script lang="ts">
  import type {
    NflGameDataResponse,
    NflPlayByPlayResponse,
    NflStatKey,
  } from '@statmuse/core/gamera/index'
  import * as store from './stores'
  import { onMount } from 'svelte'

  export let gameData: NflGameDataResponse<NflStatKey>
  export let playByPlay: NflPlayByPlayResponse

  onMount(() => {
    store.init({ gameData, playByPlay })
    // return () => store.gameState.set({})
  })
</script>
