<script lang="ts">
  export let indicator: boolean | undefined = undefined

  let strike = 2
  let ball = 3
</script>

<div class="w-8">
  <p class="text-lg">{ball} - {strike}</p>
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
