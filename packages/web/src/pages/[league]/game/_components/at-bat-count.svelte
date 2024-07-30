<script lang="ts">
  export let indicator: boolean | undefined = undefined

  export let balls: number
  export let strikes: number
</script>

<div class="w-8">
  <p class="text-lg">{balls} - {strikes}</p>
  {#if indicator}
    <div class="flex gap-0.5 flex-wrap">
      <div class="rounded bg-green" style="height: 4px;width: 4px;" />
      <div class="rounded bg-green" style="height: 4px;width: 4px;" />
      <div class="rounded bg-red" style="height: 4px;width: 4px;" />
      <div class="rounded bg-red" style="height: 4px;width: 4px;" />
      <div class="rounded bg-green" style="height: 4px;width: 4px;" />
      <div class="rounded bg-primary" style="height: 4px;width: 4px;" />
    </div>
  {/if}
</div>
