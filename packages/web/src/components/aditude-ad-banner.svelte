<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount, afterUpdate } from 'svelte'

  let mobile = isMobileTest(navigator.userAgent)

  let renderAd = false

  onMount(() => {
    return () => {
      if (window.tude) {
        tude.destroyAds(['pb-slot-anchor'])
      }
    }
  })

  afterUpdate(() => {
    if (isNotSubscriber && !renderAd) {
      window.tude = window.tude || { cmd: [] }
      tude.cmd.push(function () {
        tude.refreshAdsViaDivMappings([
          {
            divId: 'pb-slot-anchor',
            baseDivId: 'pb-slot-anchor',
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

{#if import.meta.env.PROD && isNotSubscriber}
  <div
    class="fixed bottom-0 right-0 w-screen z-50 flex justify-center"
    style:min-height={mobile ? '50px' : '90px'}
    style:background="#f7f7f7e6"
  >
    <div id="pb-slot-anchor"></div>
  </div>
{/if}