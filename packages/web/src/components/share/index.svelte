<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@components/icon.svelte'
  import { isMobileTest } from '@lib/useragent'
  import { createAskPath } from '@statmuse/core/path'
  import { isShareModalOpen } from '@lib/stores'

  export let url: string
  export let query: string
  export let domain: string

  let mobile = false
  onMount(() => {
    mobile = isMobileTest(navigator.userAgent)
  })

  const clickHandler = () => {
    if (mobile && navigator.share) {
      const shareUrl =
        url || `${window.location.origin}${createAskPath({ query, domain })}`
      try {
        navigator.share({ url: shareUrl })
      } catch (e) {}
      return
    }
    isShareModalOpen.set(!$isShareModalOpen)
  }
</script>

<Icon name="share" class="w-5 h-5 cursor-pointer" on:click={clickHandler} />
