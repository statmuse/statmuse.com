<script lang="ts">
  import { outs } from './stores'

  export let vertical: boolean | undefined = undefined
</script>

<div class={`flex gap-1 ${$$restProps.class}`} class:flex-col={vertical}>
  <div
    class="rounded-full border border-current w-2 h-2"
    class:bg-current={$outs > 0}
  />
  <div
    class="rounded-full border border-current w-2 h-2"
    class:bg-current={$outs > 1}
  />
  <div
    class="rounded-full border border-current w-2 h-2"
    class:bg-current={$outs > 2}
  />
</div>
