<script lang="ts">
  import { battingSummary } from './stores'

  export let teamKey: 'away' | 'home'

  $: batting = $battingSummary[teamKey]
</script>

<div class="text-sm">
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
</div>
