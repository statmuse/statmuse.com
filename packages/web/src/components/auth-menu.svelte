<script lang="ts">
  import UserMenu from '@components/user-menu.svelte'
  import { session } from '@lib/session-store'
  import Icon from '@components/icon.svelte'
</script>

<div {...$$restProps}>
  {#if !$session || $session.type !== 'user'}
    <a
      href="/auth/signup"
      class="h-[36px] py-1 px-4 flex items-center justify-center text-gray-1 gap-2
             bg-gray-8 border border-gray-6 rounded-3xl whitespace-nowrap
             hover:text-team-secondary-sm-default hover:bg-team-primary
             hover:border-team-secondary-sm-default hover:border hover:no-underline"
      class:invisible={!$session}
    >
      Sign in/up <Icon name="profile" class="w-5 h-5 hidden md:block" />
    </a>
  {:else}
    <UserMenu />
  {/if}
</div>
