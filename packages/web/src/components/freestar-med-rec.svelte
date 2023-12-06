<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount } from 'svelte'
  let mobile = isMobileTest(navigator.userAgent)

  onMount(() => {
    if (window.freestar && mobile) {
      freestar.queue.push(function () {
        freestar.newAdSlots([
          {
            placementName: 'statmuse_incontent_1',
            slotId: 'statmuse_incontent_1',
          },
        ])
      })
    }
    return () => {
      if (window.freestar) {
        freestar.queue.push(function () {
          freestar.deleteAdSlots('statmuse_incontent_1')
        })
      }
    }
  })
</script>

{#if import.meta.env.PROD && mobile && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <div
    align="center"
    data-freestar-ad="__300x250 __300x250"
    id="statmuse_incontent_1"
  ></div>
{/if}
