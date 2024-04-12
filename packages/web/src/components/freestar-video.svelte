<script lang="ts">
  import { session } from '@lib/session-store'
  import { onMount } from 'svelte'
  export let league: string

  let container: HTMLElement
  let video: HTMLElement
  let observer: IntersectionObserver
  let lazyLoadObserver: IntersectionObserver
  let loadVideo = false

  onMount(() => {
    return () => {
      if (observer) {
        observer.unobserve(container)
      }
      if (lazyLoadObserver) {
        lazyLoadObserver.unobserve(container)
      }
      if (video) {
        video.replaceChildren()
      }
    }
  })

  $: {
    if ('IntersectionObserver' in window && container) {
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

      lazyLoadObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[], self: IntersectionObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && container) {
              loadVideo = true
              self.unobserve(entry.target)
            }
          })
        },
        { root: null, rootMargin: '50px', threshold: 0 },
      )

      observer.observe(container)
      lazyLoadObserver.observe(container)
    }
  }
</script>

{#if ($session?.type === 'visitor' && !$session?.properties.bot) || ($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active')}
  {#if import.meta.env.DEV}
    <div
      bind:this={container}
      class={`${$$props.class} bg-gray-100 text-gray-600 h-52 rounded-md flex items-center justify-center`}
    >
      Video Ad
    </div>
  {:else}
    <div bind:this={container} class={`${$$props.class} overflow-hidden`}>
      {#if loadVideo}
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
          <div
            bind:this={video}
            class="s2nPlayer k-LT4Y9uw1"
            data-type="float"
          />
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
          <div
            bind:this={video}
            class="s2nPlayer k-hYWeRTR4"
            data-type="float"
          />
          <script
            type="text/javascript"
            src="//embed.sendtonews.com/player3/embedcode.js?fk=hYWeRTR4&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
            data-type="s2nScript"
            data-astro-exec
          ></script>
        {:else if league === 'pga'}
          <div
            bind:this={video}
            class="s2nPlayer k-G4ZAb39z"
            data-type="float"
          />
          <script
            type="text/javascript"
            src="//embed.sendtonews.com/player3/embedcode.js?fk=G4ZAb39z&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
            data-type="s2nScript"
            data-astro-exec
          ></script>
        {:else if league === 'fantasy'}
          <div
            bind:this={video}
            class="s2nPlayer k-ipKWbzce"
            data-type="float"
          />
          <script
            type="text/javascript"
            src="//embed.sendtonews.com/player3/embedcode.js?fk=ipKWbzce&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
            data-type="s2nScript"
            data-astro-exec
          ></script>
        {:else if league === 'money'}
          <div
            bind:this={video}
            class="s2nPlayer k-sDqs3wE9"
            data-type="float"
          />
          <script
            type="text/javascript"
            src="//embed.sendtonews.com/player3/embedcode.js?fk=sDqs3wE9&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
            data-type="s2nScript"
            data-astro-exec
          ></script>
        {:else}
          <div
            bind:this={video}
            class="s2nPlayer k-ZRRhGcJz"
            data-type="float"
          />
          <script
            type="text/javascript"
            src="//embed.sendtonews.com/player3/embedcode.js?fk=ZRRhGcJz&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
            data-type="s2nScript"
            data-astro-exec
          ></script>
        {/if}
      {/if}
    </div>
  {/if}
{/if}
