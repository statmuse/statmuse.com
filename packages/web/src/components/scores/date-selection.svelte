<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'

  export let days: string[]
  export let selectedDate: string | null
  export let basePath: string

  let container: HTMLElement

  const today = dayjs()

  onMount(() => {
    const parent = container.getBoundingClientRect()
    const day = selectedDate ?? today.format('YYYY-MM-DD')
    const selected = container.querySelector<HTMLElement>(`[data-day="${day}"]`)
    if (selected) {
      const elem = selected.getBoundingClientRect()
      container.scrollLeft =
        elem.left - parent.left + (elem.width - parent.width) / 2
    }
  })
</script>

<div
  bind:this={container}
  class={`flex gap-3 overflow-x-scroll no-scrollbar ${$$props.class}`}
>
  {#each days as day (day)}
    {@const date = dayjs(day)}
    <div
      class="group/day-nav flex flex-col gap-1.5 overflow-clip shrink-0"
      data-day={day}
    >
      <a
        href={`${basePath}?${new URLSearchParams({
          date: date.format('YYYY-MM-DD'),
        }).toString()}`}
        class="text-inherit hover:no-underline"
      >
        {date.date() === today.date()
          ? 'Today'
          : date.date() === dayjs().subtract(1, 'day').date()
          ? 'Yesterday'
          : date.date() === dayjs().add(1, 'day').date()
          ? 'Tomorrow'
          : date.format('ddd MMM D')}
      </a>
      <div
        class={`hidden w-full h-5 -mb-2.5 bg-current rounded-2xl ${
          day !== selectedDate ? 'md:group-hover/day-nav:block' : ''
        }`}
        class:!block={day === selectedDate ||
          (selectedDate === null && date.date() === today.date())}
      />
    </div>
  {/each}
</div>
