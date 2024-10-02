<script lang="ts">
  import {
    getUrlForEntity as getUrlForGameraEntity,
    type GameraEntity,
  } from '@statmuse/core/gamera'
  import {
    getUrlForEntity as getUrlForKanedamaEntity,
    type KanedamaEntity,
  } from '@statmuse/core/kanedama'

  export let entity: GameraEntity | KanedamaEntity | undefined

  let url = ''

  const isKanedamaEntity = (
    x: GameraEntity | KanedamaEntity,
  ): x is KanedamaEntity => x.type === 'assetProfile' || x.type === 'btcBlock'

  if (entity && entity.id) {
    url = isKanedamaEntity(entity)
      ? getUrlForKanedamaEntity(entity)
      : getUrlForGameraEntity(entity)
  }
  let title = entity?.display ?? ''
</script>

{#if url}
  <a href={url} {title} {...$$restProps}>
    <slot />
  </a>
{:else}
  <span {...$$restProps}>
    <slot />
  </span>
{/if}
