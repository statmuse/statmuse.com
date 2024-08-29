<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<script lang="ts">
  import { first } from 'lodash-es'

  export let toggleOptions:
    | { label: string; value: string; title: string }[]
    | undefined = undefined
  export let title: string = ''

  let selectedOption = first(toggleOptions)
</script>

<div class="mt-2 mb-1 px-3 flex items-center justify-between">
  <h3 class="font-semibold">
    {selectedOption?.title ?? title}
  </h3>
  {#if toggleOptions}
    <div
      class="w-fit bg-gray-6 dark:bg-gray-4 text-gray-5 border border-gray-6 dark:border-gray-3 flex text-center rounded-full relative overflow-clip"
    >
      <div
        class="absolute h-full w-1/2 bg-gray-8 dark:bg-gray-7 rounded-full left-0 group-has-[#standings-away:checked]:translate-x-0 group-has-[#standings-home:checked]:translate-x-full transition-transform ease-out"
        class:translate-x-0={selectedOption?.value === toggleOptions[0].value}
        class:translate-x-full={selectedOption?.value ===
          toggleOptions[1].value}
      />
      {#each toggleOptions as option (option)}
        <span
          class="py-1 w-12 relative cursor-pointer"
          class:text-gray-2={selectedOption?.value === option.value}
          on:click={() => (selectedOption = option)}
        >
          {option.label}
        </span>
      {/each}
    </div>
  {/if}
</div>

{#if selectedOption && selectedOption.value === toggleOptions?.[0].value}
  <slot name="first" />
{/if}
{#if selectedOption && selectedOption.value === toggleOptions?.[1].value}
  <slot name="second" />
{/if}
<slot />
