<script lang="ts">
  import Panel from '@components/panel.svelte'
  import {
    colorPlayOutcome,
    formatPitchType,
    formatPitchOutcome,
  } from '@statmuse/core/gamera'

  import { atBat } from './stores'

  $: pitches = $atBat?.events.filter((e) => e.type === 'pitch') ?? []
</script>

<Panel
  class="!p-0 min-h-[140px] flex items-center overflow-x-scroll no-scrollbar divide-x divide-gray-6 dark:divide-gray-4"
>
  {#each pitches as pitch, index (pitch)}
    <div class="min-h-[140px] text-nowrap px-3 py-2 text-center">
      <div
        class={`w-7 h-7 text-gray-7 rounded-full flex justify-center items-center mx-auto ${colorPlayOutcome(
          pitch,
        )}`}
      >
        {index + 1}
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
</Panel>
