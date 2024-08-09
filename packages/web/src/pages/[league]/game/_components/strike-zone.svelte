<script lang="ts">
  import Icon from '@components/icon.svelte'
  import {
    colorPlayOutcome,
    type PitchAtBatEvent,
  } from '@statmuse/core/gamera/index'

  const mapXCoordinate = (x: number) => {
    let xPoint
    // clamp the value between -150, 150
    if (x < -150) xPoint = -150
    if (x > 150) xPoint = 150
    if (!xPoint) xPoint = x

    return ((xPoint + 150) / 300) * 29.5
  }

  const mapYCoordinate = (y: number) => {
    let yPoint
    // clamp the value between -120, 120
    if (y < -120) yPoint = -120
    if (y > 120) yPoint = 120
    if (!yPoint) yPoint = y

    return ((-1 * y + 120) / 240) * 29.5
  }

  export let pitches: PitchAtBatEvent[]
</script>

<Icon name="baseball-strike-zone" {...$$restProps}>
  {#each pitches as pitch (pitch)}
    {#if pitch.pitchData?.coordinates}
      <circle
        r="2"
        class={colorPlayOutcome(pitch)}
        cx={mapXCoordinate(pitch.pitchData?.coordinates?.x)}
        cy={mapYCoordinate(pitch.pitchData?.coordinates?.y)}
      />
    {/if}
  {/each}
</Icon>
