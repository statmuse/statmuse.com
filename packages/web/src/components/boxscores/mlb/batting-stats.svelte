<script lang="ts">
  import Grid from '@components/grid.svelte'
  import {
    formatMlbPosition,
    type GameraTeamReference,
  } from '@statmuse/core/gamera/index'
  import { orderBy, filter, find } from 'lodash-es'
  import {
    players,
    matchup,
    lineup as lineUp,
    stats,
    selectedId,
  } from './stores'
  import Panel from '@components/panel.svelte'
  import EntityLink from '@components/entity-link.svelte'
  import Image from '@components/image.svelte'

  export let teamKey: 'away' | 'home'
  export let final = false
  export let team: GameraTeamReference | undefined = undefined

  $: higlightPlayer = final ? undefined : $matchup[teamKey].player
  $: lineup = $lineUp[teamKey]
  $: splits = $stats[teamKey]?.splits
  $: totals = $stats[teamKey]?.stats

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

  $: aggregations = [
    {
      NAME: {
        display: 'Totals',
        value: 'Totals',
      },
      AB: totals?.['Batting-AtBats'] ?? {
        value: 0,
        display: '-',
      },
      R: totals?.['Batting-Runs'] ?? { value: 0, display: '-' },
      H: totals?.['Batting-Hits'] ?? { value: 0, display: '-' },
      RBI: totals?.['Batting-RunsBattedIn'] ?? {
        value: 0,
        display: '-',
      },
      BB: totals?.['Batting-Walks'] ?? {
        value: 0,
        display: '-',
      },
      K: totals?.['Batting-Strikeouts'] ?? {
        value: 0,
        display: '-',
      },
    },
  ]
</script>

<Panel class="!p-0">
  {#if team}
    <div class="px-3 pt-2">
      <EntityLink
        entity={team.entity}
        class="flex items-center gap-2 text-inherit"
      >
        <Image
          src={team.logoImageUrl ?? ''}
          alt={team.name ?? ''}
          width={60}
          height={60}
          class="w-4 h-4 object-contain"
        />
        {team.abbreviation}
      </EntityLink>
    </div>
  {/if}
  <Grid
    class="!border-none"
    textInherit
    disableSort
    data={{ columns, rows, aggregations }}
    stickyColumns={['NAME']}
    highlight={higlightPlayer
      ? { [higlightPlayer.usedName ?? '']: higlightPlayer.colors }
      : undefined}
    onRowClick={(row) => () =>
      selectedId.set({
        id: row.NAME?.meta?.id ?? 0,
        alignment: teamKey,
        type: 'batter',
      })}
  />
</Panel>
