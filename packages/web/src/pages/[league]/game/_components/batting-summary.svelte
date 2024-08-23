<script lang="ts">
  import { players, stats } from './stores'

  export let teamKey: 'away' | 'home'

  $: splits = $stats[teamKey]?.splits

  $: doubles = splits
    ?.filter((s) => s.stats?.['Batting-Doubles']?.value > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: s.stats?.['Batting-Doubles']?.value,
      }
    })
  $: triples = splits
    ?.filter((s) => s.stats?.['Batting-Triples']?.value > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: s.stats?.['Batting-Triples']?.value,
      }
    })
  $: homeRun = splits
    ?.filter((s) => s.stats?.['Batting-HomeRuns']?.value > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: s.stats?.['Batting-HomeRuns']?.value,
      }
    })
  $: rbis = splits
    ?.filter((s) => s.stats?.['Batting-RunsBattedIn']?.value > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: s.stats?.['Batting-RunsBattedIn']?.value,
      }
    })
</script>

<div class="text-sm">
  <p class="mb-1.5">Batting</p>
  {#if doubles?.length > 0}
    <p>
      2B:
      <span class="text-gray-5">
        {doubles
          ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
          .join(', ')}
      </span>
    </p>
  {/if}
  {#if triples?.length > 0}
    <p>
      3B:
      <span class="text-gray-5">
        {triples
          ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
          .join(', ')}
      </span>
    </p>
  {/if}
  {#if homeRun?.length > 0}
    <p>
      HR:
      <span class="text-gray-5">
        {homeRun
          ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
          .join(', ')}
      </span>
    </p>
  {/if}
  {#if rbis?.length > 0}
    <p>
      RBI:
      <span class="text-gray-5">
        {rbis
          ?.map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
          .join(', ')}
      </span>
    </p>
  {/if}
</div>
