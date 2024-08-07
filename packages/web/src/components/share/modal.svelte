<!-- svelte-ignore a11y-invalid-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<script lang="ts">
  import Icon from '@components/icon.svelte'
  import { isShareModalOpen } from '@lib/stores'
  import { createAskPath } from '@statmuse/core/path'
  import { onMount } from 'svelte'

  type ShareType = 'profile' | 'ask' | 'musing'
  export let type: ShareType = 'profile'
  export let shortCode: string | undefined
  export let url: string | undefined
  export let query: string = ''
  export let domain: string = ''

  let shareUrl: string
  let shortLinkUrl: string
  let checked = false
  let copied = false

  onMount(() => {
    shareUrl =
      url || `${window.location.origin}${createAskPath({ domain, query })}`
    shortLinkUrl = shortCode
      ? `${
          import.meta.env.SHORT_LINK_URL || 'http://localhost:3000/'
        }e/${shortCode}`
      : ''
  })

  const onClickClose = () => {
    isShareModalOpen.set(!$isShareModalOpen)
    checked = false
    copied = false
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      copied = true
      window.segment.track('Copy Musing Share Link', {
        href: shareLink,
      })
    } catch (err) {}
  }

  const onClickTracking = (e) => {
    window.segment.track('Click Musing Share Link', {
      href: e.target.href,
    })
  }

  $: shareLink =
    type == 'musing'
      ? !checked
        ? shortLinkUrl
        : shareUrl
      : checked
      ? shortLinkUrl
      : shareUrl
</script>

{#if $isShareModalOpen}
  <div
    class="fixed w-full h-full top-0 left-0 z-[100] bg-black/40"
    on:click={onClickClose}
  >
    <div
      class="w-[98%] max-w-[500px] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[#333] rounded-2xl px-3 py-2 overflow-clip bg-gray-7 dark:bg-gray-2 text-inherit border border-gray-6 dark:border-none text-left"
      on:click|stopPropagation
    >
      <Icon
        name="x"
        class="w-4 h-4 absolute top-2 right-3 cursor-pointer"
        alt="close"
        on:click={onClickClose}
      />
      <p class="mb-4">Share this search</p>
      <div class="flex">
        <div style:text-align="center" style:font-size="14px">
          <a
            href={'https://twitter.com/share?' +
              new URLSearchParams({ url: shareLink }).toString()}
            class="flex items-center justify-center w-16 h-16 my-1 mx-2.5 rounded-full"
            style:background="#000"
            target="_blank"
            rel="noopener noreferrer"
            on:click={onClickTracking}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 fill-white"
            >
              <title>X</title>
              <path
                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
              ></path>
            </svg>
          </a>
          X
        </div>
        <div style:text-align="center" style:font-size="14px">
          <a
            href={'https://www.facebook.com/sharer/sharer.php?' +
              new URLSearchParams({ u: shareLink }).toString()}
            class="flex items-center justify-center w-16 h-16 my-1 mx-2.5 rounded-full"
            style:background="#3C5A99"
            target="_blank"
            rel="noopener noreferrer"
            on:click={onClickTracking}
          >
            <img
              src="/share-icons/facebook-light.svg"
              class="w-7 h-7 object-contain"
              alt="Facebook"
            />
          </a>
          Facebook
        </div>
      </div>
      <div class="relative my-5 cursor-pointer" on:click={copyToClipboard}>
        <input
          class="w-full h-[42px] dark:bg-gray-3 border border-gray-6 dark:border-transparent rounded-2xl outline-none cursor-pointer px-4 pr-[70px] text-sm overflow-auto"
          type="text"
          value={shareLink}
          readonly
        />
        <span
          class="absolute top-1/2 right-4 -translate-y-1/2 text-primary font-semibold text-sm"
        >
          {copied ? 'COPIED' : 'COPY'}
        </span>
      </div>
      {#if type !== 'profile'}
        <div
          style="height: 1px; width: 100%; background-color: #e4e4e4; margin-bottom: 20px"
        />
        <div style="display: flex; align-items: center">
          <input
            on:change={() => {
              checked = !checked
              copied = false
            }}
            id="share-checkbox"
            type="checkbox"
            class="appearance-none p-0 bg-white dark:bg-gray-2 checked:bg-primary border-2 border-primary rounded-sm w-[20px] h-[20px] mr-2.5 cursor-pointer flex items-center justify-center after:content-['✓']"
            class:after:text-white={checked}
            class:after:text-transparent={!checked}
          />
          <label for="share-checkbox" style="font-size: 14px; cursor: pointer">
            {type === 'ask' ? 'Shorten link' : 'Keep answer updated'}
          </label>
        </div>
        <p style="margin-top: 1em; font-size: 14px">
          {type === 'musing' && !checked
            ? 'This answer is static and will not update'
            : 'This answer is live and will keep updating'}
        </p>
      {/if}
    </div>
  </div>
{/if}
