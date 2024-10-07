<script lang="ts">
  import TeamPanel from '../common/team-panel.svelte'
  import { teamStats } from './stores'
  import {
    getDisplay,
    getValue,
    type GameraDomain,
    type GameraTeamReference,
    type NflStatKey,
    type StatModel,
  } from '@statmuse/core/gamera'

  export let domain: GameraDomain | undefined
  export let awayTeam: GameraTeamReference | undefined
  export let homeTeam: GameraTeamReference | undefined

  // const compare = <K extends NflStatKey>(
  //   x: StatModel<K>,
  //   y: StatModel<K>,
  //   k: K,
  //   c: 'gt' | 'lt' = 'gt',
  // ) => {
  //   return c === 'gt'
  //     ? getValue(x, k) >= getValue(y, k)
  //     : getValue(x, k) < getValue(y, k)
  // }

  $: awayTeamStats =
    $teamStats.away?.statsLookup[$teamStats.away?.statsLookupKey ?? '']
  $: homeTeamStats =
    $teamStats.home?.statsLookup[$teamStats.home?.statsLookupKey ?? '']
</script>

<TeamPanel {domain} {awayTeam} {homeTeam} title="Team Stats">
  <div class="divide-y divide-gray-6 dark:divide-gray-4 *:px-1 *:py-1">
    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getValue(awayTeamStats ?? {}, 'Passing-Yards') +
          getValue(awayTeamStats ?? {}, 'Rushing-Yards') -
          getValue(awayTeamStats ?? {}, 'Passing-SackYards')}
      </p>
      <p class="text-gray-5">Total Yds</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getValue(homeTeamStats ?? {}, 'Passing-Yards') +
          getValue(homeTeamStats ?? {}, 'Rushing-Yards') -
          getValue(homeTeamStats ?? {}, 'Passing-SackYards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getValue(awayTeamStats ?? {}, 'Passing-Yards') -
          getValue(awayTeamStats ?? {}, 'Passing-SackYards')}
      </p>
      <p class="text-gray-5">Pass Yds</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getValue(homeTeamStats ?? {}, 'Passing-Yards') -
          getValue(homeTeamStats ?? {}, 'Passing-SackYards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Rush Yds</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Total Drives (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Total Plays (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Yards Per Play (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Yards Per Pass (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Yards Per Rush (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Possession (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Biggest Lead (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>
  </div>
</TeamPanel>
<TeamPanel>
  <div class="divide-y divide-gray-6 dark:divide-gray-4 *:px-1 *:py-1">
    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Passing-Yards')}
      </p>
      <p class="text-gray-5">1st Downs (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Passing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Passing-Yards')}
      </p>
      <p class="text-gray-5">Passing 1st Downs (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Passing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Rushing 1st Downs (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">1st Downs from Penalties (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">3rd Down (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">4th Down (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Red Zone (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>
  </div>
</TeamPanel>
<TeamPanel>
  <div class="divide-y divide-gray-6 dark:divide-gray-4 *:px-1 *:py-1">
    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Punting-Punts')}
      </p>
      <p class="text-gray-5">Punts</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Punting-Punts')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getValue(awayTeamStats ?? {}, 'Passing-Interceptions') +
          getValue(awayTeamStats ?? {}, 'FumblesLost')}
      </p>
      <p class="text-gray-5">Turnovers</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getValue(homeTeamStats ?? {}, 'Passing-Interceptions') +
          getValue(homeTeamStats ?? {}, 'FumblesLost')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Passing-Interceptions')}
      </p>
      <p class="text-gray-5">Interceptions Thrown</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Passing-Interceptions')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'FumblesLost')}
      </p>
      <p class="text-gray-5">Fumbles Lost</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'FumblesLost')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">Penalties (Yards) (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>
  </div>
</TeamPanel>
<TeamPanel>
  <div class="divide-y divide-gray-6 dark:divide-gray-4 *:px-1 *:py-1">
    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Defensive-Sacks')}
      </p>
      <p class="text-gray-5">Sacks</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Defensive-Sacks')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Defensive-TacklesForLoss')}
      </p>
      <p class="text-gray-5">Tackles For Loss</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Defensive-TacklesForLoss')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getDisplay(awayTeamStats ?? {}, 'Rushing-Yards')}
      </p>
      <p class="text-gray-5">QB Hits (wrong)</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getDisplay(homeTeamStats ?? {}, 'Rushing-Yards')}
      </p>
    </div>

    <div class="flex justify-center relative">
      <p class="absolute top-1 left-1 px-2 rounded-2xl">
        {getValue(awayTeamStats ?? {}, 'Defensive-Touchdowns') +
          getValue(awayTeamStats ?? {}, 'Kickoff-ReturnTouchdowns') +
          getValue(awayTeamStats ?? {}, 'PuntReturn-Touchdowns')}
      </p>
      <p class="text-gray-5">D/ST TD</p>
      <p class="absolute top-1 right-1 px-2 rounded-2xl">
        {getValue(homeTeamStats ?? {}, 'Defensive-Touchdowns') +
          getValue(homeTeamStats ?? {}, 'Kickoff-ReturnTouchdowns') +
          getValue(homeTeamStats ?? {}, 'PuntReturn-Touchdowns')}
      </p>
    </div>
  </div>
</TeamPanel>
