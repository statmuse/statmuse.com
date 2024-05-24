<script lang="ts">
  import { session } from '@lib/stores'

  $: isSubscriber =
    $session?.type === 'user' &&
    $session.properties.subscriptionStatus === 'active'
</script>

{#if $session}
  {#if isSubscriber}
    <slot name="subscribed" />
  {:else}
    <slot />
  {/if}
{/if}
