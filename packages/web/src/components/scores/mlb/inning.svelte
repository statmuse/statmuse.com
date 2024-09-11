<script lang="ts">
  import type { GameraDomain } from '@statmuse/core/gamera'
  import { scores } from '../stores'

  export let domain: GameraDomain
  export let gameId: number

  $: number = $scores[`${domain}-${gameId}`]?.inningNumber
  $: half = $scores[`${domain}-${gameId}`]?.inningHalf
  $: outs = $scores[`${domain}-${gameId}`]?.outs
</script>

{`${
  outs === 3 && half === 'bottom'
    ? 'End'
    : outs === 3 && half === 'top'
    ? 'Mid'
    : half === 'bottom'
    ? 'Bot'
    : 'Top'
} ${number}`}
