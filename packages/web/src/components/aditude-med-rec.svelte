<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { afterUpdate, onMount } from 'svelte'

  let mobile = isMobileTest(navigator.userAgent)

  let renderAd = false

  onMount(() => {
    return () => {
      if (window.tude) {
        tude.cmd.push(() => {
          tude.destroyAds(['pb-slot-incontent-1'])
        })
      }
    }
  })

  afterUpdate(() => {
    if (isNotSubscriber && !renderAd) {
      window.tude = window.tude || { cmd: [] }
      tude.cmd.push(function () {
        tude.refreshAdsViaDivMappings([
          {
            divId: 'pb-slot-incontent-1',
            baseDivId: 'pb-slot-incontent-1',
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

{#if import.meta.env.PROD && mobile && isNotSubscriber}
  <div id="pb-slot-incontent-1"></div>
{/if}
