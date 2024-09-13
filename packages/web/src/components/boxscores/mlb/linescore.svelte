<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import type {
    GameraPlayerReference,
    GameraTeamReference,
  } from '@statmuse/core/gamera/index'
  import AtBatCount from './at-bat-count.svelte'
  import OutsIndicator from './outs-indicator.svelte'
  import { max, range, some } from 'lodash-es'
  import EntityLink from '@components/entity-link.svelte'
  import {
    gameState,
    inningNumber,
    halfInning,
    matchup,
    atBat,
    runners,
    lineScore,
    stats,
    players,
    outs,
  } from './stores'

  export let awayTeam: GameraTeamReference
  export let homeTeam: GameraTeamReference
  export let displayMatchup: boolean = false
  export let final: boolean = false

  let winningPitcher: GameraPlayerReference | undefined
  let losingPitcher: GameraPlayerReference | undefined
  let savePitcher: GameraPlayerReference | undefined

  $: awayTeamModel = $gameState.gameData?.awayTeam
  $: homeTeamModel = $gameState.gameData?.homeTeam

  $: maxInnings = max([9, $lineScore.away?.length, $lineScore.home?.length])

  $: totals = [
    [
      'R',
      $stats.away?.stats?.['Batting-Runs']?.display,
      $stats.home?.stats?.['Batting-Runs']?.display,
    ],
    [
      'H',
      $stats.away?.stats?.['Batting-Hits']?.display,
      $stats.home?.stats?.['Batting-Hits']?.display,
    ],
    [
      'E',
      $stats.away?.stats?.['Fielding-Errors']?.display,
      $stats.home?.stats?.['Fielding-Errors']?.display,
    ],
  ]

  $: {
    if (final) {
      const splits = [
        ...($stats.away?.splits ?? []),
        ...($stats.home?.splits ?? []),
      ]

      const winningPitcherId = splits.find(
        (s) => s.stats?.['Pitching-Wins']?.value > 0,
      )?.playerId
      const losingPitcherId = splits.find(
        (s) => s.stats?.['Pitching-Losses']?.value > 0,
      )?.playerId
      const savePitcherId = splits.find(
        (s) => s.stats?.['Pitching-Saves']?.value > 0,
      )?.playerId

      winningPitcher = $players[winningPitcherId ?? 0]
      losingPitcher = $players[losingPitcherId ?? 0]
      savePitcher = $players[savePitcherId ?? 0]
    }
  }
</script>

<Panel class="!p-0">
  <div class="flex-1 p-2 flex flex-nowrap items-end">
    <div class="pr-1">
      <EntityLink
        entity={awayTeam.entity}
        class="flex gap-2 items-center text-inherit"
      >
        <Image
          src={awayTeam.logoImageUrl ?? ''}
          alt={awayTeam.name ?? ''}
          width={60}
          height={60}
          class="w-4 h-4 object-contain"
        />
        {awayTeam.abbreviation}
      </EntityLink>
      <EntityLink
        entity={homeTeam.entity}
        class="flex gap-2 items-center text-inherit"
      >
        <Image
          src={homeTeam.logoImageUrl ?? ''}
          alt={homeTeam.name ?? ''}
          width={60}
          height={60}
          class="w-4 h-4 object-contain"
        />
        {homeTeam.abbreviation}
      </EntityLink>
    </div>
    <div
      class="flex-1 flex no-scrollbar overflow-scroll"
      style="justify-content: safe end;"
    >
      {#each range(maxInnings ?? 9) as inning (inning)}
        <div class="text-gray-5 px-1.5">
          <p>{inning + 1}</p>
          <p class="relative h-6">
            {#if inning + 1 === $inningNumber && $halfInning?.half === 'top' && !final}
              <span
                class="w-6 h-6 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={`background: ${awayTeam.colors.backgroundColor}`}
              />
            {/if}
            <span
              class="relative"
              style={inning + 1 === $inningNumber &&
              $halfInning?.half === 'top' &&
              !final
                ? `color: ${awayTeam.colors.foregroundColor}`
                : ''}
            >
              {$lineScore.away?.[inning] !== undefined
                ? $lineScore.away[inning].runs
                : ''}
            </span>
          </p>
          <p class="relative h-6">
            {#if inning + 1 === $inningNumber && $halfInning?.half === 'bottom' && !final}
              <span
                class="w-6 h-6 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={`background: ${homeTeam.colors.backgroundColor}`}
              />
            {/if}
            <span
              class="relative"
              style={inning + 1 === $inningNumber &&
              $halfInning?.half === 'bottom' &&
              !final
                ? `color: ${homeTeam.colors.foregroundColor}`
                : ''}
            >
              {$lineScore.home?.[inning] !== undefined
                ? $lineScore.home[inning].runs
                : ''}
            </span>
          </p>
        </div>
      {/each}
    </div>
    <div class="flex">
      {#each totals as total, index (total)}
        <div class="px-1.5" class:text-gray-5={index !== 0}>
          <p>{total[0]}</p>
          <p
            class={final && awayTeamModel?.gameResult === 'win'
              ? 'text-gray-2 dark:text-gray-7'
              : ''}
            class:font-semibold={final &&
              awayTeamModel?.gameResult === 'win' &&
              index === 0}
          >
            {total[1] ?? '0'}
          </p>
          <p
            class={final && homeTeamModel?.gameResult === 'win'
              ? 'text-gray-2 dark:text-gray-7'
              : ''}
            class:font-semibold={final &&
              homeTeamModel?.gameResult === 'win' &&
              index === 0}
          >
            {total[2] ?? '0'}
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
        <p class="text-gray-5 text-sm">
          {$matchup.away.type === 'batter' ? 'Batting' : 'Pitching'}
        </p>
        <p>
          {$matchup.away.player?.entity.shortDisplay ??
            $matchup.away.player?.usedName}
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <AtBatCount
          pitches={$atBat?.events.filter((e) => e.type === 'pitch') ?? []}
          indicator
        />
        <Icon
          name="baseball-diamond"
          class="w-9"
          fillFirstBase={some($runners, (r) => r.endingBase === 1)}
          fillSecondBase={some($runners, (r) => r.endingBase === 2)}
          fillThirdBase={some($runners, (r) => r.endingBase === 3)}
        />
        <OutsIndicator vertical outs={$outs} />
      </div>
      <div class="text-right">
        <p class="text-gray-5 text-sm">
          {$matchup.home.type === 'batter' ? 'Batting' : 'Pitching'}
        </p>
        <p>
          {$matchup.home.player?.entity.shortDisplay ??
            $matchup.home.player?.usedName}
        </p>
      </div>
    </div>
  {/if}
  {#if final}
    <div
      class="px-3 py-2 flex justify-evenly items-center text-center gap-3 border-t border-gray-6 dark:border-gray-4"
    >
      {#if winningPitcher}
        <div>
          <span class="text-gray-5">W:</span>
          <EntityLink entity={winningPitcher.entity} class="text-inherit">
            {winningPitcher.entity.shortDisplay ?? winningPitcher.usedName}
          </EntityLink>
        </div>
      {/if}
      {#if losingPitcher}
        <div>
          <span class="text-gray-5">L:</span>
          <EntityLink entity={losingPitcher.entity} class="text-inherit">
            {losingPitcher.entity.shortDisplay ?? losingPitcher.usedName}
          </EntityLink>
        </div>
      {/if}
      {#if savePitcher}
        <div>
          <span class="text-gray-5">S:</span>
          <EntityLink entity={savePitcher.entity} class="text-inherit">
            {savePitcher.entity.shortDisplay ?? savePitcher.usedName}
          </EntityLink>
        </div>
      {/if}
    </div>
  {/if}
</Panel>
