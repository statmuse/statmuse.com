<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
  import Panel from '@components/panel.svelte'
  import {
    ordinalNumber,
    tokensToText,
    type GameraTeamReference,
    type NflDrive,
    type NflDriveEndReason,
  } from '@statmuse/core/gamera'
  import { events } from './stores'
  import Icon from '@components/icon.svelte'
  import { hexToRgba } from '@lib/color'

  export let drive: NflDrive
  export let teamMap: Record<number, GameraTeamReference | undefined>

  const endOfDrive = (reason?: NflDriveEndReason) => {
    switch (reason) {
      case 'punt':
      case 'touchdown':
      case 'fumble':
      case 'safety':
      case 'downs':
      case 'interception':
        return `${reason[0].toUpperCase()}${reason.slice(1)}`
      case 'missedFieldGoal':
        return 'Missed FG'
      case 'muffedFieldGoal':
        return 'Muffed FG'
      case 'endOfGame':
        return 'End Game'
      case 'endOfHalf':
        return 'Half Time'
      default:
        return reason
    }
  }

  let isOpen = false

  $: plays = $events
    .filter((e) => e.driveSequence === drive.driveSequence)
    .filter((e) => e.type === 'play')

  $: possessionTeamId =
    plays[0]?.playType === 'kickoff' || plays[0]?.playType === 'freeKick'
      ? plays[0]?.endSituation.possessionTeamId
      : plays[0]?.startSituation.possessionTeamId

  $: team = teamMap[possessionTeamId]
</script>

<Panel
  background={team?.colors?.backgroundColor}
  foreground={team?.colors?.foregroundColor}
>
  <div
    class="flex items-center gap-3 cursor-pointer"
    on:click={() => (isOpen = !isOpen)}
  >
    <Icon name={!isOpen ? 'dropdown' : 'dropdown-up'} class="w-4 h-4" />

    <div
      class="rounded-2xl px-2"
      style={isOpen && team?.colors
        ? `background:${team.colors.foregroundColor};color:${team.colors.backgroundColor};`
        : undefined}
    >
      {endOfDrive(drive.endReason)}
    </div>

    <span class="opacity-50">
      {plays.length} plays,
      {drive.gainYards} yd,
      {drive.duration}
    </span>
  </div>
  {#if isOpen}
    <div class="flex flex-col divide-y">
      {#each plays as play (play)}
        <div
          class="-mx-3 px-3 py-2"
          style={team?.colors
            ? `border-color:${hexToRgba(team.colors.foregroundColor, 0.5)}`
            : undefined}
        >
          <div class="flex gap-2 opacity-50">
            <span>{play.period}Q {play.startSituation.clock}</span>
            {#if play.startSituation.down}
              <span>
                {ordinalNumber(play.startSituation.down)} & {play.startSituation
                  .yardsToFirst} at {teamMap[
                  play.startSituation.location.teamId
                ]?.abbreviation}
                {play.startSituation.location.yardLine}
              </span>
            {/if}
          </div>
          {tokensToText(play.description)}
        </div>
      {/each}
    </div>
  {/if}
</Panel>
