<script lang="ts">
  import { session } from '@lib/session-store'
  import { onMount } from 'svelte'

  onMount(() => {
    return () => {
      if (window.freestar) {
        freestar.deleteAdSlots('statmuse_incontent_1')
      }
    }
  })
</script>

{#if ($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot)}
  <script data-cfasync="false" type="text/javascript" data-astro-exec>
    if (window.freestar) {
      freestar.queue.push(function () {
        freestar.newAdSlots([
          {
            placementName: 'statmuse_incontent_1',
            slotId: 'statmuse_incontent_1',
          },
        ])
      })
    }
  </script>
  <div
    align="center"
    data-freestar-ad="__300x250 __300x250"
    id="statmuse_incontent_1"
  ></div>
{/if}
