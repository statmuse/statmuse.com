<script lang="ts">
  import { onMount } from 'svelte'
  import UserMenu from '@components/user-menu.svelte'
  import { createDropdownMenu, melt } from '@melt-ui/svelte'
  import { fly } from 'svelte/transition'
  import { fetchSession } from '@lib/fetch-session'

  export let collapsible = false
  let loaded = false
  let signedIn: boolean | undefined

  onMount(async () => {
    const session = await fetchSession()

    loaded = true
    signedIn = session.type === 'user'
  })

  const {
    elements: { trigger, menu, item },
    states: { open },
  } = createDropdownMenu({
    forceVisible: true,
  })
</script>

<div {...$$restProps}>
  {#if !loaded}
    <div />
  {:else if signedIn}
    <UserMenu />
  {:else if collapsible}
    <div class="hidden md:flex space-x-5 items-center">
      <a
        href="/auth/signin"
        class="no-underline hover:underline text-team-secondary-sm-default whitespace-nowrap"
      >
        Sign in
      </a>
      <a
        href="/auth/signup"
        class="items-center justify-center border border-team-secondary-sm-default rounded-md hover:text-team-secondary-sm-default hover:bg-team-primary hover:border-team-secondary-sm-default hover:border hover:no-underline py-1 px-4 bg-team-secondary-sm-default text-team-primary whitespace-nowrap"
      >
        Sign up
      </a>
    </div>

    <button
      type="button"
      class="md:hidden flex max-w-xs items-center text-sm focus:outline-none focus:ring-2 focus:ring-team-secondary-sm-default focus:ring-offset-2"
      use:melt={$trigger}
      aria-label="Open auth menu"
    >
      <span class="sr-only">Open auth menu</span>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 29.2 22.7"
        xml:space="preserve"
        class="w-[25px] h-[25px] relative cursor-pointer fill-team-secondary"
      >
        <path
          d="M27,19.2H2.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5H27c0.3,0,0.5,0.2,0.5,0.5S27.3,19.2,27,19.2z"
        ></path>
        <path
          d="M27,11.8H2.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5H27c0.3,0,0.5,0.2,0.5,0.5S27.3,11.8,27,11.8z"
        ></path>
        <path
          d="M27,4.4H2.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5H27c0.3,0,0.5,0.2,0.5,0.5S27.3,4.4,27,4.4z"
        ></path>
      </svg>
    </button>

    {#if $open}
      <div
        class="flex max-h-[300px] min-w-[220px] flex-col shadow-md z-20 rounded-md bg-white py-1 lg:max-h-none ring-1 ring-black ring-opacity-5"
        use:melt={$menu}
        transition:fly={{ duration: 150, y: -10 }}
      >
        <a
          href="/auth/signin"
          class="z-30 block px-4 py-2 text-sm text-gray-700 no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 data-[disabled]:text-neutral-300 ring-0"
          use:melt={$item}
        >
          Sign in
        </a>
        <a
          href="/auth/signup"
          class="z-30 block px-4 py-2 text-sm text-gray-700 no-underline hover:no-underline data-[highlighted]:text-gray-900 data-[highlighted]:bg-gray-100 data-[disabled]:text-neutral-300 ring-0"
          use:melt={$item}
        >
          Sign up
        </a>
      </div>
    {/if}
  {:else}
    <div class="flex space-x-5 items-center">
      <a
        href="/auth/signin"
        class="no-underline hover:underline text-team-secondary-sm-default whitespace-nowrap"
      >
        Sign in
      </a>
      <a
        href="/auth/signup"
        class="items-center justify-center border border-team-secondary-sm-default rounded-md hover:text-team-secondary-sm-default hover:bg-team-primary hover:border-team-secondary-sm-default hover:border hover:no-underline py-1 px-4 bg-team-secondary-sm-default text-team-primary whitespace-nowrap"
      >
        Sign up
      </a>
    </div>
  {/if}
</div>
