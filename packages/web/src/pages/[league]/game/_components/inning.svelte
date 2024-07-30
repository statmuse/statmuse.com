<script lang="ts">
  export let outs
  export let half
  export let inning
</script>

<div class="flex gap-2">
  <p>
    <span class="capitalize">{half}</span>
    {inning}
  </p>
  <p>{outs} outs</p>
</div>
