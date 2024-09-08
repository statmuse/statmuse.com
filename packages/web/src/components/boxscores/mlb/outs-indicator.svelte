<script lang="ts">
  export let outs: number
  export let vertical: boolean | undefined = undefined
  export let thickerBorder = false
</script>

<div class={`flex gap-1 ${$$props.class}`} class:flex-col={vertical}>
  <div
    class="rounded-full border border-current w-2 h-2"
    class:border-2={thickerBorder}
    class:bg-current={outs > 0}
  />
  <div
    class="rounded-full border border-current w-2 h-2"
    class:border-2={thickerBorder}
    class:bg-current={outs > 1}
  />
  <div
    class="rounded-full border border-current w-2 h-2"
    class:border-2={thickerBorder}
    class:bg-current={outs > 2}
  />
</div>
