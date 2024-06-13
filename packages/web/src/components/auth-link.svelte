<script lang="ts">
  import { session } from '@lib/stores'
  import Icon from '@components/icon.svelte'
</script>

<div {...$$restProps}>
  {#if $session?.type === 'user'}
    <a
      href="/account"
      class="flex items-center text-inherit gap-2 whitespace-nowrap"
    >
      <Icon name="profile" class="w-5 h-5" /> Profile
    </a>
  {:else}
    <a
      href="/auth/signup"
      class="flex items-center text-inherit gap-2 whitespace-nowrap"
    >
      <Icon name="profile" class="w-5 h-5" /> Sign in/up
    </a>
  {/if}
</div>
