<script lang="ts">
  import { battingSummary, baseRunningSummary } from './stores'

  export let teamKey: 'away' | 'home'

  $: batting = $battingSummary[teamKey]
  $: baserunning = $baseRunningSummary[teamKey]
</script>

<div class="text-sm px-3">
  {#if batting.doubles || batting.triples || batting.homeRuns || batting.rbis}
    <p class="mb-1.5">Batting</p>
    {#if batting.doubles}
      <p>
        2B:
        <span class="text-gray-5">
          {batting.doubles
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if batting.triples}
      <p>
        3B:
        <span class="text-gray-5">
          {batting.triples
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if batting.homeRuns}
      <p>
        HR:
        <span class="text-gray-5">
          {batting.homeRuns
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if batting.rbis}
      <p>
        RBI:
        <span class="text-gray-5">
          {batting.rbis
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
  {/if}
  {#if baserunning.stolenBases || baserunning.caughtStealing}
    <p class="my-1.5">Baserunning</p>
    {#if baserunning.stolenBases}
      <p>
        SB:
        <span class="text-gray-5">
          {baserunning.stolenBases
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if baserunning.caughtStealing}
      <p>
        CS:
        <span class="text-gray-5">
          {baserunning.caughtStealing
            ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
  {/if}
</div>
