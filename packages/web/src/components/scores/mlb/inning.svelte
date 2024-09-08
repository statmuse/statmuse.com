<script lang="ts">
  import type { GameraDomain } from '@statmuse/core/gamera'
  import { scores } from '../stores'

  export let domain: GameraDomain
  export let gameId: number

  $: number = $scores[`${domain}-${gameId}`]?.inningNumber
  $: half = $scores[`${domain}-${gameId}`]?.inningHalf
</script>

{`${half === 'bottom' ? 'Bot' : 'Top'} ${number}`}
