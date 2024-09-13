<script lang="ts">
  import Icon from '@components/icon.svelte'
  import { createDatePicker, melt } from '@melt-ui/svelte'
  import { fade } from 'svelte/transition'
  import { parseDate } from '@internationalized/date'

  export let basePath: string
  export let placement = 'bottom-start' as const
  export let defaultDate: string | undefined

  const {
    elements: {
      calendar,
      cell,
      content,
      grid,
      heading,
      nextButton,
      prevButton,
      trigger,
    },
    states: { months, headingValue, weekdays, open },
    helpers: { isDateDisabled, isDateUnavailable },
  } = createDatePicker({
    forceVisible: true,
    defaultValue: defaultDate ? parseDate(defaultDate) : undefined,
    weekdayFormat: 'short',
    positioning: {
      placement,
    },
    onValueChange: (data) => {
      if (data.next) {
        window.location.href =
          window.location.origin + `${basePath}?date=${data.next.toString()}`
      }
      return data.next
    },
  })
</script>

<span use:melt={$trigger}>
  <Icon name="calendar" class={$$props.class} />
</span>

{#if $open}
  <div transition:fade={{ duration: 100 }} use:melt={$content}>
    <div use:melt={$calendar}>
      <header>
        <button use:melt={$prevButton}>
          <Icon name="next" class="w-4 h-4 rotate-180" />
        </button>
        <div use:melt={$heading}>
          {$headingValue}
        </div>
        <button use:melt={$nextButton}>
          <Icon name="next" class="w-4 h-4" />
        </button>
      </header>
      <div>
        {#each $months as month}
          <table use:melt={$grid}>
            <thead aria-hidden="true">
              <tr>
                {#each $weekdays as day}
                  <th>
                    <div>
                      {day.slice(0, 2)}
                    </div>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each month.weeks as weekDates}
                <tr>
                  {#each weekDates as date}
                    <td
                      role="gridcell"
                      aria-disabled={$isDateDisabled(date) ||
                        $isDateUnavailable(date)}
                    >
                      <div use:melt={$cell(date, month.value)}>
                        {date.day}
                      </div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  [data-melt-popover-content] {
    @apply z-10 min-w-[320px] text-inherit rounded-lg shadow-sm bg-gray-8 dark:bg-gray-3 border border-gray-6 dark:border-gray-3;
  }

  [data-melt-calendar] {
    @apply w-full rounded-lg p-3 shadow-sm;
  }

  header {
    @apply flex items-center justify-between pb-2;
  }

  header + div {
    @apply flex items-center gap-6;
  }

  [data-melt-calendar-heading] {
    @apply font-semibold;
  }

  [data-melt-calendar-prevbutton] {
    @apply rounded-lg p-1 transition-all hover:bg-gray-5/20;
  }

  [data-melt-calendar-nextbutton] {
    @apply rounded-lg p-1 transition-all hover:bg-gray-5/20;
  }

  [data-melt-calendar-prevbutton][data-disabled] {
    @apply pointer-events-none rounded-lg p-1 opacity-40;
  }

  [data-melt-calendar-nextbutton][data-disabled] {
    @apply pointer-events-none rounded-lg p-1 opacity-40;
  }

  th {
    @apply text-sm font-semibold;

    & div {
      @apply flex h-6 w-6 items-center justify-center p-4;
    }
  }

  [data-melt-calendar-grid] {
    @apply w-full;
  }

  [data-melt-calendar-cell] {
    @apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full p-4 hover:bg-gray-5/20 focus-visible:outline-gray-5/20;
  }

  [data-melt-calendar-cell][data-selected] {
    @apply rounded-full bg-gray-2 text-gray-8 dark:bg-gray-7 dark:text-gray-2;
  }

  [data-melt-calendar-cell][data-today] {
    @apply outline outline-1 outline-gray-5/20;
  }

  [data-melt-calendar-cell][data-outside-visible-months] {
    @apply pointer-events-none cursor-default opacity-40 hover:bg-transparent;
  }

  [data-melt-calendar-cell][data-outside-month] {
    @apply pointer-events-none cursor-default text-gray-5 hover:bg-transparent;
  }
</style>
