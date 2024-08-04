<script lang="ts">
  import { colorPlayOutcome, type PitchAtBatEvent } from '@statmuse/core/gamera'

  export let indicator: boolean | undefined = undefined

  export let balls: number
  export let strikes: number

  export let pitches: PitchAtBatEvent[]

  // bg-red fill-red
  // bg-green fill-green
</script>

<div class="w-8">
  <p class="text-lg text-nowrap">{balls} - {strikes}</p>
  {#if indicator && pitches.length > 0}
    <div class="flex gap-0.5 flex-wrap">
      {#each pitches as pitch (pitch)}
        <div
          class={`rounded ${colorPlayOutcome(pitch)}`}
          style="height: 4px;width: 4px;"
        />
      {/each}
    </div>
  {/if}
</div>
