<script lang="ts">
  import { orderBy, some } from 'lodash-es'
  import { session } from '@lib/session-store'
  import type { GameraGrid } from '@statmuse/core/gamera'

  const freeRowLimit = 25

  type Column = GameraGrid['columns'][0] & {
    hasImage?: boolean
    sticky?: boolean
  }
  type Row = GameraGrid['rows'][0][string]

  export let data: GameraGrid
  export let stickyColumns: string[] = []
  export let limitRows: boolean = false
  export let fullWidth: boolean = true

  let sortKey = ''
  let sortOrder: 'asc' | 'desc'
  let expand = false

  let columns = data.columns.flatMap((col) => {
    const isSticky = stickyColumns.includes(col.rowItemKey)
    const hasImage = some(data.rows, `${col.rowItemKey}.imageUrl`)

    if (isSticky && hasImage) {
      return [
        { rowItemKey: 'IMAGE', title: '', type: 'string' },
        { ...col, sticky: true },
      ]
    }

    if (isSticky) {
      return { ...col, sticky: true }
    }

    if (hasImage) {
      return { ...col, hasImage: true }
    }

    return col
  }) as Column[]

  if (!some(columns, 'sticky')) {
    const [firstColumn, ...rest] = columns
    columns = [{ ...firstColumn, sticky: true }, ...rest]
  }

  const allRows = data.rows.map((row) =>
    stickyColumns.reduce((r, key) => {
      if (r[key]?.imageUrl) {
        return {
          ...r,
          [key]: {
            ...r[key],
            imageUrl: undefined,
          },
          IMAGE: r[key],
        }
      }
      return r
    }, row),
  )

  let rows = limitRows ? allRows.slice(0, 25) : allRows

  const textAlign = (col: Column) => {
    switch (col.type) {
      case 'date':
      case 'number':
      case 'time':
        return 'text-right'
      case 'string':
        return 'text-left'
      default:
        return 'text-center'
    }
  }

  const imgClass = ({ imageUrl = '', entity }: Row) => {
    if (entity?.type.includes('player')) {
      return [
        'w-6',
        'h-6',
        'max-w-none',
        'object-cover',
        'rounded-full',
        'bg-white',
        imageUrl.includes('silhouette') ? 'opacity-50' : '',
      ]
        .filter((x) => x)
        .join(' ')
    }
    return 'w-4 h-4 max-w-none object-contain'
  }

  const onClickSort = (key: string) => () => {
    sortOrder = sortKey.includes(key) && sortOrder === 'desc' ? 'asc' : 'desc'
    sortKey = `${key}.value`
  }

  const onClickExpand = (e) => {
    e.preventDefault()
    expand = !expand
  }

  const dateRegex = /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(\d+\/\d+)/
  const scoreRegex = /(W|L)\s(\d+-\d+)/

  $: {
    if (limitRows) {
      if (
        $session?.type === 'user' &&
        $session.properties.subscriptionStatus === 'active'
      ) {
        rows = expand ? allRows : allRows.slice(0, 25)
      }
    } else {
      rows = allRows
    }
  }

  $: {
    if (sortKey) {
      rows = orderBy(rows, sortKey, sortOrder)
    }
  }
</script>

<div class="relative">
  <div class="relative overflow-x-auto">
    <table class="text-[15px] whitespace-nowrap" class:w-full={fullWidth}>
      <thead>
        <tr class="text-xs text-team-secondary uppercase tracking-[0.07rem]">
          {#each columns as col (col.title)}
            <th
              class={`first:rounded-l last:rounded-r bg-team-primary cursor-pointer font-normal p-1.5 ${textAlign(
                col,
              )}`}
              class:pl-8={col.hasImage}
              class:sticky={col.sticky}
              class:left-0={col.sticky}
              on:click={onClickSort(col.rowItemKey)}
            >
              {col.title}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody class="divide-y divide-[#c7c8ca] leading-[22px]">
        {#each rows as row (row)}
          <tr>
            {#each columns as col (row[col.rowItemKey])}
              {@const { display, imageUrl } = row[col.rowItemKey]}
              <td
                class={`${textAlign(col)} px-2`}
                class:py-1={!imageUrl}
                class:sticky={col.sticky}
                class:left-0={col.sticky}
                class:bg-white={col.sticky && !sortKey.includes(col.rowItemKey)}
                class:bg-[#fffbec]={sortKey.includes(col.rowItemKey)}
                class:w-2={imageUrl}
              >
                {#if col.rowItemKey === 'IMAGE'}
                  {#if imageUrl}
                    <img
                      src={imageUrl}
                      alt={display}
                      class={imgClass(row[col.rowItemKey])}
                    />
                  {/if}
                {:else if col.hasImage}
                  <div class="flex items-center">
                    {#if imageUrl}
                      <img
                        src={imageUrl}
                        alt={display}
                        class={`${imgClass(row[col.rowItemKey])} mr-2.5`}
                      />
                    {:else}
                      <div class="w-4 h-4 mr-2.5" />
                    {/if}
                    {display}
                  </div>
                {:else if dateRegex.test(display)}
                  {@const [, day, date] = display.match(dateRegex)}
                  <div class="flex">
                    <div class="w-8">{day}</div>
                    <div>{date}</div>
                  </div>
                {:else if scoreRegex.test(display)}
                  {@const [, result, score] = display.match(scoreRegex)}
                  <div class="flex">
                    <div class="w-5">{result}</div>
                    <div>{score}</div>
                  </div>
                {:else}
                  {display}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
      {#if limitRows && allRows.length > freeRowLimit && ($session?.type === 'visitor' || $session?.properties.subscriptionStatus !== 'active')}
        <tbody>
          {#each Array(3) as _row}
            <tr class="border-t border-[#c7c8ca]/30">
              {#each columns as col}
                <td
                  class={`${textAlign(col)} px-2 py-1`}
                  class:sticky={col.sticky}
                  class:left-0={col.sticky}
                  class:bg-white={col.sticky}
                >
                  {#if col.rowItemKey === 'IMAGE'}
                    <div class="flex items-center h-[22px]">
                      <div class="bg-[#c7c8ca]/30 h-5 w-5 rounded-full" />
                    </div>
                  {:else if col.hasImage}
                    <div class="flex items-center gap-2.5 h-[22px]">
                      <div class="bg-[#c7c8ca]/30 h-4 w-4 rounded-full" />
                      <div class="bg-[#c7c8ca]/30 h-5 flex-1 rounded-md" />
                    </div>
                  {:else}
                    <div class="flex items-center h-[22px]">
                      <div class="bg-[#c7c8ca]/30 w-full h-5 rounded-md" />
                    </div>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      {/if}
    </table>
  </div>
  {#if limitRows && allRows.length > freeRowLimit && ($session?.type === 'visitor' || $session?.properties.subscriptionStatus !== 'active')}
    <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
      <a
        href="/auth/signup"
        class="flex gap-2 items-center w-fit py-3 px-4 bg-primary text-white text-lg rounded-md hover:no-underline"
      >
        <span class="shrink-0 mt-[1px]">Unlock 2x data</span>
      </a>
    </div>
  {/if}
  {#if limitRows && allRows.length > freeRowLimit && $session?.type === 'user' && $session.properties.subscriptionStatus === 'active'}
    <div class="border-y border-[#c7c8ca] py-1 mt-0.5" on:click={onClickExpand}>
      <a href="#" class="text-primary flex items-center justify-center gap-2">
        Show {expand ? 'less' : 'more'}
        <span
          class="w-[18px] h-[18px] bg-primary bg-[url('/icons/arrow.svg')] bg-[length:85%] bg-center rounded-full"
          class:rotate-180={!expand}
        ></span>
      </a>
    </div>
  {/if}
</div>