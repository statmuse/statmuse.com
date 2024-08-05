<script lang="ts">
  import Grid from '@components/grid.svelte'
  import {
    formatMlbPosition,
    type GameraPlayerReference,
    type PlayerGameModel,
    type StatModel,
  } from '@statmuse/core/gamera'
  import { orderBy, filter, find } from 'lodash-es'

  export let splits: {
    splitType?: string
    playerId: number
    stats?: StatModel
  }[] = []
  export let playerMap: Record<number, GameraPlayerReference> | undefined
  export let lineup: PlayerGameModel[] = []
  export let playerAb: { playerId: number; handedness: string } | undefined

  const higlightPlayer = playerMap?.[playerAb?.playerId ?? 0]

  const columns = [
    {
      title: 'Batters',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'AB',
      type: 'number',
      rowItemKey: 'AB',
    },
    {
      title: 'R',
      type: 'number',
      rowItemKey: 'R',
    },
    {
      title: 'H',
      type: 'number',
      rowItemKey: 'H',
    },
    {
      title: 'RBI',
      type: 'number',
      rowItemKey: 'RBI',
    },
    {
      title: 'BB',
      type: 'number',
      rowItemKey: 'BB',
    },
    {
      title: 'K',
      type: 'number',
      rowItemKey: 'K',
    },
    {
      title: 'AVG',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'OBP',
      type: 'number',
      rowItemKey: 'OBP',
    },
    {
      title: 'SLG',
      type: 'number',
      rowItemKey: 'SLG',
    },
  ]

  const rows = orderBy(
    filter(lineup, (p) => p.lineup.battingOrder),
    ['lineup.battingOrder', 'lineup.battingOrderSequence'],
  )
    .map((p) => {
      const player = playerMap?.[p.playerId]
      const playerStats = find(splits, { playerId: p.playerId })

      if (player && playerStats) {
        return {
          NAME: {
            display: player.usedName,
            value: player.usedName,
            entity: player.entity,
            position: p.lineup.positions
              ?.map((x) => formatMlbPosition(x))
              .join('-'),
          },
          AB: playerStats.stats?.['Batting-AtBats'],
          R: playerStats.stats?.['Batting-Runs'],
          H: playerStats.stats?.['Batting-Hits'],
          RBI: playerStats.stats?.['Batting-RunsBattedIn'],
          BB: playerStats.stats?.['Batting-Walks'],
          K: playerStats.stats?.['Batting-Strikeouts'],
          AVG: playerStats.stats?.['Batting-BattingAverage'],
          OBP: playerStats.stats?.['Batting-OnBasePercentage'],
          SLG: playerStats.stats?.['Batting-SluggingPercentage'],
        }
      }
    })
    .filter((x) => !!x)

  const doubles = splits
    .filter((s) => s.stats?.['Batting-Doubles']?.value > 0)
    .map((s) => {
      const player = playerMap?.[s.playerId]
      return {
        name: player?.entity.shortDisplay,
        total: s.stats?.['Batting-Doubles']?.value,
      }
    })
  const triples = splits
    .filter((s) => s.stats?.['Batting-Triples']?.value > 0)
    .map((s) => {
      const player = playerMap?.[s.playerId]
      return {
        name: player?.entity.shortDisplay,
        total: s.stats?.['Batting-Triples']?.value,
      }
    })
  const homeRun = splits
    .filter((s) => s.stats?.['Batting-HomeRuns']?.value > 0)
    .map((s) => {
      const player = playerMap?.[s.playerId]
      return {
        name: player?.entity.shortDisplay,
        total: s.stats?.['Batting-HomeRuns']?.value,
      }
    })
  const rbis = splits
    .filter((s) => s.stats?.['Batting-RunsBattedIn']?.value > 0)
    .map((s) => {
      const player = playerMap?.[s.playerId]
      return {
        name: player?.entity.shortDisplay,
        total: s.stats?.['Batting-RunsBattedIn']?.value,
      }
    })
</script>

<div class="space-y-3">
  <Grid
    data={{ columns, rows }}
    stickyColumns={['NAME']}
    highlight={higlightPlayer
      ? { [higlightPlayer.usedName ?? '']: higlightPlayer.colors }
      : undefined}
  />

  <div class="text-sm">
    <p class="mb-1.5">Batting</p>
    {#if doubles.length > 0}
      <p>
        2B:
        <span class="text-gray-5">
          {doubles
            .map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if triples.length > 0}
      <p>
        3B:
        <span class="text-gray-5">
          {triples
            .map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if homeRun.length > 0}
      <p>
        HR:
        <span class="text-gray-5">
          {homeRun
            .map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
    {#if rbis.length > 0}
      <p>
        RBI:
        <span class="text-gray-5">
          {rbis
            .map((p) => `${p.name}${p?.total > 1 ? ` ${p.total}` : ''}`)
            .join(', ')}
        </span>
      </p>
    {/if}
  </div>
</div>
