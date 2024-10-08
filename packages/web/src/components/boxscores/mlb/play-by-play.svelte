<script lang="ts">
  import HalfInningPlayByPlay from './half-inning-play-by-play.svelte'
  import { innings, scoringInnings } from './stores'
  import {
    ordinalNumber,
    type GameraTeamReference,
    type InningPlayByPlay,
  } from '@statmuse/core/gamera/index'
  import AditudeAdBanner from '@components/aditude-ad-banner.svelte'

  export let scoring: boolean = false
  export let reverseOrder: boolean = false
  export let awayTeam: GameraTeamReference | undefined = undefined
  export let homeTeam: GameraTeamReference | undefined = undefined
  export let renderAds = false

  let inningPlays: InningPlayByPlay[]
  $: {
    inningPlays = scoring ? $scoringInnings : $innings

    if (reverseOrder) {
      inningPlays = [...inningPlays].reverse()
    }
  }
</script>

{#each inningPlays as inning (inning)}
  {@const number = inning.number}
  {@const [topHalf, bottomHalf] = inning.halves}
  {#if reverseOrder}
    {#if bottomHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Bottom ${ordinalNumber(number)}`}
        inningNumber={number}
        inning={bottomHalf}
        colors={homeTeam?.colors}
        reverseOrder
      />
    {/if}
    {#if topHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Top ${ordinalNumber(number)}`}
        inningNumber={number}
        inning={topHalf}
        colors={awayTeam?.colors}
        reverseOrder
      />
    {/if}
  {:else}
    {#if topHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Top ${ordinalNumber(number)}`}
        inningNumber={number}
        inning={topHalf}
        colors={awayTeam?.colors}
      />
    {/if}
    {#if bottomHalf.events.length > 0}
      <HalfInningPlayByPlay
        inningTitle={`Bottom ${ordinalNumber(number)}`}
        inningNumber={number}
        inning={bottomHalf}
        colors={homeTeam?.colors}
      />
    {/if}
  {/if}
  {#if renderAds && number % 3 === (reverseOrder ? 1 : 0)}
    <AditudeAdBanner
      divId={`plays-${number}`}
      slotId="pb-slot-banner"
      class="mx-auto"
      placeholderClass="w-[320px] h-[100px] mx-auto"
      onlyMobile
      lazy
    />
  {/if}
{/each}
