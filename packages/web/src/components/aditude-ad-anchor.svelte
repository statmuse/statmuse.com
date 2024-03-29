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
          tude.destroyAds(['pb-slot-banner'])
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
            divId: 'pb-slot-banner',
            baseDivId: 'pb-slot-banner',
          },
        ])
      })
    }
  })

  const onClickClose = () => {
    if (window.tude) {
      tude.cmd.push(() => {
        tude.destroyAds(['pb-slot-banner'])
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
    class="fixed bottom-0 left-0 md:left-1/2 md:-translate-x-1/2 w-screen md:w-fit z-50 flex justify-center md:pr-5"
    style:min-height={mobile ? '50px' : '90px'}
    style:background="#f7f7f7e6"
    style:visibility={isClosed ? 'hidden' : 'visible'}
  >
    {#if !isClosed}
      <div id="pb-slot-banner"></div>
    {/if}
    <img
      src="/share-icons/x.svg"
      class="w-4 h-4 absolute top-0 right-0 cursor-pointer box-content p-0.5"
      alt="close"
      on:click={onClickClose}
    />
  </div>
{/if}
