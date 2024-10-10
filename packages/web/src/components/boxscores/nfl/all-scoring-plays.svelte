<script lang="ts">
  import type { GameraTeamReference } from '@statmuse/core/gamera'
  import ScoringPlay from './scoring-play.svelte'
  import { scoringEvents } from './stores'

  export let awayTeam: GameraTeamReference | undefined
  export let homeTeam: GameraTeamReference | undefined
</script>

{#each $scoringEvents as event (event.scoreSequence)}
  <ScoringPlay
    scoringEvent={event}
    teamMap={{
      [awayTeam?.teamId ?? 0]: awayTeam,
      [homeTeam?.teamId ?? 0]: homeTeam,
    }}
    awayTeamId={awayTeam?.teamId}
    homeTeamId={homeTeam?.teamId}
  />
{/each}
