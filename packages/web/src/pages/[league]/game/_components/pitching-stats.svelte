<script lang="ts">
  import Grid from '@components/grid.svelte'
  import { orderBy, filter, find } from 'lodash-es'
  import { players, stats, lineup as lineUp } from './stores'
  import { getValue } from '@statmuse/core/gamera'

  export let teamKey: 'away' | 'home'

  $: lineup = $lineUp[teamKey]
  $: splits = $stats[teamKey]?.splits
  $: totals = $stats[teamKey]?.stats

  const columns = [
    {
      title: 'Pitchers',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'IP',
      type: 'number',
      rowItemKey: 'IP',
    },
    {
      title: 'H',
      type: 'number',
      rowItemKey: 'H',
    },
    {
      title: 'R',
      type: 'number',
      rowItemKey: 'R',
    },
    {
      title: 'ER',
      type: 'number',
      rowItemKey: 'ER',
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
      title: 'HR',
      type: 'number',
      rowItemKey: 'HR',
    },
    {
      title: 'ERA',
      type: 'number',
      rowItemKey: 'ERA',
    },
  ]

  $: rows = orderBy(
    filter(lineup, (p) => !!p.lineup.pitchingSequence),
    ['lineup.pitchingSequence'],
  )
    .map((p) => {
      const player = $players[p.playerId]
      const playerStats = find(splits, { playerId: p.playerId })

      if (player) {
        return {
          NAME: {
            display: player.usedName ?? '',
            value: player.usedName,
            meta: {
              id: player.id,
              shortDisplay: player.entity.shortDisplay,
              position:
                getValue(playerStats?.stats ?? {}, 'Pitching-Wins') > 0
                  ? '(W)'
                  : getValue(playerStats?.stats ?? {}, 'Pitching-Losses') > 0
                  ? '(L)'
                  : getValue(playerStats?.stats ?? {}, 'Pitching-Saves') > 0
                  ? '(S)'
                  : undefined,
            },
          },
          IP: playerStats?.stats?.['Pitching-InningsPitched'] ?? {
            value: 0,
            display: '-',
          },
          H: playerStats?.stats?.['Pitching-Hits'] ?? {
            value: 0,
            display: '-',
          },
          R: playerStats?.stats?.['Pitching-Runs'] ?? {
            value: 0,
            display: '-',
          },
          ER: playerStats?.stats?.['Pitching-EarnedRuns'] ?? {
            value: 0,
            display: '-',
          },
          BB: playerStats?.stats?.['Pitching-Walks'] ?? {
            value: 0,
            display: '-',
          },
          K: playerStats?.stats?.['Pitching-Strikeouts'] ?? {
            value: 0,
            display: '-',
          },
          HR: playerStats?.stats?.['Pitching-HomeRuns'] ?? {
            value: 0,
            display: '-',
          },
          ERA: playerStats?.stats?.['Pitching-EarnedRunAverage'] ?? {
            value: 0,
            display: '-',
          },
        }
      }
    })
    .filter((x) => !!x)

  $: aggregations = [
    {
      NAME: {
        display: 'Totals',
        value: 'Totals',
      },
      IP: totals?.['Pitching-InningsPitched'] ?? {
        value: 0,
        display: '-',
      },
      H: totals?.['Pitching-Hits'] ?? {
        value: 0,
        display: '-',
      },
      R: totals?.['Pitching-Runs'] ?? {
        value: 0,
        display: '-',
      },
      ER: totals?.['Pitching-EarnedRuns'] ?? {
        value: 0,
        display: '-',
      },
      BB: totals?.['Pitching-Walks'] ?? {
        value: 0,
        display: '-',
      },
      K: totals?.['Pitching-Strikeouts'] ?? {
        value: 0,
        display: '-',
      },
      HR: totals?.['Pitching-HomeRuns'] ?? {
        value: 0,
        display: '-',
      },
    },
  ]
</script>

<Grid
  textInherit
  disableSort
  data={{ columns, rows, aggregations }}
  stickyColumns={['NAME']}
/>
