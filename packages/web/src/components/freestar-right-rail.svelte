<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount } from 'svelte'
  let mobile = isMobileTest(navigator.userAgent)

  onMount(() => {
    if (window.freestar && !mobile) {
      freestar.queue.push(function () {
        freestar.newAdSlots([
          {
            placementName: 'statmuse_right_rail',
            slotId: 'statmuse_right_rail',
          },
        ])
      })
    }
    return () => {
      if (window.freestar) {
        freestar.queue.push(function () {
          freestar.deleteAdSlots('statmuse_right_rail')
        })
      }
    }
  })
</script>

{#if import.meta.env.PROD && !mobile && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <div
    align="center"
    data-freestar-ad="__300x600"
    id="statmuse_right_rail"
  ></div>
{/if}
