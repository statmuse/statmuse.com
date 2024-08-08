<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import {
    type GameraTeamReference,
    formatMlbPosition,
  } from '@statmuse/core/gamera'
  import OutsIndicator from './outs-indicator.svelte'
  import AtBatCount from './at-bat-count.svelte'
  import { some } from 'lodash-es'
  import { matchup, runners } from './stores'

  export let homeTeam: GameraTeamReference
  export let awayTeam: GameraTeamReference
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
        {$matchup.away.type === 'batter' ? 'Batting' : 'Pitching'}
      </div>
      <Image
        src={$matchup.away.player?.imageUrl ?? ''}
        alt={$matchup.away.player?.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-left-bottom"
      />
    </div>
    <div class="pt-2 flex flex-col items-center">
      <Icon
        name="baseball-diamond"
        class="w-14 -mt-1"
        fillFirstBase={some($runners, (r) => r.endingBase === 1)}
        fillSecondBase={some($runners, (r) => r.endingBase === 2)}
        fillThirdBase={some($runners, (r) => r.endingBase === 3)}
      />
      <OutsIndicator class="mb-1" />
      <AtBatCount />
    </div>
    <div>
      <div class="flex gap-1 justify-end py-2">
        {$matchup.home.type === 'batter' ? 'Batting' : 'Pitching'}
        <Image
          src={homeTeam?.logoImageUrl ?? ''}
          alt={homeTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-6 h-6 object-contain"
        />
      </div>
      <Image
        src={$matchup.home.player?.imageUrl ?? ''}
        alt={$matchup.home.player?.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-right-bottom"
      />
    </div>
  </div>
  <div class="flex justify-between px-3 py-2">
    <div>
      <p class="text-lg font-semibold leading-none">
        {$matchup.away.player?.entity
          ? $matchup.away.player?.entity.shortDisplay
          : ''}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(
            $matchup.away.position,
            $matchup.away.handedness,
          ) ?? ''}
        </span>
      </p>
      <div class="flex gap-1.5">
        {#if $matchup.away.type === 'batter'}
          {#if $matchup.away.stats?.['Batting-AtBats']}
            <p>
              {$matchup.away.stats?.['Batting-Hits']?.display}-{$matchup.away
                .stats?.['Batting-AtBats'].display}
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-Runs']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-Runs'].display}
              <span class="text-gray-5">R</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-Doubles']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-Doubles'].display}
              <span class="text-gray-5">2B</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-Triples']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-Triples'].display}
              <span class="text-gray-5">3B</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-HomeRuns']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-HomeRuns'].display}
              <span class="text-gray-5">HR</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-RunsBattedIn']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-RunsBattedIn'].display}
              <span class="text-gray-5">RBI</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-Walks']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Batting-Strikeouts']?.value > 0}
            <p>
              {$matchup.away.stats?.['Batting-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
        {:else}
          {#if $matchup.away.stats?.['Pitching-InningsPitched']}
            <p>
              {$matchup.away.stats?.['Pitching-InningsPitched'].display}
              <span class="text-gray-5">IP</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Pitching-EarnedRuns']}
            <p>
              {$matchup.away.stats?.['Pitching-EarnedRuns'].display}
              <span class="text-gray-5">ER</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Pitching-Strikeouts']?.value > 0}
            <p>
              {$matchup.away.stats?.['Pitching-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
          {#if $matchup.away.stats?.['Pitching-Walks']?.value > 0}
            <p>
              {$matchup.away.stats?.['Pitching-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
        {/if}
      </div>
    </div>
    <div class="text-right">
      <p class="text-lg font-semibold leading-none">
        {$matchup.home.player?.entity
          ? $matchup.home.player?.entity.shortDisplay
          : ''}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(
            $matchup.home.position,
            $matchup.home.handedness,
          ) ?? ''}
        </span>
      </p>
      <div class="flex gap-1.5 justify-end">
        {#if $matchup.home.type === 'batter'}
          {#if $matchup.home.stats?.['Batting-AtBats']}
            <p>
              {$matchup.home.stats?.['Batting-Hits']?.display}-{$matchup.home
                .stats?.['Batting-AtBats'].display}
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-Runs']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-Runs'].display}
              <span class="text-gray-5">R</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-Doubles']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-Doubles'].display}
              <span class="text-gray-5">2B</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-Triples']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-Triples'].display}
              <span class="text-gray-5">3B</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-HomeRuns']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-HomeRuns'].display}
              <span class="text-gray-5">HR</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-RunsBattedIn']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-RunsBattedIn'].display}
              <span class="text-gray-5">RBI</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-Walks']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Batting-Strikeouts']?.value > 0}
            <p>
              {$matchup.home.stats?.['Batting-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
        {:else}
          {#if $matchup.home.stats?.['Pitching-InningsPitched']}
            <p>
              {$matchup.home.stats?.['Pitching-InningsPitched'].display}
              <span class="text-gray-5">IP</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Pitching-EarnedRuns']}
            <p>
              {$matchup.home.stats?.['Pitching-EarnedRuns'].display}
              <span class="text-gray-5">ER</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Pitching-Strikeouts']?.value > 0}
            <p>
              {$matchup.home.stats?.['Pitching-Strikeouts'].display}
              <span class="text-gray-5">K</span>
            </p>
          {/if}
          {#if $matchup.home.stats?.['Pitching-Walks']?.value > 0}
            <p>
              {$matchup.home.stats?.['Pitching-Walks'].display}
              <span class="text-gray-5">BB</span>
            </p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</Panel>
