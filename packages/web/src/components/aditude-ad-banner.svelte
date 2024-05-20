<script lang="ts">
  import { session } from '@lib/stores'
  import { isMobileTest } from '@lib/useragent'
  import { afterUpdate, onMount } from 'svelte'

  export let divId: string
  export let slotId: string
  export let onlyMobile = false
  export let onlyDesktop = false
  export let lazy = false

  const renderAd = () => {
    window.tude = window.tude || { cmd: [] }
    tude.cmd.push(function () {
      tude.refreshAdsViaDivMappings([
        {
          divId: divId,
          baseDivId: slotId,
        },
      ])
    })
  }

  const isMobile = isMobileTest(navigator.userAgent)
  const shouldRender = onlyMobile ? isMobile : onlyDesktop ? !isMobile : true

  let container: HTMLElement
  let observer: IntersectionObserver

  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0,
  }

  const observerCallback = (
    entries: IntersectionObserverEntry[],
    self: IntersectionObserver,
  ) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && container) {
        renderAd()
        self.unobserve(entry.target)
      }
    })
  }

  onMount(() => {
    return () => {
      if (lazy && observer) {
        observer.unobserve(container)
      }
      if (window.tude) {
        tude.cmd.push(() => {
          tude.destroyAds([divId])
        })
      }
    }
  })

  afterUpdate(() => {
    if (isNotSubscriber && shouldRender) {
      if (lazy && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(observerCallback, observerOptions)
        observer.observe(container)
      } else {
        renderAd()
      }
    }
  })

  $: isNotSubscriber =
    ($session?.type === 'user' &&
      $session?.properties.subscriptionStatus !== 'active') ||
    ($session?.type === 'visitor' && !$session?.properties.bot)
</script>

{#if import.meta.env.PROD && shouldRender && isNotSubscriber}
  <div {...$$restProps} bind:this={container} id={divId}></div>
{/if}
