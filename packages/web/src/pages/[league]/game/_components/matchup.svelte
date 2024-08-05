<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import {
    type GameraTeamReference,
    type GameraPlayerReference,
    type Runner,
    formatMlbPosition,
    type TeamGameModel,
  } from '@statmuse/core/gamera'
  import OutsIndicator from './outs-indicator.svelte'
  import AtBatCount from './at-bat-count.svelte'
  import { last, some } from 'lodash-es'

  export let homeTeam: GameraTeamReference
  export let awayTeam: GameraTeamReference

  export let awayTeamModel: TeamGameModel
  export let homeTeamModel: TeamGameModel

  export let playerMap: Record<number, GameraPlayerReference> | undefined

  export let awayPlayerAb: { playerId: number; handedness: string } | undefined
  export let homePlayerAb: { playerId: number; handedness: string } | undefined

  export let halfInning: 'top' | 'bottom'
  export let balls: number
  export let strikes: number
  export let outs: number
  export let runners: Runner[]

  const awayPlayer = playerMap?.[awayPlayerAb?.playerId ?? 0]
  const homePlayer = playerMap?.[homePlayerAb?.playerId ?? 0]

  const awayPosition = last(
    awayTeamModel.players?.find((p) => p.playerId === awayPlayer?.id)?.lineup
      .positions,
  )
  const homePosition = last(
    homeTeamModel.players?.find((p) => p.playerId === homePlayer?.id)?.lineup
      .positions,
  )

  const awayPlayerStats = awayTeamModel.stats?.splits?.find(
    (s) => s.playerId === awayPlayer?.id,
  )
  const homePlayerStats = homeTeamModel.stats?.splits?.find(
    (s) => s.playerId === homePlayer?.id,
  )
</script>

<Panel class="!p-0">
  <div
    class="flex justify-between px-3 border-b border-gray-6 dark:border-gray-4"
  >
    <div>
      <div class="flex gap-1 py-2">
        <Image
          src={awayTeam?.logoImageUrl ?? ''}
          alt={awayTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-6 h-6 object-contain"
        />
        {halfInning === 'top' ? 'Batting' : 'Pitching'}
      </div>
      <Image
        src={awayPlayer?.imageUrl ?? ''}
        alt={awayPlayer?.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-left-bottom"
      />
    </div>
    <div class="pt-2 flex flex-col items-center">
      <Icon
        name="baseball-diamond"
        class="w-14 -mt-1"
        fillFirstBase={some(runners, (r) => r.endingBase === 1)}
        fillSecondBase={some(runners, (r) => r.endingBase === 2)}
        fillThirdBase={some(runners, (r) => r.endingBase === 3)}
      />
      <OutsIndicator class="mb-1" {outs} />
      <AtBatCount {balls} {strikes} />
    </div>
    <div>
      <div class="flex gap-1 justify-end py-2">
        {halfInning === 'bottom' ? 'Batting' : 'Pitching'}
        <Image
          src={homeTeam?.logoImageUrl ?? ''}
          alt={homeTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-6 h-6 object-contain"
        />
      </div>
      <Image
        src={homePlayer?.imageUrl ?? ''}
        alt={homePlayer?.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-right-bottom"
      />
    </div>
  </div>
  <div class="flex justify-between px-3 py-2">
    <div>
      <p class="text-lg font-semibold leading-none">
        {awayPlayer?.entity ? awayPlayer.entity.shortDisplay : ''}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(awayPosition, awayPlayerAb?.handedness) ?? ''}
        </span>
      </p>
      <div class="flex gap-1.5">
        {#if halfInning === 'top'}
          {#if awayPlayerStats?.stats?.['Batting-AtBats']}
            <p>
              {awayPlayerStats?.stats?.['Batting-Hits']
                ?.display}-{awayPlayerStats?.stats?.['Batting-AtBats'].display}
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-Runs']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-Runs'].display}
              <span class="text-gray-5">R</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-Doubles']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-Doubles'].display}
              <span class="text-gray-5">2B</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-Triples']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-Triples'].display}
              <span class="text-gray-5">3B</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-HomeRuns']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-HomeRuns'].display}
              <span class="text-gray-5">HR</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-RunsBattedIn']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-RunsBattedIn'].display}
              <span class="text-gray-5">RBI</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-Walks']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Batting-Strikeouts']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Batting-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
        {:else}
          {#if awayPlayerStats?.stats?.['Pitching-InningsPitched']}
            <p>
              {awayPlayerStats?.stats?.['Pitching-InningsPitched'].display}
              <span class="text-gray-5">IP</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Pitching-EarnedRuns']}
            <p>
              {awayPlayerStats?.stats?.['Pitching-EarnedRuns'].display}
              <span class="text-gray-5">ER</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Pitching-Strikeouts']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Pitching-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
          {#if awayPlayerStats?.stats?.['Pitching-Walks']?.value > 0}
            <p>
              {awayPlayerStats?.stats?.['Pitching-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
        {/if}
      </div>
    </div>
    <div class="text-right">
      <p class="text-lg font-semibold leading-none">
        {homePlayer?.entity ? homePlayer.entity.shortDisplay : ''}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(homePosition, homePlayerAb?.handedness) ?? ''}
        </span>
      </p>
      <div class="flex gap-1.5 justify-end">
        {#if halfInning === 'bottom'}
          {#if homePlayerStats?.stats?.['Batting-AtBats']}
            <p>
              {homePlayerStats?.stats?.['Batting-Hits']
                ?.display}-{homePlayerStats?.stats?.['Batting-AtBats'].display}
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-Runs']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-Runs'].display}
              <span class="text-gray-5">R</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-Doubles']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-Doubles'].display}
              <span class="text-gray-5">2B</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-Triples']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-Triples'].display}
              <span class="text-gray-5">3B</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-HomeRuns']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-HomeRuns'].display}
              <span class="text-gray-5">HR</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-RunsBattedIn']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-RunsBattedIn'].display}
              <span class="text-gray-5">RBI</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-Walks']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Batting-Strikeouts']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Batting-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
        {:else}
          {#if homePlayerStats?.stats?.['Pitching-InningsPitched']}
            <p>
              {homePlayerStats?.stats?.['Pitching-InningsPitched'].display}
              <span class="text-gray-5">IP</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Pitching-EarnedRuns']}
            <p>
              {homePlayerStats?.stats?.['Pitching-EarnedRuns'].display}
              <span class="text-gray-5">ER</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Pitching-Strikeouts']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Pitching-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
          {#if homePlayerStats?.stats?.['Pitching-Walks']?.value > 0}
            <p>
              {homePlayerStats?.stats?.['Pitching-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</Panel>
