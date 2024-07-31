<script lang="ts">
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import Panel from '@components/panel.svelte'
  import BaseballField from './baseball-field.svelte'
  import StrikeZone from './strike-zone.svelte'
  import {
    colorPlayOutcome,
    formatPlayOutcome,
    tokensToText,
    type Colors,
    type GameraPlayerReference,
    type InningHalf,
  } from '@statmuse/core/gamera'
  import { findLast, filter, some } from 'lodash-es'

  export let scoring: boolean | undefined = undefined
  export let inningTitle: string
  export let inning: InningHalf

  export let playerMap: Record<number, GameraPlayerReference> | undefined

  export let colors: Colors | undefined

  // fill-blue bg-blue
</script>

<Panel
  class="!pb-0"
  title={inningTitle}
  background={colors?.backgroundColor}
  foreground={colors?.foregroundColor}
>
  <div class="divide-y divide-gray-6 dark:divide-gray-4">
    {#each inning.events as event (event)}
      {#if event.type !== 'atBat'}
        <div
          class="-mx-3 px-3"
          style={colors ? `border-color: ${colors.foregroundColor}` : ''}
        >
          <div class="flex mt-1">
            <div class="flex-1 space-y-1 pb-2 pt-1">
              <p>{tokensToText(event.description)}</p>
            </div>
            {#if playerMap}
              {@const player = playerMap[event.playerId]}
              {#if player}
                <Image
                  src={player.imageUrl}
                  alt={player.usedName ?? ''}
                  width={120}
                  height={90}
                  class="h-[75px] max-w-[100px] object-contain object-right-bottom self-end"
                />
              {/if}
            {/if}
          </div>
        </div>
      {:else}
        {@const lineupEvents = filter(event.events, (e) => e.type === 'lineup')}
        {@const stealEvents = filter(event.events, (e) => e.type === 'steal')}
        {#each lineupEvents as lineupEvent (lineupEvent)}
          <div
            class="-mx-3 px-3"
            style={colors ? `border-color: ${colors.foregroundColor}` : ''}
          >
            <div class="flex mt-1">
              <div class="flex-1 space-y-1 pb-2 pt-1">
                <p>{tokensToText(lineupEvent.description)}</p>
              </div>
              {#if playerMap}
                {@const player = playerMap[lineupEvent.playerId]}
                {#if player}
                  <Image
                    src={player.imageUrl}
                    alt={player.usedName ?? ''}
                    width={120}
                    height={90}
                    class="h-[75px] max-w-[100px] object-contain object-right-bottom self-end"
                  />
                {/if}
              {/if}
            </div>
          </div>
        {/each}
        {#each stealEvents as stealEvent (stealEvent)}
          {#if stealEvent.runners}
            {#each stealEvent.runners as runner (runner)}
              {#if runner.outcomeType}
                <div
                  class="-mx-3 px-3"
                  style={colors
                    ? `border-color: ${colors.foregroundColor}`
                    : ''}
                >
                  <div class="flex mt-1">
                    <div class="flex-1 space-y-1 pb-2 pt-1">
                      <p>{runner.outcomeType}</p>
                      <p>{tokensToText(runner.description)}</p>
                    </div>
                    {#if playerMap}
                      {@const player = playerMap[runner.playerId]}
                      {#if player}
                        <Image
                          src={player.imageUrl}
                          alt={player.usedName ?? ''}
                          width={120}
                          height={90}
                          class="h-[75px] max-w-[100px] object-contain object-right-bottom self-end"
                        />
                      {/if}
                    {/if}
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}
        {#if event.description}
          <div
            class="-mx-3 px-3"
            style={colors ? `border-color: ${colors.foregroundColor}` : ''}
          >
            <div class="flex mt-1">
              <div class="flex-1 space-y-1 pb-2 pt-1">
                <p>{tokensToText(event.description)}</p>
                {#if event.type === 'atBat'}
                  {@const lastPitch = findLast(event.events, { type: 'pitch' })}
                  {@const pitches = filter(event.events, { type: 'pitch' })}
                  {#if lastPitch && lastPitch.type === 'pitch'}
                    {@const { count, hitData, runners } = lastPitch}
                    <div class="flex items-center gap-1.5">
                      <div
                        class={`rounded-2xl px-2 ${colorPlayOutcome(
                          lastPitch,
                        )}`}
                        style={colors
                          ? `color: ${colors.backgroundColor}; background: ${colors.foregroundColor}`
                          : ''}
                      >
                        {formatPlayOutcome(lastPitch)}
                      </div>
                      <p class="text-lg">{count.outs} outs</p>
                      {#if pitches}
                        <StrikeZone class="w-6" {pitches} />
                      {/if}
                      {#if hitData?.coordinates}
                        <BaseballField
                          class="w-6 fill-current"
                          coordinate={hitData.coordinates}
                        />
                      {/if}
                      {#if runners && some(runners, (r) => r.startingBase !== 0)}
                        <Icon
                          name="baseball-diamond-sm"
                          class="w-6"
                          fillFirstBase={some(
                            runners,
                            (r) => r.startingBase === 1,
                          )}
                          fillSecondBase={some(
                            runners,
                            (r) => r.startingBase === 2,
                          )}
                          fillThirdBase={some(
                            runners,
                            (r) => r.startingBase === 3,
                          )}
                        />
                      {/if}
                    </div>
                  {/if}
                {/if}
              </div>
              {#if playerMap}
                {@const player = playerMap[event.batter.playerId]}
                {#if player}
                  <Image
                    src={player.imageUrl}
                    alt={player.usedName ?? ''}
                    width={120}
                    height={90}
                    class="h-[75px] max-w-[100px] object-contain object-right-bottom self-end"
                  />
                {/if}
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</Panel>
