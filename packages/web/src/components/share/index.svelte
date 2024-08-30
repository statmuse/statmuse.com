<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@components/icon.svelte'
  import { isMobileTest } from '@lib/useragent'
  import { isShareModalOpen } from '@lib/stores'

  export let url: string
  export let shortCode: string

  let mobile = false
  onMount(() => {
    mobile = isMobileTest(navigator.userAgent)
  })

  const clickHandler = () => {
    if (mobile && navigator.share) {
      const shareUrl = shortCode
        ? `${
            import.meta.env.PUBLIC_SHORT_LINK_URL || 'http://localhost:3000/'
          }e/${shortCode}`
        : url || window.location.href
      try {
        navigator.share({ url: shareUrl })
      } catch (e) {}
      return
    }
    isShareModalOpen.set(!$isShareModalOpen)
  }
</script>

<Icon name="share" class="w-5 h-5 cursor-pointer" on:click={clickHandler} />
