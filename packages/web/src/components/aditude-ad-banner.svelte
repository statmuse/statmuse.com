<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount, afterUpdate } from 'svelte'

  let mobile = isMobileTest(navigator.userAgent)

  let isNotSubscriber = false

  afterUpdate(() => {
    console.log('after update callback')
    if (isNotSubscriber) {
      console.log('render anchor ad: ', true)
      window.tude = window.tude || { cmd: [] }
      tude.cmd.push(function () {
        tude.refreshAdsViaDivMappings([
          {
            divId: 'pb-slot-anchor',
            baseDivId: 'pb-slot-anchor',
          },
        ])
      })
    }
  })

  $: {
    isNotSubscriber =
      ($session?.type === 'user' &&
        $session?.properties.subscriptionStatus !== 'active') ||
      ($session?.type === 'visitor' && !$session?.properties.bot)
  }
</script>

{#if import.meta.env.PROD && isNotSubscriber}
  <div
    class="fixed bottom-0 right-0 w-screen z-50 flex justify-start"
    style:min-height={mobile ? '50px' : '90px'}
    style:background="#f7f7f7e6"
  >
    <div id="pb-slot-anchor"></div>
  </div>
{/if}
