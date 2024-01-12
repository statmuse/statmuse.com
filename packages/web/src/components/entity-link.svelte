<script lang="ts">
  import { getUrlForEntity, type GameraEntity } from '@statmuse/core/gamera'

  export let entity: GameraEntity | undefined

  let url = entity ? getUrlForEntity(entity) : ''
  let title = entity?.display ?? ''
</script>

{#if url}
  <a href={url} {title} {...$$restProps}>
    <slot />
  </a>
{:else}
  <slot />
{/if}
