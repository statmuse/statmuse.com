<script lang="ts">
  import {
    createSelect,
    melt,
    type CreateSelectProps,
    type SelectOption,
  } from '@melt-ui/svelte'
  import Icon from '@components/icon.svelte'

  export let options: SelectOption<string>[]
  export let label: string
  export let hideLabel: boolean = false
  export let initial: string | undefined
  export let param: string

  const handleSelectedChange: CreateSelectProps<string>['onSelectedChange'] = ({
    curr,
    next,
  }) => {
    if (curr?.value === next?.value) return curr

    const url = new URL(window.location.href)
    if (next?.value === options[0].value) url.searchParams.delete(param)
    else if (next?.value) url.searchParams.set(param, next?.value)

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

<div class={`${$$props.class ?? ''} flex flex-col gap-1 text-gray-1 h-8`}>
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label class="block" class:hidden={hideLabel} use:melt={$labelElement}>
    {label}
  </label>
  <button
    class={`flex h-8 items-center justify-between 
           font-semibold border border-gray-6 
           px-3 rounded-3xl whitespace-nowrap truncate`}
    class:bg-gray-6={$open}
    class:bg-gray-8={!$open}
    use:melt={$trigger}
    aria-label={label}
  >
    {$selectedLabel || 'Select an option'}
    {#if $open}
      <Icon name="dropdown-up" class="w-5 h-5" />
    {:else}
      <Icon name="dropdown" class="w-5 h-5" />
    {/if}
  </button>
  {#if $open}
    <div class="relative -mt-[10px]">
      <div class="absolute inset-0 top-0.5 h-3 bottom-0 bg-gray-6" />
      <div class="absolute left-0 w-2 h-5 -top-[10px] bg-gray-6" />
      <div class="absolute right-0 w-2 h-5 -top-[10px] bg-gray-6" />
    </div>
    <div
      class="z-10 relative -mt-[5px] pb-2 flex flex-col
             overflow-y-auto rounded-b-3xl bg-gray-6
             border border-t-0 border-gray-6 focus:!ring-0"
      use:melt={$menu}
    >
      {#each options as item}
        <div
          class="relative cursor-pointer p-1.5 px-3
                 focus:z-10 data-[disabled]:opacity-50
                 whitespace-nowrap overflow-x-hidden"
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
