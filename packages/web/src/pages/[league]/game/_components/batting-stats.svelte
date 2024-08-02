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
  export let playerMap: Record<number, GameraPlayerReference> = {}
  export let lineup: PlayerGameModel[] = []

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
      const player = playerMap[p.playerId]
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
            imageUrl:
              p.lineup.battingOrderSequence === 1 ? player.imageUrl : undefined,
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
</script>

<Grid data={{ columns, rows }} stickyColumns={['NAME']} />
