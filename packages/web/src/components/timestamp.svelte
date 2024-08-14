<script lang="ts">
  import dayjs from 'dayjs/esm/index'
  import advancedFormat from 'dayjs/esm/plugin/advancedFormat'
  import dayoOfYear from 'dayjs/esm/plugin/dayOfYear'

  dayjs.extend(dayoOfYear)
  dayjs.extend(advancedFormat)

  export let timestamp
  export let dateOnly = false

  const now = dayjs()
  const gameDay = dayjs(timestamp)

  const diff = gameDay.dayOfYear() - now.dayOfYear()
  const prefix =
    diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : gameDay.format('MMM D')
</script>

{#if dateOnly}
  {prefix}
{:else}
  {`${prefix} ${gameDay.format('h:mm A')}`}
{/if}
