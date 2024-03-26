<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount } from 'svelte'

  export let slotId = 'statmuse_incontent_cards'
  export let baseDivId = 'pb-slot-incontent-1'

  let container: HTMLElement
  let observer: IntersectionObserver
  let mobile = isMobileTest(navigator.userAgent)

  onMount(() => {
    return () => {
      if (observer) {
        observer.unobserve(container)
      }
      if (window.tude) {
        tude.cmd.push(() => {
          tude.destroyAds([slotId])
        })
      }
    }
  })

  $: {
    if ('IntersectionObserver' in window && mobile && container) {
      const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0,
      }

      const callback = (
        entries: IntersectionObserverEntry[],
        self: IntersectionObserver,
      ) => {
        entries.forEach((entry) => {
          window.tude = window.tude || { cmd: [] }
          if (entry.isIntersecting && container) {
            tude.cmd.push(function () {
              tude.refreshAdsViaDivMappings([
                {
                  divId: slotId,
                  baseDivId: baseDivId,
                },
              ])
            })
            self.unobserve(entry.target)
          }
        })
      }

      observer = new IntersectionObserver(callback, options)

      observer.observe(container)
    }
  }
</script>

{#if import.meta.env.PROD && mobile && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <div bind:this={container} class="p-4 flex justify-center">
    <div id={slotId}></div>
  </div>
{/if}
