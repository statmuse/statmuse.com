<script lang="ts">
  import { rgbToHex } from '@statmuse/core/color'
  import type { GameraEntity } from '@statmuse/core/gamera'
  import type { KanedamaEntity } from '@statmuse/core/kanedama'
  import EntityLink from '@components/entity-link.svelte'
  type Color = string | { r: number; g: number; b: number; a: number }

  export let team: boolean | undefined = false
  export let title: string | undefined = undefined
  export let href: string | undefined = undefined
  export let entity: GameraEntity | KanedamaEntity | undefined = undefined
  export let background: Color | undefined = undefined
  export let foreground: Color | undefined = undefined

  const backgroundHex = background
    ? typeof background === 'string'
      ? background
      : rgbToHex(background)
    : undefined
  const foregroundHex = foreground
    ? typeof foreground === 'string'
      ? foreground
      : rgbToHex(foreground)
    : undefined
</script>

<div
  class={`${$$props.class ?? ''} relative rounded-2xl px-3 py-2 overflow-clip`}
  class:bg-gray-8={!background}
  class:text-gray-1={!foreground}
  class:border={!background}
  class:border-gray-6={!background}
  class:bg-team-primary={team}
  class:text-team-secondary={team}
  style={`${backgroundHex ? `background-color: ${backgroundHex};` : ''} ${
    foregroundHex ? `color: ${foregroundHex};` : ''
  }`}
>
  {#if entity}
    <EntityLink {entity} class="font-semibold mb-2 text-inherit">
      {title}
    </EntityLink>
  {:else if href}
    <a {href} class="font-semibold mb-2 text-inherit no-underline">
      {title}
    </a>
  {:else if title}
    <h3 class="font-semibold mb-2">{title}</h3>
  {/if}
  <slot />
</div>
