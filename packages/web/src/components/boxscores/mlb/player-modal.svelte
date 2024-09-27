<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Image from '@components/image.svelte'
  import EntityLink from '@components/entity-link.svelte'
  import PitchByPitch from './pitch-by-pitch.svelte'
  import dayjs from 'dayjs'
  import { selectedId, selectedPlayer } from './stores'
  import {
    getValue,
    tokensToText,
    type MlbStatKey,
    type MlbStatModel,
  } from '@statmuse/core/gamera'
  import Icon from '@components/icon.svelte'
  import { isNativeMobile } from '@lib/stores'

  type DisplayFn = (s?: MlbStatModel<MlbStatKey>) => string

  $: statSections = (
    $selectedPlayer?.type === 'batter'
      ? [
          { key: 'AB', statKey: 'Batting-AtBats' },
          { key: 'R', statKey: 'Batting-Runs' },
          { key: 'H', statKey: 'Batting-Hits' },
          { key: '2B', statKey: 'Batting-Doubles' },
          { key: '3B', statKey: 'Batting-Triples' },
          { key: 'HR', statKey: 'Batting-HomeRuns' },
          { key: 'RBI', statKey: 'Batting-RunsBattedIn' },
          { key: 'BB', statKey: 'Batting-Walks' },
          { key: 'HBP', statKey: 'Batting-HitByPitches' },
          { key: 'K', statKey: 'Batting-Strikeouts' },
          { key: 'SB', statKey: 'Batting-StolenBases' },
          { key: 'CS', statKey: 'Batting-CaughtStealing' },
        ]
      : [
          {
            key: 'W/L',
            statKey: 'Pitching-Wins',
            display: (s?: MlbStatModel<MlbStatKey>) => {
              if (getValue(s ?? {}, 'Pitching-Wins') > 0) {
                return 'W'
              }
              if (getValue(s ?? {}, 'Pitching-Losses') > 0) {
                return 'L'
              }
              if (getValue(s ?? {}, 'Pitching-GamesStarted') > 0) {
                return 'ND'
              }
              return '-'
            },
          },
          { key: 'K', statKey: 'Pitching-Strikeouts' },
          { key: 'GS', statKey: 'Pitching-GamesStarted' },
          {
            key: 'CG/SV',
            statKey: 'Pitching-CompleteGames',

            display: (s?: MlbStatModel<MlbStatKey>) => {
              if (getValue(s ?? {}, 'Pitching-CompleteGames') > 0) {
                return 'CG'
              }
              if (getValue(s ?? {}, 'Pitching-Saves') > 0) {
                return 'SV'
              }
              return '-'
            },
          },
          { key: 'SHO', statKey: 'Pitching-Shutouts' },
          { key: 'IP', statKey: 'Pitching-InningsPitched' },
          { key: 'H', statKey: 'Pitching-Hits' },
          { key: 'ER', statKey: 'Pitching-EarnedRuns' },
          { key: 'R', statKey: 'Pitching-Runs' },
          { key: 'HR', statKey: 'Pitching-HomeRuns' },
          { key: 'BB', statKey: 'Pitching-Walks' },
          { key: 'HBP', statKey: 'Pitching-HitBatsmen' },
        ]
  ) as { key: string; statKey: MlbStatKey; display?: DisplayFn }[]

  let atBatIndex = 0

  $: {
    if (!$selectedPlayer) atBatIndex = 0
  }

  // $: {
  //   if ($selectedPlayer) {
  //     // disable body scroll
  //     document.body.style.top = `-${window.scrollY}px`
  //     document.body.style.position = 'fixed'
  //     document.body.style.width = '100%'
  //   } else {
  //     // enable body scroll
  //     const scrollY = document.body.style.top
  //     document.body.style.position = ''
  //     document.body.style.top = ''
  //     document.body.style.width = ''
  //     document.body.style.margin = ''
  //     window.scrollTo(0, parseInt(scrollY || '0') * -1)
  //   }
  // }

  $: atBat = $selectedPlayer?.atBats[atBatIndex]
</script>

{#if $selectedPlayer}
  {@const { player, oppTeam, alignment, gameTimestamp, stats } =
    $selectedPlayer}
  <div
    class="fixed w-full h-full top-0 left-0 z-[100] bg-gray-6/80 dark:bg-gray-4/80 overflow-auto"
    on:click={() => selectedId.set(undefined)}
  >
    <div
      class="px-2 py-2 flex flex-col md:flex-row items-start gap-2 w-full md:w-fit absolute left-1/2 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2"
      class:top-2={!$isNativeMobile}
      class:top-10={$isNativeMobile}
      on:click|stopPropagation
    >
      <div class="flex flex-col gap-2 w-full md:w-[380px] md:-mt-11">
        <div
          class="w-fit p-2 bg-gray-8 dark:bg-gray-3 text-inherit border border-gray-6 dark:border-gray-3 rounded-full hover:cursor-pointer"
          on:click={() => selectedId.set(undefined)}
        >
          <Icon name="x" class="w-4 h-4" />
        </div>
        <Panel>
          <div
            class="flex items-center gap-1 border-b border-gray-6 dark:border-gray-4 -mx-3 px-3"
          >
            <Image
              class="h-[75px] max-w-[100px] select-none object-contain object-bottom"
              alt={player?.usedName ?? ''}
              src={player?.imageUrl ?? ''}
              width={180}
              height={180}
              loading="eager"
            />
            <div>
              <EntityLink
                entity={player?.entity}
                class="whitespace-nowrap text-inherit"
              >
                {player?.usedName ?? ''}
              </EntityLink>
              <div
                class="flex items-center justify-between gap-2 text-sm text-gray-5"
              >
                <EntityLink
                  entity={undefined}
                  class="whitespace-nowrap text-inherit"
                >
                  {dayjs(gameTimestamp).format('MMM D')}
                </EntityLink>
                <EntityLink
                  entity={undefined}
                  class="flex gap-1 items-center text-inherit"
                >
                  <p class="whitespace-nowrap">
                    {alignment === 'away' ? 'at' : 'vs'}
                  </p>
                  <div class="flex gap-1 items-center">
                    <Image
                      class="h-4 max-w-4 select-none object-contain object-center"
                      alt={oppTeam?.name ?? ''}
                      src={oppTeam?.logoImageUrl ?? ''}
                      width={16}
                      height={16}
                      loading="eager"
                    />

                    <p class="whitespace-nowrap">
                      {oppTeam?.abbreviation ?? ''}
                    </p>
                  </div>
                </EntityLink>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 py-3 leading-snug items-start">
            {#each statSections as section (section)}
              <div class="flex flex-col items-center">
                <div class="whitespace-nowrap mb-[2px]">
                  {#if section.display}
                    {section.display(stats)}
                  {:else}
                    {stats?.[section.statKey]?.display ?? '-'}
                  {/if}
                </div>
                <div
                  class="font-light text-sm opacity-80 whitespace-pre text-center leading-[1.1]"
                >
                  {section.key}
                </div>
              </div>
            {/each}
          </div>
        </Panel>
      </div>
      {#if atBat}
        <Panel class="w-full md:w-[380px] !p-0">
          <div
            class="px-3 py-2 flex justify-between border-b border-gray-6 dark:border-gray-4"
          >
            <div class="flex-1">
              <div class="flex gap-4">
                <p class="capitalize font-semibold">
                  {`${atBat.half} ${atBat.number}`}
                </p>
                {#if atBat.pitcher}
                  <span class="text-gray-5">
                    P: {atBat.pitcher.entity.shortDisplay ??
                      atBat.pitcher.usedName}
                  </span>
                {/if}
              </div>
              <p>{tokensToText(atBat.description)}</p>
            </div>
            {#if $selectedPlayer.atBats.length > 0}
              <div
                class="self-start flex rounded-2xl bg-gray-8 dark:bg-gray-3 text-inherit border border-gray-6 dark:border-gray-3 hover:cursor-pointer"
              >
                <div
                  class="p-2"
                  on:click={() => {
                    if (atBatIndex - 1 < 0) {
                      atBatIndex = $selectedPlayer.atBats.length - 1
                    } else {
                      atBatIndex = atBatIndex - 1
                    }
                  }}
                >
                  <Icon name="back" class="w-4 " />
                </div>
                <div
                  class="p-2"
                  on:click={() =>
                    (atBatIndex =
                      (atBatIndex + 1) % $selectedPlayer.atBats.length)}
                >
                  <Icon name="back" class="w-4 rotate-180" />
                </div>
              </div>
            {/if}
          </div>
          <PitchByPitch
            class="rounded-none border-none"
            batterHandedness={atBat.batter.handedness}
            pitches={atBat.events
              .filter((e) => e.type === 'pitch')
              .filter((e) => e.outcomeType !== 'balk') ?? []}
          />
        </Panel>
      {/if}
    </div>
  </div>
{/if}
