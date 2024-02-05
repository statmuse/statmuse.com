<script lang="ts">
  import { session } from '@lib/session-store'
  import { isMobileTest } from '@lib/useragent'
  import { onMount } from 'svelte'

  export let slotId = 'statmuse_incontent_cards'

  let container: HTMLElement
  let observer: IntersectionObserver
  let mobile = isMobileTest(navigator.userAgent)

  onMount(() => {
    return () => {
      if (observer) {
        observer.unobserve(container)
      }
      if (window.freestar) {
        window.freestar.queue.push(function () {
          window.freestar.deleteAdSlots(slotId)
        })
      }
    }
  })

  $: {
    if ('IntersectionObserver' in window && container) {
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
          if (entry.isIntersecting && container) {
            if (window.freestar) {
              window.freestar.queue.push(function () {
                window.freestar.newAdSlots([
                  {
                    placementName: 'statmuse_incontent_cards',
                    slotId,
                  },
                ])
              })
            }
            self.unobserve(entry.target)
          }
        })
      }

      observer = new IntersectionObserver(callback, options)

      observer.observe(container)
    }
  }
</script>

{#if import.meta.env.PROD && (($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active') || ($session?.type === 'visitor' && !$session?.properties.bot))}
  <div bind:this={container} class=" min-h-[250px] bg-primary rounded-2xl">
    <div
      align="center"
      data-freestar-ad="__300x250 __300x250"
      id={slotId}
    ></div>
  </div>
{/if}
