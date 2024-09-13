<script lang="ts">
  import type { GameraDomain } from '@statmuse/core/gamera'
  import { scores } from './stores'

  export let domain: GameraDomain
  export let gameId: number
  export let team: 'away' | 'home'

  $: score = $scores[`${domain}-${gameId}`]?.score[team] ?? 0
</script>

{score}
