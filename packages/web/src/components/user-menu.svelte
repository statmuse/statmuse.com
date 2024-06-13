<script lang="ts">
  import { createDropdownMenu, melt } from '@melt-ui/svelte'
  import { fly } from 'svelte/transition'
  import Icon from '@components/icon.svelte'

  const {
    elements: { trigger, menu, item },
    states: { open },
  } = createDropdownMenu({
    forceVisible: true,
  })
</script>

<button
  type="button"
  class="flex h-[36px] aspect-square items-center justify-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-team-secondary-sm-default focus:ring-offset-2"
  use:melt={$trigger}
  aria-label="Open user menu"
>
  <Icon name="profile" class="w-7 h-7" />
  <span class="sr-only">Open User Menu</span>
</button>

{#if $open}
  <div
    class="flex max-h-[300px] min-w-[220px] flex-col shadow-md z-[101]
           rounded-md bg-gray-8 dark:bg-gray-3 py-1 lg:max-h-none
           ring-1 ring-gray-1 ring-opacity-5"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -10 }}
  >
    <a
      href="/account"
      class="z-30 block px-4 py-2 text-sm text-gray-700 dark:text-inherit no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:text-inherit dark:data-[highlighted]:bg-gray-2 data-[disabled]:text-neutral-300 ring-0"
      use:melt={$item}
    >
      Your Account
    </a>
    <a
      href="/auth/sign-out"
      class="z-30 block px-4 py-2 text-sm text-gray-700 dark:text-inherit no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:text-inherit dark:data-[highlighted]:bg-gray-2 data-[disabled]:text-neutral-300 ring-0"
      use:melt={$item}
      data-astro-reload
      data-astro-prefetch="false"
    >
      Sign out
    </a>
  </div>
{/if}
