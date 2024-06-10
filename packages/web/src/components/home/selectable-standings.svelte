<script lang="ts">
  import Icon from '@components/icon.svelte'
  import Panel from '@components/panel.svelte'
  import {
    melt,
    createSelect,
    type SelectOption,
    type CreateSelectProps,
  } from '@melt-ui/svelte'

  export let options: SelectOption<string>[]

  const defaultSelected = options[0]
  let selectedValue: string = defaultSelected.value

  const handleChange: CreateSelectProps<string>['onSelectedChange'] = ({
    next,
    curr,
  }) => {
    if (next?.value !== curr?.value) {
      selectedValue = next?.value ?? ''
      return next
    }
    return curr
  }

  const {
    elements: { trigger, menu, option },
    states: { selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    defaultSelected,
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      sameWidth: true,
      fitViewport: true,
    },
    onSelectedChange: handleChange,
  })
</script>

<Panel class="!pb-0 !px-0">
  <button
    use:melt={$trigger}
    class=" w-56 px-2 text-left flex justify-between items-center"
  >
    {$selectedLabel
      ? `${$selectedLabel} ${
          $selectedLabel === 'Premier Leaegue' ? 'Table' : 'Standings'
        }`
      : 'Choose an option'}
    {#if $open}
      <Icon name="dropdown-up" class="w-4 h-4" />
    {:else}
      <Icon name="dropdown" class="w-4 h-4" />
    {/if}
  </button>
  {#if $open}
    <div
      use:melt={$menu}
      class="bg-gray-6 dark:bg-gray-3 rounded-b-2xl overflow-clip"
    >
      {#each options as league}
        <p
          use:melt={$option(league)}
          class="data-[highlighted]:dark:bg-gray-1 px-2 cursor-pointer"
        >
          {league.label}
        </p>
      {/each}
    </div>
  {/if}
  {#if selectedValue === 'epl'}
    <slot name="epl" />
  {:else if selectedValue === 'nba'}
    <slot name="nba" />
  {:else if selectedValue === 'nfl'}
    <slot name="nfl" />
  {:else if selectedValue === 'mlb'}
    <slot name="mlb" />
  {:else if selectedValue === 'nhl'}
    <slot name="nhl" />
  {/if}
</Panel>
