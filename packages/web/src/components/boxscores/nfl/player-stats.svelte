<script lang="ts">
  import Grid from '@components/grid.svelte'
  import { getValue } from '@statmuse/core/gamera'
  import { playerStats } from './stores'

  export let teamKey: 'away' | 'home'

  const passingColumns = [
    {
      title: 'Passing',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'Comp',
      type: 'number',
      rowItemKey: 'COMP',
    },
    {
      title: 'Yds',
      type: 'number',
      rowItemKey: 'YDS',
    },
    {
      title: 'Avg',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
    {
      title: 'Int',
      type: 'number',
      rowItemKey: 'INT',
    },
  ]

  const rushingColumns = [
    {
      title: 'Rushing',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'Att',
      type: 'number',
      rowItemKey: 'ATT',
    },
    {
      title: 'Yds',
      type: 'number',
      rowItemKey: 'YDS',
    },
    {
      title: 'Avg',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
    {
      title: 'Long',
      type: 'number',
      rowItemKey: 'LNG',
    },
  ]

  const receivingColumns = [
    {
      title: 'Receiving',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'Rec',
      type: 'number',
      rowItemKey: 'REC',
    },
    {
      title: 'Yds',
      type: 'number',
      rowItemKey: 'YDS',
    },
    {
      title: 'Avg',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
    {
      title: 'Long',
      type: 'number',
      rowItemKey: 'LNG',
    },
  ]
  const kickingColumns = [
    {
      title: 'Kicking',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'FG',
      type: 'number',
      rowItemKey: 'FG',
    },
    {
      title: 'Long',
      type: 'number',
      rowItemKey: 'LNG',
    },
    {
      title: 'XP',
      type: 'number',
      rowItemKey: 'XP',
    },
    {
      title: 'Pts',
      type: 'number',
      rowItemKey: 'PTS',
    },
  ]

  const kickReturnColumns = [
    {
      title: 'Kick Return',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'No',
      type: 'number',
      rowItemKey: 'NO',
    },
    {
      title: 'Yds',
      type: 'number',
      rowItemKey: 'YDS',
    },
    {
      title: 'Avg',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'Long',
      type: 'number',
      rowItemKey: 'LNG',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
  ]

  const puntReturnColumns = [
    {
      title: 'Punt Return',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'No',
      type: 'number',
      rowItemKey: 'NO',
    },
    {
      title: 'Yds',
      type: 'number',
      rowItemKey: 'YDS',
    },
    {
      title: 'Avg',
      type: 'number',
      rowItemKey: 'AVG',
    },
    {
      title: 'Long',
      type: 'number',
      rowItemKey: 'LNG',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
  ]

  const defenseColumns = [
    {
      title: 'Defense',
      type: 'string',
      rowItemKey: 'NAME',
    },
    {
      title: 'Tackles',
      type: 'number',
      rowItemKey: 'COMB',
    },
    {
      title: 'TFL',
      type: 'number',
      rowItemKey: 'TFL',
    },
    {
      title: 'Sacks',
      type: 'number',
      rowItemKey: 'SCK',
    },
    {
      title: 'Int',
      type: 'number',
      rowItemKey: 'INT',
    },
    {
      title: 'FF',
      type: 'number',
      rowItemKey: 'FF',
    },
    {
      title: 'TD',
      type: 'number',
      rowItemKey: 'TD',
    },
  ]

  $: stats = Object.entries($playerStats[teamKey]?.statsLookup ?? {})

  $: passingRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') && getValue(model, 'Passing-Attempts') > 0,
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        COMP: model['Passing-Attempts']
          ? {
              display: `${model['Passing-Completions']?.display}/${model['Passing-Attempts'].display}`,
              value: getValue(model, 'Passing-Completions'),
            }
          : { display: '0/0', value: 0 },
        YDS: model['Passing-Yards'] ?? { display: '0', value: 0 },
        AVG: model['Passing-YardsPerAttempt'] ?? { display: '0', value: 0 },
        TD: model['Passing-Touchdowns'] ?? { display: '0', value: 0 },
        INT: model['Passing-Interceptions'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.YDS.value - a.YDS.value)

  $: rushingRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') && getValue(model, 'Rushing-Attempts') > 0,
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        ATT: model['Rushing-Attempts'] ?? { display: '0', value: 0 },
        YDS: model['Rushing-Yards'] ?? { display: '0', value: 0 },
        AVG: model['Rushing-YardsPerAttempt'] ?? { display: '0', value: 0 },
        TD: model['Rushing-Touchdowns'] ?? { display: '0', value: 0 },
        LNG: model['Rushing-LongestRush'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.YDS.value - a.YDS.value)

  $: receivingRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') && getValue(model, 'Receiving-Targets') > 0,
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        REC: model['Receiving-Targets']
          ? {
              display: `${model['Receiving-Receptions']?.display}/${model['Receiving-Targets']?.display}`,
              value: getValue(model, 'Receiving-Receptions'),
            }
          : { display: '0/0', value: 0 },
        YDS: model['Receiving-Yards'] ?? { display: '0', value: 0 },
        AVG: model['Receiving-YardsPerReception'] ?? { display: '0', value: 0 },
        TD: model['Receiving-Touchdowns'] ?? { display: '0', value: 0 },
        LNG: model['Receiving-LongestReception'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.YDS.value - a.YDS.value)

  $: kickingRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') &&
        (getValue(model, 'Kicking-FieldGoalsAttempted') > 0 ||
          getValue(model, 'Kicking-ExtraPointsAttempted') > 0),
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        FG: model['Kicking-FieldGoalsAttempted']
          ? {
              display: `${model['Kicking-FieldGoalsMade']?.display}/${model['Kicking-FieldGoalsAttempted']?.display}`,
              value: getValue(model, 'Kicking-FieldGoalsMade'),
            }
          : { display: '0/0', value: 0 },
        LNG: model['Kicking-LongestFieldGoal'] ?? { display: '0', value: 0 },
        XP: model['Kicking-ExtraPointsAttempted']
          ? {
              display: `${model['Kicking-ExtraPointsMade']?.display}/${model['Kicking-ExtraPointsAttempted']?.display}`,
              value: getValue(model, 'Kicking-ExtraPointsMade'),
            }
          : { display: '0/0', value: 0 },
        PTS: model['Kicking-KickingPoints'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.PTS.value - a.PTS.value)

  $: kickReturnRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') && getValue(model, 'Kickoff-Returns') > 0,
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        NO: model['Kickoff-Returns'] ?? { display: '0', value: 0 },
        YDS: model['Kickoff-ReturnYards'] ?? { display: '0', value: 0 },
        AVG: model['Kickoff-ReturnYardsAverage'] ?? { display: '0', value: 0 },
        LNG: model['Kickoff-LongestReturns'] ?? { display: '0', value: 0 },
        TD: model['Kickoff-ReturnTouchdowns'] ?? { display: '0', value: 0 },
      }
    })

  $: puntReturnRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') && getValue(model, 'Kickoff-Returns') > 0,
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        NO: model['PuntReturn-PuntReturns'] ?? { display: '0', value: 0 },
        YDS: model['PuntReturn-Yards'] ?? { display: '0', value: 0 },
        AVG: model['PuntReturn-YardsPerPuntReturn'] ?? {
          display: '0',
          value: 0,
        },
        LNG: model['PuntReturn-LongestReturn'] ?? { display: '0', value: 0 },
        TD: model['PuntReturn-Touchdowns'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.YDS.value - a.YDS.value)

  $: defenseRows = stats
    .filter(
      ([key, model]) =>
        key.includes('p-') &&
        (getValue(model, 'Defensive-CombinedTackles') > 0 ||
          getValue(model, 'Defensive-Interceptions') > 0 ||
          getValue(model, 'Defensive-Touchdowns') > 0),
    )
    .map(([, model]) => {
      return {
        NAME: {
          display: 'name',
          value: 'name',
        },
        COMB: model['Defensive-CombinedTackles']
          ? {
              display: `${model['Defensive-CombinedTackles'].display}-${model['Defensive-Tackles']?.display}`,
              value: getValue(model, 'Defensive-CombinedTackles'),
            }
          : { display: '0-0', value: 0 },
        TFL: model['Defensive-TacklesForLoss'] ?? { display: '0', value: 0 },
        SCK: model['Defensive-Sacks'] ?? { display: '0', value: 0 },
        INT: model['Defensive-Interceptions'] ?? { display: '0', value: 0 },
        FF: model['Defensive-ForcedFumbles'] ?? { display: '0', value: 0 },
        TD: model['Defensive-Touchdowns'] ?? { display: '0', value: 0 },
      }
    })
    .sort((a, b) => b.COMB.value - a.COMB.value)
</script>

<Grid
  textInherit
  disableSort
  data={{ rows: passingRows, columns: passingColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: rushingRows, columns: rushingColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: receivingRows, columns: receivingColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: kickingRows, columns: kickingColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: kickReturnRows, columns: kickReturnColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: puntReturnRows, columns: puntReturnColumns }}
  stickyColumns={['NAME']}
/>

<Grid
  textInherit
  disableSort
  data={{ rows: defenseRows, columns: defenseColumns }}
  stickyColumns={['NAME']}
/>
