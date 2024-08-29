<script lang="ts">
  import { outs, halfInning, inningNumber } from './stores'
</script>

<div class="flex gap-2">
  <p>
    <span class="capitalize">
      {$halfInning?.half === 'top' && $outs === 3
        ? 'mid'
        : $halfInning?.half === 'bottom' && $outs === 3
        ? 'end'
        : $halfInning?.half ?? 'top'}
    </span>
    {$inningNumber}
  </p>
  <p>{$outs} outs</p>
</div>
