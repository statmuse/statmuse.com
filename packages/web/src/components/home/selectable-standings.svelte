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
  export let toggle: Record<string, string[]>

  const defaultSelected = options[4]
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

  $: toggleOptions = toggle[selectedValue]
</script>

<Panel class="!pb-0 !px-0 group">
  <div class="flex justify-between mb-1">
    <button
      use:melt={$trigger}
      class="font-semibold w-40 px-3 text-left flex justify-between items-center"
    >
      {$selectedLabel
        ? `${$selectedLabel === 'FC' ? 'League' : $selectedLabel} ${
            $selectedLabel === 'FC' ? 'Table' : 'Standings'
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
            class="data-[highlighted]:bg-gray-7 data-[highlighted]:dark:bg-gray-2 px-3 py-0.5 cursor-pointer"
          >
            {league.label}
          </p>
        {/each}
      </div>
    {/if}
    {#if toggleOptions}
      <div
        class="bg-gray-6 dark:bg-gray-4 text-gray-5 border border-gray-6 dark:border-gray-3 flex text-center rounded-full relative overflow-clip mr-3"
      >
        <div
          class="absolute h-full w-1/2 bg-gray-8 dark:bg-gray-7 rounded-full left-0 group-has-[#standings-0:checked]:translate-x-0 group-has-[#standings-1:checked]:translate-x-full transition-transform ease-out"
        />
        {#each toggleOptions as option, i}
          <label
            for={`standings-${i}`}
            class="py-1 w-12 relative cursor-pointer"
            class:group-has-[#standings-0:checked]:text-gray-2={i == 0}
            class:group-has-[#standings-1:checked]:text-gray-2={i == 1}
          >
            {option}
          </label>
        {/each}
      </div>
    {/if}
  </div>
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
