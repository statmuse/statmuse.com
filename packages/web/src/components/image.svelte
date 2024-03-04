<script lang="ts">
  import { cdnBaseUrl, type GameraResponse } from '@statmuse/core/gamera'
  import type { HTMLImgAttributes } from 'svelte/elements'
  import type { Answer } from '@statmuse/core/question'

  interface $$Props
    extends Omit<HTMLImgAttributes, 'src' | 'alt' | 'width' | 'height'> {
    src: string | { answer: Answer }
    alt: string
    width: number
    height: number
  }

  export let source: $$Props['src'],
    alt: $$Props['alt'],
    width: $$Props['width'],
    height: $$Props['height']
  export { source as src }

  const getUrl = (src: string | { answer: Answer } | undefined) => {
    if (!src || typeof src === 'string') return src
    const answer = src.answer as GameraResponse
    const subject = answer.visual.summary.subject
    return subject.imageUrl
  }

  const getImageUrl = (src: string | { answer: Answer }) => {
    const raw = getUrl(src)
    if (!raw) return undefined
    const url = raw.startsWith('http') ? raw : `${cdnBaseUrl}/${raw}`
    return url
  }

  const imageUrl = getImageUrl(source)
  const src = imageUrl
    ? `/_image?href=${encodeURIComponent(
        imageUrl,
      )}&f=webp&w=${width}&h=${height}`
    : undefined
</script>

{#if source}
  <img {src} {alt} {width} {height} {...$$restProps} />
{:else}
  <div />
{/if}
