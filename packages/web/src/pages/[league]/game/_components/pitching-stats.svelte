<script lang="ts">
  import Grid from '@components/grid.svelte'
  import { orderBy, filter, find } from 'lodash-es'
  import { players, stats, lineup as lineUp } from './stores'

  export let teamKey: 'away' | 'home'

  $: lineup = $lineUp[teamKey]
  $: splits = $stats[teamKey]?.splits

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
      const player = $players?.[p.playerId]
      const playerStats = find(splits, { playerId: p.playerId })

      if (player) {
        return {
          NAME: {
            display: player.usedName ?? '',
            value: player.usedName,
            meta: {
              id: player.id,
              shortDisplay: player.entity.shortDisplay,
              position: p.lineup.pitchingSequence === 1 ? 'SP' : undefined,
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
</script>

<Grid
  textInherit
  disableSort
  data={{ columns, rows }}
  stickyColumns={['NAME']}
/>
