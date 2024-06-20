<script lang="ts">
  import {
    createSelect,
    melt,
    type CreateSelectProps,
    type SelectOption,
  } from '@melt-ui/svelte'
  import Icon from '@components/icon.svelte'

  type Option = SelectOption<string> & { url?: string }

  export let options: Option[]
  export let label: string
  export let hideLabel: boolean = false
  export let initial: string | undefined
  export let param: string | undefined

  const handleSelectedChange: CreateSelectProps<string>['onSelectedChange'] = ({
    curr,
    next,
  }) => {
    if (curr?.value === next?.value) return curr

    const option = options.find((o) => o.value === next?.value)

    const url = new URL(option?.url ? option?.url : window.location.href)
    if (param) {
      if (next?.value === options[0].value) url.searchParams.delete(param)
      else if (next?.value) url.searchParams.set(param, next?.value)
    }

    window.location.href = url.toString()
    return next
  }

  const defaultSelected = options.find((o) => o.value === initial) ?? options[0]

  const {
    elements: { trigger, menu, option, label: labelElement },
    states: { selectedLabel, open },
    helpers: { isSelected },
  } = createSelect<string>({
    defaultSelected,
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true,
    },
    onSelectedChange: handleSelectedChange,
  })
</script>

<div
  class={`${
    $$props.class ?? ''
  } flex flex-col gap-1 h-8 text-gray-2 dark:text-gray-7`}
>
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label class="block" class:hidden={hideLabel} use:melt={$labelElement}>
    {label}
  </label>
  <button
    class={`flex h-8 items-center justify-between 
           border border-gray-6 dark:border-none dark:bg-gray-3
           px-3 rounded-3xl whitespace-nowrap truncate`}
    class:bg-gray-6={$open}
    class:bg-gray-8={!$open}
    use:melt={$trigger}
    aria-label={label}
  >
    {$selectedLabel || 'Select an option'}
    {#if $open}
      <Icon name="dropdown-up" class="w-4 h-4" />
    {:else}
      <Icon name="dropdown" class="w-4 h-4" />
    {/if}
  </button>
  {#if $open}
    <div class="relative -mt-[10px]">
      <div
        class="absolute inset-0 top-0.5 h-3 bottom-0 bg-gray-6 dark:bg-gray-3"
      />
      <div
        class="absolute left-0 w-2 h-5 -top-[10px] bg-gray-6 dark:bg-gray-3 border-l border-gray-6 dark:border-none"
      />
      <div
        class="absolute right-0 w-2 h-5 -top-[10px] bg-gray-6 dark:bg-gray-3 border-r border-gray-6 dark:border-none"
      />
    </div>
    <div
      class="z-10 relative -mt-[5px] pb-2 !max-h-64 flex flex-col
             overflow-y-auto rounded-b-3xl bg-gray-6 dark:bg-gray-3
             border border-t-0 border-gray-6 dark:border-none focus:!ring-0"
      use:melt={$menu}
    >
      {#each options as item}
        <div
          class="relative cursor-pointer p-1.5 px-3
                 focus:z-10 data-[disabled]:opacity-50
                 whitespace-nowrap"
          use:melt={$option(item)}
        >
          <div class="check {$isSelected(item.value) ? 'block' : 'hidden'}">
            <!-- <Check class="square-4" /> -->
          </div>
          {item.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .check {
    position: absolute;
    left: theme(spacing.2);
    top: 50%;
    z-index: theme(zIndex.20);
    translate: 0 calc(-50% + 1px);
    color: theme(colors.gray.500);
  }
</style>
