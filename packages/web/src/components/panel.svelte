<script lang="ts">
  import { rgbToHex } from '@statmuse/core/color'
  type Color = string | { r: number; g: number; b: number; a: number }

  export let team: boolean | undefined = false
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
  class={`${$$props.class ?? ''} rounded-2xl px-2.5 py-2 overflow-clip`}
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
  <slot />
</div>
