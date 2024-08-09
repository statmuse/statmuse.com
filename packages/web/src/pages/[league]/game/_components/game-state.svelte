<script lang="ts">
  import type {
    MlbGameDataResponse,
    MlbPlayByPlayResponse,
  } from '@statmuse/core/gamera/index'
  import {
    gameState,
    innings,
    gameScore,
    lineScore,
    players,
    lineup,
    stats,
    matchup,
    runners,
  } from './stores'
  import { onMount } from 'svelte'

  export let gameData: MlbGameDataResponse
  export let playByPlay: MlbPlayByPlayResponse

  onMount(() => {
    gameState.set({ gameData, playByPlay })
    innings.set(playByPlay?.innings ?? [])
    gameScore.set({
      away: gameData.awayTeam.score,
      home: gameData.homeTeam.score,
    })
    lineScore.set({
      away: gameData.awayTeam.lineScore,
      home: gameData.homeTeam.lineScore,
    })
    stats.set({
      away: gameData.awayTeam.stats,
      home: gameData.homeTeam.stats,
    })
    lineup.set({
      away: gameData.awayTeam.players,
      home: gameData.homeTeam.players,
    })
    players.set(
      gameData.players?.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}) ?? {},
    )

    window.store = {
      innings,
      gameScore,
      lineScore,
      stats,
      lineup,
      players,
      matchup,
      runners,
    }
    return () => gameState.set({})
  })
</script>
