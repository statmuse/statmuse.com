<script lang="ts">
  import Panel from '@components/panel.svelte'
  import EntityLink from '@components/entity-link.svelte'
  import Image from '@components/image.svelte'
  import type { GameraDomain, GameraTeamReference } from '@statmuse/core/gamera'

  export let domain: GameraDomain | undefined = undefined
  export let awayTeam: GameraTeamReference | undefined = undefined
  export let homeTeam: GameraTeamReference | undefined = undefined
  export let title: string | undefined = undefined
</script>

<Panel class="!p-0">
  {#if !!awayTeam || !!homeTeam}
    <div
      class="relative flex justify-center py-2 border-b border-gray-6 dark:border-gray-4"
    >
      <EntityLink
        entity={awayTeam?.entity}
        class="flex items-center gap-2 absolute left-3 top-2 text-inherit"
      >
        {#if domain !== 'NFL'}
          <Image
            src={awayTeam?.logoImageUrl ?? ''}
            alt={awayTeam?.name ?? ''}
            width={60}
            height={60}
            class="w-4 h-4 object-contain"
          />
        {/if}
        {awayTeam?.abbreviation}
      </EntityLink>

      {#if title}
        <h3 class="font-semibold">{title}</h3>
      {/if}

      <EntityLink
        entity={homeTeam?.entity}
        class="flex items-center gap-2 absolute right-3 top-2 text-inherit"
      >
        {homeTeam?.abbreviation}
        {#if domain !== 'NFL'}
          <Image
            src={homeTeam?.logoImageUrl ?? ''}
            alt={homeTeam?.name ?? ''}
            width={60}
            height={60}
            class="w-4 h-4 object-contain"
          />
        {/if}
      </EntityLink>
    </div>
  {/if}
  <slot />
</Panel>
