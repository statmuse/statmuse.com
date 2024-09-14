<script lang="ts">
  import Icon from '@components/icon.svelte'
  import dayjs from 'dayjs'

  export let selectedDate: string | null
  export let basePath: string

  const date = selectedDate ? dayjs(selectedDate) : undefined
  const today = dayjs()
</script>

<div
  class="w-32 py-0.5 px-2 rounded-2xl flex justify-between items-center bg-team-secondary text-team-primary"
>
  <a
    href={`${basePath}?${new URLSearchParams({
      date: (date ?? today).subtract(1, 'day').format('YYYY-MM-DD'),
    }).toString()}`}
    class="text-inherit"
  >
    <Icon name="next" class="w-4 h-4 rotate-180" />
  </a>
  {selectedDate === null || date?.date() === today.date()
    ? 'Today'
    : date?.date() === today.subtract(1, 'day').date()
    ? 'Yesterday'
    : date?.date() === today.add(1, 'day').date()
    ? 'Tomorrow'
    : date?.format('ddd MMM D')}
  <a
    href={`${basePath}?${new URLSearchParams({
      date: (date ?? today).add(1, 'day').format('YYYY-MM-DD'),
    }).toString()}`}
    class="text-inherit"
  >
    <Icon name="next" class="w-4 h-4" />
  </a>
</div>
