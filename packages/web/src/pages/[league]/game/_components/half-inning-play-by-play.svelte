<script lang="ts">
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import Panel from '@components/panel.svelte'
  import BaseballField from './baseball-field.svelte'
  import StrikeZone from './strike-zone.svelte'
  import {
    colorPlayOutcome,
    formatPlayOutcome,
    isLineupChange,
    isPitch,
    isSteal,
    tokensToText,
    type Colors,
    type InningHalf,
  } from '@statmuse/core/gamera/index'
  import { findLast, some } from 'lodash-es'
  import { players } from './stores'

  export let inningTitle: string
  export let inning: InningHalf
  export let reverseOrder = false

  export let colors: Colors | undefined = undefined

  // fill-blue bg-blue
</script>

<Panel
  class="!pb-0"
  title={inningTitle}
  background={colors?.backgroundColor}
  foreground={colors?.foregroundColor}
>
  <div
    class="flex divide-y divide-gray-6 dark:divide-gray-4"
    class:flex-col={!reverseOrder}
    class:flex-col-reverse={reverseOrder}
    class:divide-y-reverse={reverseOrder}
  >
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
            {#if $players}
              {@const player = $players[event.playerId]}
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
        {#each event.events as atBatEvent (atBatEvent)}
          {#if isLineupChange(atBatEvent)}
            <div
              class="-mx-3 px-3"
              style={colors ? `border-color: ${colors.foregroundColor}` : ''}
            >
              <div class="flex mt-1">
                <div class="flex-1 space-y-1 pb-2 pt-1">
                  <p>{tokensToText(atBatEvent.description)}</p>
                </div>
                {#if $players}
                  {@const player = $players[atBatEvent.playerId]}
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
          {:else if isSteal(atBatEvent)}
            {#if atBatEvent.runners && some(atBatEvent.runners, (r) => !!r.description)}
              {@const runners = atBatEvent.runners}
              <div
                class="-mx-3 px-3"
                style={colors ? `border-color: ${colors.foregroundColor}` : ''}
              >
                <div class="flex mt-1">
                  <div class="flex-1 space-y-1 pb-2 pt-1">
                    <p>
                      {runners
                        .flatMap((r) => r.description)
                        .filter((x) => !!x)
                        .map((r) => r.text)
                        .join(' ')}
                    </p>
                  </div>
                  {#if $players}
                    {@const player = $players[runners[0].playerId]}
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
          {:else if isPitch(atBatEvent)}
            {#if !atBatEvent.flags.isAtBatOver}
              {#if atBatEvent.outcomeType === 'balk'}
                {@const runners = atBatEvent.runners}
                {#if runners && runners.length > 0}
                  <div
                    class="-mx-3 px-3"
                    style={colors
                      ? `border-color: ${colors.foregroundColor}`
                      : ''}
                  >
                    <div class="flex mt-1">
                      <div class="flex-1 space-y-1 pb-2 pt-1">
                        <p>
                          {runners
                            .flatMap((r) => r.description)
                            .filter((x) => !!x)
                            .map((r) => r.text)
                            .join(' ')}
                        </p>
                        <p
                          class="rounded-2xl px-2 capitalize w-fit"
                          style={colors
                            ? `color: ${colors.backgroundColor}; background: ${colors.foregroundColor}`
                            : ''}
                        >
                          {atBatEvent.outcomeType}
                        </p>
                      </div>
                      {#if $players}
                        {@const player = $players[runners[0].playerId]}
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
              {:else}
                {@const runners = atBatEvent.runners}
                {#if runners && runners.length > 0 && some(runners, (r) => !!r.description)}
                  <div
                    class="-mx-3 px-3"
                    style={colors
                      ? `border-color: ${colors.foregroundColor}`
                      : ''}
                  >
                    <div class="flex mt-1">
                      <div class="flex-1 space-y-1 pb-2 pt-1">
                        <p>
                          {tokensToText(
                            runners
                              .flatMap((r) => r.description)
                              .filter((x) => !!x),
                          )}
                        </p>
                        <p
                          class="rounded-2xl px-2 capitalize w-fit"
                          style={colors
                            ? `color: ${colors.backgroundColor}; background: ${colors.foregroundColor}`
                            : ''}
                        >
                          {runners[0].outcomeType === 'steal'
                            ? 'Stolen Base'
                            : runners[0].outcomeType === 'caughtStealing'
                            ? 'Caught Stealing'
                            : atBatEvent.flags.isWildPitch
                            ? 'Wild Pitch'
                            : atBatEvent.flags.isPassedBall
                            ? 'Passed Ball'
                            : ''}
                        </p>
                      </div>
                      {#if $players}
                        {@const player = $players[runners[0].playerId]}
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
            {/if}
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
                  {@const pitches =
                    event.pitches ??
                    event.events.filter((e) => e.type === 'pitch')}
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
              {#if $players}
                {@const player = $players[event.batter.playerId]}
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
