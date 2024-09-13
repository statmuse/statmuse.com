<script lang="ts">
  import type { GameraDomain } from '@statmuse/core/gamera'
  import { scores } from '../stores'

  export let domain: GameraDomain
  export let gameId: number

  $: outs = $scores[`${domain}-${gameId}`]?.outs ?? 0
</script>

<div class={`flex flex-col gap-1 ${$$props.class}`}>
  <div
    class="rounded-full border-2 border-current w-2 h-2"
    class:bg-current={outs > 0}
  />
  <div
    class="rounded-full border-2 border-current w-2 h-2"
    class:bg-current={outs > 1}
  />
  <div
    class="rounded-full border-2 border-current w-2 h-2"
    class:bg-current={outs > 2}
  />
</div>
