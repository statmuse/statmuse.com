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
  const encoded = imageUrl ? encodeURIComponent(imageUrl) : undefined
  const src = imageUrl
    ? `/_image?href=${encoded}&f=webp&w=${width}&h=${height}`
    : undefined
  const srcset = `/_image?href=${encoded}&w=${width}&h=${height}&f=webp 1x, /_image?href=${encoded}&w=${
    width * 2
  }&f=webp 2x, /_image?href=${encoded}&w=${width * 3}&f=webp 3x`
</script>

{#if source}
  <img {src} {srcset} {alt} {width} {height} {...$$restProps} />
{:else}
  <div />
{/if}
