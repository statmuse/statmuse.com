<script lang="ts">
  import Panel from '@components/panel.svelte'

  const pitches = [
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
    {
      outcome: 'Foul',
      pitchType: '2-Seam Fastball',
      speed: '93.4 mph',
    },
  ]
</script>

<Panel
  class="!p-0 flex overflow-x-scroll no-scrollbar divide-x divide-gray-6 dark:divide-gray-4"
>
  {#each pitches as pitch, index (pitch)}
    <div class="text-nowrap px-3 py-2 text-center">
      <div
        class="w-7 h-7 rounded-full flex justify-center items-center bg-green mx-auto"
      >
        {index + 1}
      </div>
      <p class="text-xl font-semibold">{pitch.outcome}</p>
      <p>{pitch.pitchType}</p>
      <p class="text-gray-5">{pitch.speed}</p>
    </div>
  {/each}
</Panel>
