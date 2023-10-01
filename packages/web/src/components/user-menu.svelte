<script lang="ts">
  import { createDropdownMenu, melt } from '@melt-ui/svelte'
  import { fly } from 'svelte/transition'

  const {
    elements: { trigger, menu, item },
    states: { open },
  } = createDropdownMenu({
    forceVisible: true,
  })
</script>

<button
  type="button"
  class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-team-secondary-sm-default focus:ring-offset-2"
  use:melt={$trigger}
  aria-label="Open user menu"
>
  <span class="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
    <svg
      class="h-full w-full text-gray-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
      ></path>
    </svg>
  </span>
  <span class="sr-only">Open User Menu</span>
</button>

{#if $open}
  <div
    class="flex max-h-[300px] min-w-[220px] flex-col shadow-md z-20 rounded-md bg-white py-1 lg:max-h-none ring-1 ring-black ring-opacity-5"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -10 }}
  >
    <a
      href="/account"
      class="z-30 block px-4 py-2 text-sm text-gray-700 no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 data-[disabled]:text-neutral-300 ring-0"
      use:melt={$item}
    >
      Your Account
    </a>
    <a
      href="/auth/sign-out"
      class="z-30 block px-4 py-2 text-sm text-gray-700 no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 data-[disabled]:text-neutral-300 ring-0"
      use:melt={$item}
      data-astro-reload
    >
      Sign out
    </a>
  </div>
{/if}
