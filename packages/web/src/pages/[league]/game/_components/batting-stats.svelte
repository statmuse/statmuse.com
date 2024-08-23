<script lang="ts">
  import Grid from '@components/grid.svelte'
  import { formatMlbPosition } from '@statmuse/core/gamera/index'
  import { orderBy, filter, find } from 'lodash-es'
  import { players, matchup, lineup as lineUp, stats } from './stores'

  export let teamKey: 'away' | 'home'
  export let final = false

  $: higlightPlayer = final ? undefined : $matchup[teamKey].player
  $: lineup = $lineUp[teamKey]
  $: splits = $stats[teamKey]?.splits

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

  $: rows = orderBy(
    filter(lineup, (p) => !!p.lineup.battingOrder),
    ['lineup.battingOrder', 'lineup.battingOrderSequence'],
  )
    .map((p) => {
      const player = $players[p.playerId]
      const playerStats = find(splits, { playerId: p.playerId ?? 0 })

      if (player) {
        return {
          NAME: {
            display: player.usedName ?? '',
            value: player.usedName,
            meta: {
              id: player.id,
              shortDisplay: player.entity.shortDisplay,
              position: p.lineup.positions
                ?.map((x) => formatMlbPosition(x))
                .join('-'),
              padding: p.lineup.battingOrderSequence !== 1,
            },
          },
          AB: playerStats?.stats?.['Batting-AtBats'] ?? {
            value: 0,
            display: '-',
          },
          R: playerStats?.stats?.['Batting-Runs'] ?? { value: 0, display: '-' },
          H: playerStats?.stats?.['Batting-Hits'] ?? { value: 0, display: '-' },
          RBI: playerStats?.stats?.['Batting-RunsBattedIn'] ?? {
            value: 0,
            display: '-',
          },
          BB: playerStats?.stats?.['Batting-Walks'] ?? {
            value: 0,
            display: '-',
          },
          K: playerStats?.stats?.['Batting-Strikeouts'] ?? {
            value: 0,
            display: '-',
          },
          AVG: playerStats?.stats?.['Batting-BattingAverage'] ?? {
            value: 0,
            display: '-',
          },
          OBP: playerStats?.stats?.['Batting-OnBasePercentage'] ?? {
            value: 0,
            display: '-',
          },
          SLG: playerStats?.stats?.['Batting-SluggingPercentage'] ?? {
            value: 0,
            display: '-',
          },
        }
      }
    })
    .filter((x) => !!x)
</script>

<Grid
  textInherit
  disableSort
  data={{ columns, rows }}
  stickyColumns={['NAME']}
  highlight={higlightPlayer
    ? { [higlightPlayer.usedName ?? '']: higlightPlayer.colors }
    : undefined}
/>
