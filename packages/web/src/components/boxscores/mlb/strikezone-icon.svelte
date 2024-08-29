<script lang="ts">
  import Icon from '@components/icon.svelte'
  import type { PitchAtBatEvent } from '@statmuse/core/gamera/index'

  const mapXCoordinate = (x: number) => {
    let xPoint = -1 * x * (9.87 / 100) + 14.75

    if (xPoint < 2) xPoint = 2
    if (xPoint > 27.5) xPoint = 27.5

    return xPoint
  }

  const mapYCoordinate = (y: number) => {
    let yPoint = -1 * y * (9.87 / 100) + 14.75

    if (yPoint < 2) yPoint = 2
    if (yPoint > 27.5) yPoint = 27.5

    return yPoint
  }

  export let pitches: PitchAtBatEvent[]
</script>

<Icon name="baseball-strike-zone" {...$$restProps}>
  {#each pitches as pitch (pitch)}
    {#if pitch.pitchData?.coordinates}
      <circle
        r="2"
        class="fill-current"
        cx={mapXCoordinate(pitch.pitchData?.coordinates?.x)}
        cy={mapYCoordinate(pitch.pitchData?.coordinates?.y)}
      />
    {/if}
  {/each}
</Icon>
