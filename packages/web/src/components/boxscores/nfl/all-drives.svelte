<script lang="ts">
  import type { GameraTeamReference } from '@statmuse/core/gamera'
  import Drive from './drive.svelte'
  import { drives } from './stores'

  export let awayTeam: GameraTeamReference | undefined
  export let homeTeam: GameraTeamReference | undefined
</script>

{#each $drives as drive (drive.driveSequence)}
  <Drive
    {drive}
    teamMap={{
      [awayTeam?.teamId ?? 0]: awayTeam,
      [homeTeam?.teamId ?? 0]: homeTeam,
    }}
  />
{/each}
