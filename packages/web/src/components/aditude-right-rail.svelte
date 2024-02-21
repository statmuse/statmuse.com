<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { afterUpdate, onMount } from 'svelte'

  let mobile = isMobileTest(navigator.userAgent)

  let renderAd = false

  afterUpdate(() => {
    if (isNotSubscriber && !renderAd) {
      window.tude = window.tude || { cmd: [] }
      tude.cmd.push(function () {
        tude.refreshAdsViaDivMappings([
          {
            divId: 'pb-slot-right-2',
            baseDivId: 'pb-slot-right-2',
          },
        ])
      })
      renderAd = true
    }
  })

  $: isNotSubscriber =
    ($session?.type === 'user' &&
      $session?.properties.subscriptionStatus !== 'active') ||
    ($session?.type === 'visitor' && !$session?.properties.bot)
</script>

{#if import.meta.env.PROD && !mobile && isNotSubscriber}
  <div class="w-[300px] hidden lg:block">
    <div id="pb-slot-right-2"></div>
  </div>
{/if}
