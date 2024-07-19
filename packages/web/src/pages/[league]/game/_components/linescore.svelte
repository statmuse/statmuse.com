<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Image from '@components/image.svelte'
  import type { GameraTeamReference } from '@statmuse/core/gamera'

  export let homeTeam: GameraTeamReference
  export let awayTeam: GameraTeamReference

  const innings = [
    [1, 0, 0],
    [2, 0, 1],
    [3, 1, undefined],
    [4, undefined, undefined],
    [5, undefined, undefined],
    [6, undefined, undefined],
    [7, undefined, undefined],
    [8, undefined, undefined],
    [9, undefined, undefined],
  ]

  const totals = [
    ['R', 1, 1],
    ['H', 2, 3],
    ['E', 0, 0],
  ]
</script>

<Panel class="!p-0">
  <div class="p-2 flex flex-nowrap">
    <div class="self-end pr-1">
      <div class="flex gap-1 items-center">
        <Image
          src={awayTeam.logoImageUrl ?? ''}
          alt={awayTeam.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        {awayTeam.abbreviation}
      </div>
      <div class="flex gap-1 items-center">
        <Image
          src={homeTeam.logoImageUrl ?? ''}
          alt={homeTeam.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        {homeTeam.abbreviation}
      </div>
    </div>
    <div class="flex-1 flex overflow-scroll no-scrollbar">
      {#each innings as inning (inning)}
        <div class="text-gray-5 px-1.5">
          <p>{inning[0]}</p>
          <p>{inning[1] !== undefined ? inning[1] : ''}</p>
          <p>{inning[2] !== undefined ? inning[2] : ''}</p>
        </div>
      {/each}
    </div>
    <div class="flex">
      {#each totals as inning, index (inning)}
        <div class="px-1.5" class:text-gray-5={index !== 0}>
          <p>{inning[0]}</p>
          <p>{inning[1] !== undefined ? inning[1] : ''}</p>
          <p>{inning[2] !== undefined ? inning[2] : ''}</p>
        </div>
      {/each}
    </div>
  </div>
</Panel>
