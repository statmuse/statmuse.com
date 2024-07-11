<script lang="ts">
  import dayjs from 'dayjs/esm/index'
  import advancedFormat from 'dayjs/esm/plugin/advancedFormat'
  import timezone from 'dayjs/esm/plugin/timezone'
  import dayoOfYear from 'dayjs/esm/plugin/dayOfYear'

  dayjs.extend(dayoOfYear)
  dayjs.extend(advancedFormat)

  export let timestamp

  const now = dayjs()
  const gameDay = dayjs(timestamp)

  const diff = gameDay.dayOfYear() - now.dayOfYear()
  const prefix =
    diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : gameDay.format('MMM D,')
</script>

{`${prefix} ${gameDay.format('h:mma')}`}
