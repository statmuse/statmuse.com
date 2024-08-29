<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
  import Icon from '@components/icon.svelte'
  import { selectedAtBat } from './stores'
  import Panel from '@components/panel.svelte'
  import PitchByPitch from './pitch-by-pitch.svelte'
  import { tokensToText } from '@statmuse/core/gamera'
</script>

{#if $selectedAtBat}
  <div
    class="fixed w-full h-full top-0 left-0 z-[100] bg-gray-6/80 dark:bg-gray-4/80 overflow-auto"
    on:click={() => selectedAtBat.set(undefined)}
  >
    <div
      class="px-2 py-2 flex flex-col gap-2 w-full md:w-fit absolute left-1/2 top-2 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2"
      on:click|stopPropagation
    >
      <div
        class="w-fit p-2 bg-gray-8 dark:bg-gray-3 text-inherit border border-gray-6 dark:border-gray-3 rounded-full hover:cursor-pointer"
        on:click={() => selectedAtBat.set(undefined)}
      >
        <Icon name="x" class="x-4 h-4" />
      </div>

      <Panel class="w-full md:w-[380px] !p-0">
        <div class="px-3 py-2 border-b border-gray-6 dark:border-gray-4">
          <div class="flex gap-4">
            <p class="capitalize font-semibold">
              {`${$selectedAtBat.half} ${$selectedAtBat.number}`}
            </p>
            {#if $selectedAtBat.pitcher}
              <span class="text-gray-5">
                P: {$selectedAtBat.pitcher.entity.shortDisplay ??
                  $selectedAtBat.pitcher.usedName}
              </span>
            {/if}
          </div>
          <p>{tokensToText($selectedAtBat.atBat.description)}</p>
        </div>
        <PitchByPitch
          class="rounded-none border-none"
          batterHandedness={$selectedAtBat.atBat.batter.handedness}
          pitches={$selectedAtBat.atBat.pitches
            ?.filter((e) => e.type === 'pitch')
            .filter((e) => e.outcomeType !== 'balk') ??
            $selectedAtBat.atBat.events
              .filter((e) => e.type === 'pitch')
              .filter((e) => e.outcomeType !== 'balk') ??
            []}
        />
      </Panel>
    </div>
  </div>
{/if}
