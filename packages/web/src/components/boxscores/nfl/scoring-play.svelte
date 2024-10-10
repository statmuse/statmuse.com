<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Image from '@components/image.svelte'
  import {
    tokensToText,
    type NflScoringEvent,
    type NflScoringType,
    type GameraTeamReference,
    ordinalNumber,
  } from '@statmuse/core/gamera'
  import { events, players } from './stores'

  export let scoringEvent: NflScoringEvent
  export let teamMap: Record<number, GameraTeamReference | undefined>
  export let awayTeamId: number | undefined
  export let homeTeamId: number | undefined

  const formatScoringType = (type: NflScoringType) => {
    switch (type) {
      case 'defensiveTwoPointConversion':
        return '2PT Conversion'
      case 'fieldGoalMade':
        return 'FG Made'
      case 'safety':
        return 'Safety'
      default:
        return 'Touchdown'
    }
  }

  $: play = $events
    .filter((e) => e.type === 'play')
    .find((e) => e.eventSequence === scoringEvent.eventSequence)

  $: team = teamMap[play?.startSituation.possessionTeamId ?? 0]

  $: player =
    $players[
      scoringEvent.fieldGoalKickingPlayerId ??
        scoringEvent.touchdownPlayerId ??
        scoringEvent.touchdownPassingPlayerId ??
        0
    ]
</script>

<Panel
  background={team?.colors?.backgroundColor}
  foreground={team?.colors?.foregroundColor}
>
  <div class="flex justify-between">
    <p class="font-semibold">
      {scoringEvent.period}Q {play?.startSituation.clock}
    </p>
    <p>
      <span class:font-semibold={scoringEvent.scoringTeamId === awayTeamId}>
        {(play?.awayPoints ?? 0) +
          (scoringEvent.scoringTeamId === awayTeamId
            ? scoringEvent.extraPoint?.isSuccessful
              ? 1
              : scoringEvent.twoPointConversion?.isSuccessful
              ? 2
              : 0
            : 0)}
      </span>
      -
      <span class:font-semibold={scoringEvent.scoringTeamId === homeTeamId}>
        {(play?.homePoints ?? 0) +
          (scoringEvent.scoringTeamId === homeTeamId
            ? scoringEvent.extraPoint?.isSuccessful
              ? 1
              : scoringEvent.twoPointConversion?.isSuccessful
              ? 2
              : 0
            : 0)}
      </span>
    </p>
  </div>
  <div class="flex">
    <div class="flex-1 space-y-1 pb-2 pt-1">
      <p>{tokensToText(play?.description)}</p>
      <div class="flex items-center gap-3">
        <div
          class="rounded-2xl px-2"
          style={team?.colors
            ? `background:${team.colors.foregroundColor};color:${team.colors.backgroundColor};`
            : undefined}
        >
          {formatScoringType(scoringEvent.scoringType)}
        </div>
        {#if scoringEvent.extraPoint}
          {#if scoringEvent.extraPoint.isSuccessful}
            <p>Made XP</p>
          {:else}
            <p>Missed XP</p>
          {/if}
        {/if}
        {#if scoringEvent.twoPointConversion}
          {#if scoringEvent.twoPointConversion.isSuccessful}
            <p>2PT Conversion</p>
          {:else}
            <p>2PT Failed</p>
          {/if}
        {/if}
      </div>
      <div class="flex items-center gap-3">
        <span>
          {ordinalNumber(play?.startSituation.down ?? 0)} & {play
            ?.startSituation.yardsToFirst}
        </span>
        {#if play?.yardsAfterCatch}
          <span>
            {play.yardsAfterCatch} yd
            <span class="opacity-50">after catch</span>
          </span>
        {/if}
        {#if play?.yardsAfterContact}
          <span>
            {play.yardsAfterContact} yd
            <span class="opacity-50">after contact</span>
          </span>
        {/if}
      </div>
    </div>
    {#if player && !player.imageUrl.includes('silhouette')}
      <Image
        src={player.imageUrl}
        alt={player.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[100px] object-contain object-right-bottom self-end"
      />
    {/if}
  </div>
</Panel>
