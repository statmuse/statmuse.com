<script lang="ts">
  import { gameScore } from './stores'

  export let teamKey: 'away' | 'home'

  $: console.log($gameScore)
</script>

{$gameScore[teamKey]}
