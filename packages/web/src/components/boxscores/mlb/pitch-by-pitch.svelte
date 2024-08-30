<script lang="ts">
  import Panel from '@components/panel.svelte'
  import {
    colorPlayOutcome,
    formatPitchType,
    formatPitchOutcome,
    type PitchAtBatEvent,
  } from '@statmuse/core/gamera'
  import Strikezone from './strikezone.svelte'
  import { afterUpdate } from 'svelte'

  export let batterHandedness: string | undefined = undefined
  export let pitches: PitchAtBatEvent[]
  export let autoScroll = false

  let pitchSequenceContainer: HTMLElement

  const mapPitchNumber = () => {
    let pitchNumber = 0
    return (p: PitchAtBatEvent) => ({
      ...p,
      pitchNumber:
        p.outcomeType === 'enforcedBall' || p.outcomeType === 'enforcedStrike'
          ? undefined
          : ++pitchNumber,
    })
  }

  afterUpdate(() => {
    if (autoScroll) {
      pitchSequenceContainer.scrollLeft = pitchSequenceContainer.scrollWidth
    }
  })

  $: pitchesWithNumber = pitches.map(mapPitchNumber()) ?? []
</script>

<Panel class={`!p-0 ${$$restProps.class}`}>
  <div class="flex flex-col items-center">
    <Strikezone
      class="h-96"
      {batterHandedness}
      pitches={pitchesWithNumber.filter((p) => p.pitchData)}
    />
  </div>
  <div
    bind:this={pitchSequenceContainer}
    class="min-h-[140px] flex items-center overflow-x-scroll no-scrollbar divide-x divide-gray-6 dark:divide-gray-4"
  >
    {#each pitchesWithNumber as pitch (pitch)}
      <div class="min-h-[140px] text-nowrap px-3 py-2 text-center">
        <div
          class={`w-7 h-7 text-gray-7 rounded-full flex justify-center items-center mx-auto ${colorPlayOutcome(
            pitch,
          )}`}
        >
          {#if pitch.pitchNumber}
            {pitch.pitchNumber}
          {/if}
        </div>
        <p class="text-xl font-semibold capitalize">
          {formatPitchOutcome(pitch)}
        </p>
        <p class="capitalize">{formatPitchType(pitch)}</p>
        <p class="text-gray-5">
          {pitch.pitchData?.speed ? `${pitch.pitchData?.speed} mph` : ''}
        </p>
      </div>
    {/each}
  </div>
</Panel>
