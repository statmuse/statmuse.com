<script lang="ts">
  import { session } from '@lib/stores'
  import { onMount } from 'svelte'
  import Panel from '@components/panel.svelte'
  import { isMobileTest } from '@lib/useragent'

  export let league: string
  export let onlyMobile = false

  let container: HTMLElement
  let video: HTMLElement
  let observer: IntersectionObserver

  const isMobile = isMobileTest(navigator.userAgent)
  const shouldRender = onlyMobile ? isMobile : true

  onMount(() => {
    return () => {
      if (observer) {
        observer.unobserve(container)
      }
      if (video) {
        video.replaceChildren()
      }
    }
  })

  $: if ('IntersectionObserver' in window && container) {
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

  $: isNotSubscriber =
    ($session?.type === 'user' &&
      $session?.properties.subscriptionStatus !== 'active') ||
    ($session?.type === 'visitor' && !$session?.properties.bot)
</script>

{#if isNotSubscriber && shouldRender}
  {#if import.meta.env.PROD}
    <div
      bind:this={container}
      class={`${$$props.class} overflow-hidden rounded-2xl`}
    >
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
    </div>
  {:else}
    <Panel
      class={`${$$props.class} aspect-video flex items-center justify-center`}
    >
      Video Player
    </Panel>
  {/if}
{/if}
