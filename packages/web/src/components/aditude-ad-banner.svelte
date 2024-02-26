<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount, afterUpdate } from 'svelte'

  let mobile = isMobileTest(navigator.userAgent)
  let isClosed = false

  onMount(() => {
    // document.addEventListener('astro:page-load', () => {
    //   if (isClosed) {
    //     isClosed = false
    //   }
    // })

    return () => {
      if (window.tude) {
        tude.cmd.push(() => {
          tude.destroyAds(['pb-slot-anchor'])
        })
      }
    }
  })

  afterUpdate(() => {
    if (isNotSubscriber && !isClosed) {
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

  const onClickClose = () => {
    if (window.tude) {
      tude.cmd.push(() => {
        tude.destroyAds(['pb-slot-anchor'])
      })
    }
    isClosed = true
  }

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
    style:visibility={isClosed ? 'hidden' : 'visible'}
  >
    {#if !isClosed}
      <div id="pb-slot-anchor"></div>
    {/if}
    <img
      src="/share-icons/x.svg"
      class="w-4 h-4 absolute top-0.5 right-0.5 sm:right-1 cursor-pointer"
      alt="close"
      on:click={onClickClose}
    />
  </div>
{/if}
