<script lang="ts">
  import PitchByPitch from './pitch-by-pitch.svelte'
  import { atBat } from './stores'
</script>

<PitchByPitch
  batterHandedness={$atBat?.batter.handedness}
  pitches={$atBat?.events
    .filter((e) => e.type === 'pitch')
    .filter((e) => e.outcomeType !== 'balk') ?? []}
/>
