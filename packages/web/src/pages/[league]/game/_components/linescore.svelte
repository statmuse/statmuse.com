<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import type {
    GameraTeamReference,
    InningAtBatEvent,
    Runner,
    TeamGameModel,
  } from '@statmuse/core/gamera'
  import AtBatCount from './at-bat-count.svelte'
  import OutsIndicator from './outs-indicator.svelte'
  import { max, range, some } from 'lodash-es'

  export let awayTeam: GameraTeamReference
  export let homeTeam: GameraTeamReference
  export let awayTeamModel: TeamGameModel
  export let homeTeamModel: TeamGameModel
  export let displayMatchup: boolean = false
  export let final: boolean = false

  export let outs: number
  export let balls: number
  export let strikes: number
  export let runners: Runner[]

  export let atBat: InningAtBatEvent | undefined

  const maxInnings = max([
    9,
    awayTeamModel.lineScore?.length,
    homeTeamModel.lineScore?.length,
  ])

  const totals = [
    [
      'R',
      awayTeamModel.stats?.stats['Batting-Runs']?.display,
      homeTeamModel.stats?.stats['Batting-Runs']?.display,
    ],
    [
      'H',
      awayTeamModel.stats?.stats['Batting-Hits']?.display,
      homeTeamModel.stats?.stats['Batting-Hits']?.display,
    ],
    ['E', 0, 0],
  ]
</script>

<Panel class="!p-0">
  <div class="p-2 flex flex-nowrap">
    <div class="self-end pr-1">
      <div class="flex gap-1 items-center">
        <Image
          src={awayTeam.logoImageUrl ?? ''}
          alt={awayTeam.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        {awayTeam.abbreviation}
      </div>
      <div class="flex gap-1 items-center">
        <Image
          src={homeTeam.logoImageUrl ?? ''}
          alt={homeTeam.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        {homeTeam.abbreviation}
      </div>
    </div>
    <div
      class="flex-1 flex no-scrollbar overflow-scroll"
      style="justify-content: safe end;"
    >
      {#each range(maxInnings ?? 9) as inning (inning)}
        <div class="text-gray-5 px-1.5">
          <p>{inning + 1}</p>
          <p>
            {awayTeamModel?.lineScore[inning] !== undefined
              ? awayTeamModel?.lineScore[inning].runs
              : ''}
          </p>
          <p>
            {homeTeamModel?.lineScore[inning] !== undefined
              ? homeTeamModel?.lineScore[inning].runs
              : ''}
          </p>
        </div>
      {/each}
    </div>
    <div class="flex">
      {#each totals as inning, index (inning)}
        <div class="px-1.5" class:text-gray-5={index !== 0}>
          <p>{inning[0]}</p>
          <p
            class={final && awayTeamModel.gameResult === 'win'
              ? 'text-gray-2 dark:text-gray-7'
              : ''}
            class:font-semibold={awayTeamModel.gameResult === 'win' &&
              index === 0}
          >
            {inning[1] !== undefined ? inning[1] : ''}
          </p>
          <p
            class={final && homeTeamModel.gameResult === 'win'
              ? 'text-gray-2 dark:text-gray-7'
              : ''}
            class:font-semibold={homeTeamModel.gameResult === 'win' &&
              index === 0}
          >
            {inning[2] !== undefined ? inning[2] : ''}
          </p>
        </div>
      {/each}
    </div>
  </div>
  {#if displayMatchup}
    <div
      class="px-3 py-2 flex items-center justify-between border-t border-gray-6 dark:border-gray-4"
    >
      <div>
        <p class="text-gray-5 text-sm">Batting</p>
        <p>A. Judge</p>
      </div>
      <div class="flex items-center gap-2.5">
        <AtBatCount
          {balls}
          {strikes}
          pitches={atBat?.events.filter((e) => e.type === 'pitch') ?? []}
          indicator
        />
        <Icon
          name="baseball-diamond"
          class="w-9"
          fillFirstBase={some(runners, (r) => r.startingBase === 1)}
          fillSecondBase={some(runners, (r) => r.startingBase === 2)}
          fillThirdBase={some(runners, (r) => r.startingBase === 3)}
        />
        <OutsIndicator {outs} vertical />
      </div>
      <div class="text-right">
        <p class="text-gray-5 text-sm">Pitching</p>
        <p>P. Skenes</p>
      </div>
    </div>
  {/if}
</Panel>
