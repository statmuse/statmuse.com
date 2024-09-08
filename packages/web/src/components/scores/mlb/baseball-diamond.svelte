<script lang="ts">
  import Icon from '@components/icon.svelte'
  import type { GameraDomain } from '@statmuse/core/gamera'
  import { scores } from '../stores'
  import { some } from 'lodash-es'

  export let domain: GameraDomain
  export let gameId: number

  $: runners = $scores[`${domain}-${gameId}`]?.runners ?? []
</script>

<Icon
  name="baseball-diamond"
  class="w-6"
  fillFirstBase={some(runners, (r) => r.endingBase === 1)}
  fillSecondBase={some(runners, (r) => r.endingBase === 2)}
  fillThirdBase={some(runners, (r) => r.endingBase === 3)}
/>
