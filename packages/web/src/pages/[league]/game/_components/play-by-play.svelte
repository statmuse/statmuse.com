<script lang="ts">
  import HalfInningPlayByPlay from './half-inning-play-by-play.svelte'
  import { innings, scoringInnings } from './stores'
  import type { GameraTeamReference } from '@statmuse/core/gamera/index'

  export let scoring: boolean = false
  export let reverseOrder: boolean = false
  export let awayTeam: GameraTeamReference | undefined = undefined
  export let homeTeam: GameraTeamReference | undefined = undefined

  $: inningPlays = scoring
    ? $scoringInnings
    : reverseOrder
    ? $innings
    : $innings
</script>

{#each inningPlays as inning (inning)}
  {@const number = inning.number}
  {@const [topHalf, bottomHalf] = inning.halves}
  {#if reverseOrder}
    {#if bottomHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Bottom ${number}`}
        inning={bottomHalf}
        colors={homeTeam?.colors}
      />
    {/if}
    {#if topHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Top ${number}`}
        inning={topHalf}
        colors={awayTeam?.colors}
      />
    {/if}
  {:else}
    {#if topHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Top ${number}`}
        inning={topHalf}
        colors={awayTeam?.colors}
      />
    {/if}
    {#if bottomHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Bottom ${number}`}
        inning={bottomHalf}
        colors={homeTeam?.colors}
      />
    {/if}
  {/if}
{/each}
