<script lang="ts">
  import { session } from '@lib/session-store'
  export let enableFreestarAdBanner: boolean
</script>

{#if import.meta.env.PUBLIC_STAGE === 'staging' && import.meta.env.PROD && enableFreestarAdBanner && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <script data-cfasync="false" type="text/javascript">
    var freestar = freestar || {}
    freestar.queue = freestar.queue || []
    freestar.config = freestar.config || {}
    freestar.config.enabled_slots = []
    freestar.initCallback = function () {
      if (freestar.config.enabled_slots.length === 0) {
        freestar.initCallbackCalled = false
      } else {
        freestar.newAdSlots(freestar.config.enabled_slots)
      }
    }
  </script>
  <script
    src="https://a.pub.network/statmuse-com/pubfig.min.js"
    data-cfasync="false"
    async
  ></script>
{/if}
