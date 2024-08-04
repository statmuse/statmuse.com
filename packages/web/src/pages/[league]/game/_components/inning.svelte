<script lang="ts">
  export let outs = 0
  export let halfInning
  export let inning
</script>

<div class="flex gap-2">
  <p>
    <span class="capitalize">
      {halfInning === 'top' && outs === 3
        ? 'mid'
        : halfInning === 'bottom' && outs === 3
        ? 'end'
        : halfInning}
    </span>
    {inning}
  </p>
  <p>{outs} outs</p>
</div>
