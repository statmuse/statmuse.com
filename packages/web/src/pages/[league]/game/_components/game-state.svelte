<script lang="ts">
  import type {
    MlbGameDataResponse,
    MlbPlayByPlayResponse,
  } from '@statmuse/core/gamera/index'
  import { gameState } from './stores'
  import { onMount } from 'svelte'

  export let gameData: MlbGameDataResponse
  export let playByPlay: MlbPlayByPlayResponse

  onMount(() => {
    gameState.set({ gameData, playByPlay })
    return () => gameState.set({})
  })
</script>
