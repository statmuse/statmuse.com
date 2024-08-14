<script lang="ts">
  import { colorPlayOutcome, type PitchAtBatEvent } from '@statmuse/core/gamera'

  const mapXCoordinate = (x: number) => -1 * x * (61 / 100) + 491
  const mapYCoordinate = (y: number) => -1 * y * (72 / 100) + 191

  export let pitches: PitchAtBatEvent[]
</script>

<svg {...$$props} viewBox="0 0 982 412.9" xmlns="http://www.w3.org/2000/svg">
  <path d="m409.9 98.1h162.2v186h-162.2z" fill="#909396" />
  <g
    fill="none"
    stroke="#fff"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
  >
    <path d="m430.2 118.3h40.5v48.5h-40.5z" />
    <path d="m470.7 118.3h40.5v48.5h-40.5z" />
    <path d="m511.3 118.3h40.5v48.5h-40.5z" />
    <path d="m430.2 166.8h40.5v48.5h-40.5z" />
    <path d="m470.7 166.8h40.5v48.5h-40.5z" />
    <path d="m511.3 166.8h40.5v48.5h-40.5z" />
    <path d="m430.2 215.3h40.5v48.5h-40.5z" />
    <path d="m470.7 215.3h40.5v48.5h-40.5z" />
    <path d="m511.3 215.3h40.5v48.5h-40.5z" />
  </g>
  <path d="m553.3 357.5h-124.6l-2.9 11.8 65.2 10.4 65.2-10.4z" fill="#ebebeb" />
  <path
    d="m32.3 412.9 134.9-77.1h218.2l-45.2 77.1h27l36.5-81.7h-254.2l-147.9 81.7z"
    fill="#ebebeb"
  />
  <path
    d="m641.8 412.9-45.3-77.1h218.3l134.8 77.1h30.7l-147.8-81.7h-254.2l36.5 81.7z"
    fill="#ebebeb"
  />
  {#each pitches as p, index (p)}
    <circle
      r="18"
      class={colorPlayOutcome(p)}
      cx={mapXCoordinate(p.pitchData?.coordinates?.x ?? 0)}
      cy={mapYCoordinate(p.pitchData?.coordinates?.y ?? 0)}
    />
    <text
      font-size="18"
      fill="white"
      text-anchor="middle"
      x={mapXCoordinate(p.pitchData?.coordinates?.x ?? 0)}
      y={mapYCoordinate(p.pitchData?.coordinates?.y ?? 0) + 4.5}
    >
      {index + 1}
    </text>
  {/each}
</svg>
