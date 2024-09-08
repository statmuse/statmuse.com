<script lang="ts">
  import EntityLink from '@components/entity-link.svelte'
  import Image from '@components/image.svelte'
  import type {
    InProgressGame,
    GameraTeamReference,
  } from '@statmuse/core/gamera'
  import dayjs from 'dayjs'
  import Score from './score.svelte'
  import Inning from './mlb/inning.svelte'
  import Baseballdiamond from './mlb/baseball-diamond.svelte'
  import Outs from './mlb/outs.svelte'

  export let game: InProgressGame
  export let awayTeam: GameraTeamReference
  export let homeTeam: GameraTeamReference
</script>

<EntityLink
  entity={{
    id: game.id.toString(),
    type: 'game',
    display: `${dayjs(game.gameDate).format('M/D/YYYY')} ${
      awayTeam?.abbreviation
    } @ ${homeTeam?.abbreviation}`,
    domain: 'MLB',
  }}
  class="flex gap-3 py-2 px-3 text-inherit hover:no-underline"
>
  <div class="flex-1">
    <div class="flex justify-between py-0.5">
      <div class="flex gap-1 items-center">
        <Image
          src={awayTeam?.logoImageUrl ?? ''}
          alt={awayTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        <p>{awayTeam?.nickname}</p>
      </div>
      <p><Score domain="MLB" gameId={game.id} team="away" /></p>
    </div>
    <div class="flex justify-between py-0.5">
      <div class="flex gap-1 items-center">
        <Image
          src={homeTeam?.logoImageUrl ?? ''}
          alt={homeTeam?.name ?? ''}
          width={60}
          height={60}
          class="w-5 h-5 object-contain"
        />
        <p>{homeTeam?.nickname}</p>
      </div>
      <p><Score domain="MLB" gameId={game.id} team="home" /></p>
    </div>
  </div>
  <div class="w-20 flex items-center justify-end text-right text-sm">
    <div>
      <p class="text-gray-8 bg-teal px-2 rounded-lg text-center w-fit">
        <Inning domain="MLB" gameId={game.id} />
      </p>
      <div class="flex gap-1.5">
        <Baseballdiamond domain="MLB" gameId={game.id} />
        <Outs class="scale-75" domain="MLB" gameId={game.id} />
      </div>
    </div>
  </div>
</EntityLink>
