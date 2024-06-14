<script lang="ts">
  import { session } from '@lib/stores'
  import { onMount } from 'svelte'
  import Panel from '@components/panel.svelte'
  import { isMobileTest } from '@lib/useragent'
  import { throttle } from 'lodash-es'

  export let league: string
  export let onlyMobile = false
  export let onlyDesktop = false

  let container: HTMLElement
  let video: HTMLElement
  let observer: IntersectionObserver

  let isMobile: boolean
  let shouldRender: boolean

  onMount(() => {
    isMobile = isMobileTest(navigator.userAgent)
    shouldRender = onlyMobile ? isMobile : onlyDesktop ? !isMobile : true

    if (container) {
      document.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        document.removeEventListener('scroll', handleScroll)
      }
      if (observer) {
        observer.unobserve(container)
      }
      if (video) {
        video.replaceChildren()
      }
    }
  })

  const getVerticalOffset = (element: HTMLElement | null) => {
    let verticalPosition = 0
    while (element) {
      verticalPosition += element.offsetTop
      element = element.offsetParent as HTMLElement | null
    }
    return verticalPosition
  }

  const handleScroll = throttle(() => {
    const offset = getVerticalOffset(container)
    if (window.scrollY + window.innerHeight < offset - 50) {
      container.style.setProperty('transform', 'scale(0,0)', 'important')
    } else {
      container.style.setProperty('transform', 'none', 'important')
    }
  }, 300)

  $: isNotSubscriber =
    ($session?.type === 'user' &&
      $session?.properties.subscriptionStatus !== 'active') ||
    ($session?.type === 'visitor' && !$session?.properties.bot)

  $: if (isNotSubscriber && container && 'IntersectionObserver' in window) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }

    const callback = (
      entries: IntersectionObserverEntry[],
      self: IntersectionObserver,
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && container) {
          window.segment.track('View Video')
          self.unobserve(entry.target)
        }
      })
    }

    observer = new IntersectionObserver(callback, options)

    observer.observe(container)
  }
</script>

<div
  bind:this={container}
  class={`${$$props.class} aspect-video overflow-clip rounded-2xl`}
  class:hidden={$session !== undefined && (!shouldRender || !isNotSubscriber)}
>
  {#if isNotSubscriber && shouldRender}
    {#if import.meta.env.PROD}
      {#if league === 'nba'}
        <div
          bind:this={video}
          class="s2nPlayer k-WS5Rl6qj"
          data-type="float"
        ></div>
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=WS5Rl6qj&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else if league === 'nfl'}
        <div bind:this={video} class="s2nPlayer k-LT4Y9uw1" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=LT4Y9uw1&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else if league === 'nhl'}
        <div
          bind:this={video}
          class="s2nPlayer k-bMGNbhM1"
          data-type="float"
        ></div>
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=bMGNbhM1&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else if league === 'mlb'}
        <div bind:this={video} class="s2nPlayer k-hYWeRTR4" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=hYWeRTR4&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else if league === 'pga'}
        <div bind:this={video} class="s2nPlayer k-G4ZAb39z" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=G4ZAb39z&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else if league === 'money'}
        <div bind:this={video} class="s2nPlayer k-sDqs3wE9" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=sDqs3wE9&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {:else}
        <div bind:this={video} class="s2nPlayer k-ZRRhGcJz" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=ZRRhGcJz&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
          data-astro-exec
        ></script>
      {/if}
    {:else}
      <Panel class="flex items-center justify-center h-full">
        Video Player
      </Panel>
    {/if}
  {/if}
</div>
