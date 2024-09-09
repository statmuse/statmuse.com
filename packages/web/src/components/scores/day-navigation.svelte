<script lang="ts">
  import dayjs from 'dayjs'

  export let days: string[]
  export let selectedDay: string
  export let basePath: string
</script>

<div class={`flex gap-3 overflow-auto ${$$props.class}`}>
  {#each days as day (day)}
    {@const date = dayjs(day)}
    <div class="group flex flex-col gap-1.5 overflow-clip">
      <a
        href={`${basePath}?${new URLSearchParams({
          date: date.format('YYYY-MM-DD'),
        }).toString()}`}
        class="text-inherit hover:no-underline"
      >
        {date.date() === dayjs().date()
          ? 'Today'
          : date.date() === dayjs().subtract(1, 'day').date()
          ? 'Yesterday'
          : date.date() === dayjs().add(1, 'day').date()
          ? 'Tomorrow'
          : date.format('ddd MMM D')}
      </a>
      <div
        class="w-full h-5 -mb-2.5 bg-current rounded-2xl"
        class:hidden={day !== selectedDay}
        class:group-hover:block={day !== selectedDay}
      />
    </div>
  {/each}
</div>
