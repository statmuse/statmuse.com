<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<script lang="ts">
  import { session } from '@lib/stores'

  let isOpen = true

  const onClickClose = () => {
    isOpen = false
  }

  $: isNotSubscriber =
    ($session?.type === 'user' &&
      $session?.properties.subscriptionStatus !== 'active') ||
    ($session?.type === 'visitor' && !$session?.properties.bot)
</script>

{#if isNotSubscriber && isOpen}
  <div {...$$props}>
    <slot />
    <img
      src="/share-icons/x.svg"
      class="w-4 h-4 absolute top-0 right-0 cursor-pointer box-content p-0.5"
      alt="close"
      on:click={onClickClose}
    />
  </div>
{/if}
