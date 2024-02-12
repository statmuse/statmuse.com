<script lang="ts">
  import {
    createSelect,
    melt,
    type CreateSelectProps,
    type SelectOption,
  } from '@melt-ui/svelte'
  import Chevron from '@components/icons/chevron.svelte'

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

<div class={`${$$props.class ?? ''} flex flex-col gap-1`}>
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label class="block" class:hidden={hideLabel} use:melt={$labelElement}>
    {label}
  </label>
  <button
    class={`flex h-10 items-center justify-between 
           font-semibold border border-gray-6
           p-1.5 px-3 rounded-3xl
           ${$open ? 'bg-gray-6' : 'bg-gray-8'}`}
    use:melt={$trigger}
    aria-label={label}
  >
    {$selectedLabel || 'Select an option'}
    <Chevron
      class={`text-gray-0 w-5 aspect-square ${$open ? 'rotate-180' : ''}`}
    />
  </button>
  {#if $open}
    <div class="relative -mt-[18px]">
      <div class="absolute inset-0 top-[10px] h-3 bottom-0 bg-gray-6" />
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
          class="relative cursor-pointer text-neutral-800 p-1.5 px-3
                 hover:bg-magnum-100 focus:z-10
                 focus:text-magnum-700
                 data-[highlighted]:bg-magnum-200
                 data-[highlighted]:text-magnum-900
                 data-[disabled]:opacity-50"
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
