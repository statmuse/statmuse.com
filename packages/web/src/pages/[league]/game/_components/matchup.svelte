<script lang="ts">
  import Panel from '@components/panel.svelte'
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import {
    type GameraTeamReference,
    type GameraPlayerReference,
    type Position,
    formatMlbPosition,
  } from '@statmuse/core/gamera'
  import OutsIndicator from './outs-indicator.svelte'
  import AtBatCount from './at-bat-count.svelte'

  export let homeTeam: GameraTeamReference
  export let awayTeam: GameraTeamReference

  export let awayPlayer: GameraPlayerReference & {
    handedness: string
    positions: Position[]
  }
  export let homePlayer: GameraPlayerReference & {
    handedness: string
    positions: Position[]
  }

  export let half: 'top' | 'bottom'
  export let balls: number
  export let strikes: number
  export let outs: number
</script>

<Panel class="!p-0">
  <div
    class="flex justify-between px-3 border-b border-gray-6 dark:border-gray-4"
  >
    <div>
      <div class="flex gap-1 py-2">
        <Image
          src={awayTeam?.logoImageUrl ?? ''}
          alt={awayTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-6 h-6 object-contain"
        />
        {half === 'top' ? 'Batting' : 'Pitching'}
      </div>
      <Image
        src={awayPlayer.imageUrl}
        alt={awayPlayer.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-left-bottom"
      />
    </div>
    <div class="pt-2 flex flex-col items-center">
      <Icon name="baseball-diamond" class="w-14 -mt-1" fillSecondBase />
      <OutsIndicator class="mb-1" {outs} />
      <AtBatCount {balls} {strikes} />
    </div>
    <div>
      <div class="flex gap-1 justify-end py-2">
        {half === 'bottom' ? 'Batting' : 'Pitching'}
        <Image
          src={homeTeam?.logoImageUrl ?? ''}
          alt={homeTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-6 h-6 object-contain"
        />
      </div>
      <Image
        src={homePlayer.imageUrl}
        alt={homePlayer.usedName ?? ''}
        width={120}
        height={90}
        class="h-[75px] max-w-[10 0px] object-contain object-right-bottom"
      />
    </div>
  </div>
  <div class="flex justify-between px-3 py-2">
    <div>
      <p class="text-lg font-semibold leading-none">
        {awayPlayer.firstName?.slice(0, 1)}. {awayPlayer.lastName}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(awayPlayer.positions, awayPlayer.handedness)}
        </span>
      </p>
      <div class="flex gap-1.5">
        <p>2-1</p>
        <p>
          1 <span class="text-gray-5">R</span>
        </p>
        <p>
          1 <span class="text-gray-5">H</span>
        </p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-lg font-semibold leading-none">
        {homePlayer.firstName?.slice(0, 1)}. {homePlayer.lastName}
        <span class="text-base font-normal text-gray-5">
          {formatMlbPosition(homePlayer.positions, homePlayer.handedness)}
        </span>
      </p>
      <div class="flex gap-1.5">
        <p>
          26 <span class="text-gray-5">P</span>
        </p>
        <p>
          3.1 <span class="text-gray-5">IP</span>
        </p>
        <p>
          2 <span class="text-gray-5">ER</span>
        </p>
        <p>
          4 <span class="text-gray-5">SO</span>
        </p>
      </div>
    </div>
  </div>
</Panel>
