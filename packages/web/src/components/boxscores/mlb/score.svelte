<script lang="ts">
  import { gameScore } from './stores'

  export let teamKey: 'away' | 'home'
</script>

{$gameScore[teamKey]}
