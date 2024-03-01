<script lang="ts">
  import UserMenu from '@components/user-menu.svelte'
  import { session } from '@lib/session-store'
</script>

<div {...$$restProps}>
  {#if !$session || $session.type !== 'user'}
    <a
      href="/auth/signup"
      class="py-1.5 px-4 text-sm items-center justify-center
             text-teal bg-gray-8 border border-gray-6 rounded-3xl whitespace-nowrap
             hover:text-team-secondary-sm-default hover:bg-team-primary hover:border-team-secondary-sm-default hover:border hover:no-underline"
      class:invisible={!$session}
    >
      Sign up/in
    </a>
  {:else}
    <UserMenu />
  {/if}
</div>
