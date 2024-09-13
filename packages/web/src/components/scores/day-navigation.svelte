<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'

  export let days: string[]
  export let selectedDate: string
  export let basePath: string

  let container: HTMLElement

  onMount(() => {
    const parent = container.getBoundingClientRect()
    const selected = container.querySelector<HTMLElement>('[data-selected]')

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
      {...day === selectedDate ? { 'data-selected': '' } : {}}
    >
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
        class={`w-full h-5 -mb-2.5 bg-current rounded-2xl ${
          day !== selectedDate ? 'md:group-hover/day-nav:block' : ''
        }`}
        class:hidden={day !== selectedDate}
      />
    </div>
  {/each}
</div>
