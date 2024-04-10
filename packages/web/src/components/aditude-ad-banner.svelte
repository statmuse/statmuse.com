<script lang="ts">
  import { session } from '@lib/stores'
  import { afterUpdate, onMount } from 'svelte'

  let renderAd = false

  onMount(() => {
    return () => {
      if (window.tude) {
        tude.cmd.push(() => {
          tude.destroyAds(['pb-slot-anchor'])
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
  <div id="pb-slot-anchor"></div>
{/if}
