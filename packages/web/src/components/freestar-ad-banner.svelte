<script lang="ts">
  import { session } from '@lib/session-store'
  export let enableFreestarAdBanner: boolean
</script>

{#if import.meta.env.PROD && enableFreestarAdBanner && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <script
    src="https://a.pub.network/statmuse-com/pubfig.min.js"
    data-cfasync="false"
    async
    type="module"
  ></script>
{/if}
