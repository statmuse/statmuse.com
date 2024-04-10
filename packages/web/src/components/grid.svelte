<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-invalid-attribute -->
<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import { orderBy, some } from 'lodash-es'
  import { session } from '@lib/stores'
  import type { GameraGrid } from '@statmuse/core/gamera'
  import EntityLink from '@components/entity-link.svelte'
  import Image from '@components/image.svelte'
  import Panel from '@components/panel.svelte'
  type PanelProps = ComponentProps<Panel>

  const freeRowLimit = 25

  type Column = GameraGrid['columns'][number] & {
    hasImage?: boolean
    sticky?: boolean
  }
  type RowItem = GameraGrid['rows'][number][string]

  export let data: GameraGrid | GameraGrid[]
  export let stickyColumns: string[] = []
  export let limitRows: boolean = false
  export let fullWidth: boolean = true
  export let columnStyles = {}
  export let padding = 'px-2'
  export let head = true
  export let color = false
  export let rankingRange = [10, 20]
  export let highlight: string | undefined = undefined
  export let title: PanelProps['title'] = undefined
  export let href: PanelProps['href'] = undefined
  export let entity: PanelProps['entity'] = undefined
  export let classes: string | undefined = undefined
  export { classes as class }

  const styles = Object.assign(
    { ALIGNMENT: 'w-2', SEASON: 'text-center' },
    columnStyles,
  ) as Record<string, string>

  let sortKey = ''
  let sortOrder: 'asc' | 'desc'
  let expand = false

  let grids = (Array.isArray(data) ? data : [data]).map((grid) => {
    let columns = grid.columns.flatMap((col) => {
      const isSticky = stickyColumns.includes(col.rowItemKey)
      const hasImage = some(grid.rows, `${col.rowItemKey}.imageUrl`)

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

    const allRows = grid.rows.map((row) =>
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

    return {
      ...grid,
      allRows,
      columns,
      rows,
    }
  })

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

  const applyStyles = (col: Column) => {
    const style =
      styles[col.rowItemKey] ||
      styles[col.rowItemKey.toUpperCase()] ||
      styles[col.rowItemKey.toLowerCase()] ||
      styles['default']
    if (/text\-(left|center|right)/.test(style)) {
      return style
    }
    return `${textAlign(col)} ${style ?? ''}`
  }

  const imgClass = ({ imageUrl = '', entity }: RowItem) => {
    if (entity?.type.includes('player')) {
      return [
        'w-10',
        'h-8',
        'max-w-none',
        'object-cover',
        'object-bottom',
        'bg-gray-8 dark:bg-gray-3',
        '-mb-[1px]',
        'mt-2',
        'mx-auto',
        'overflow-visible',
        imageUrl.includes('silhouette') ? 'opacity-50' : '',
      ]
        .filter((x) => x)
        .join(' ')
    }
    return 'w-4 h-4 max-w-none object-contain'
  }

  const onClickSort = (key: string) => () => {
    sortOrder = sortKey === key && sortOrder === 'desc' ? 'asc' : 'desc'
    sortKey = key
  }

  const onClickExpand = (e: Event) => {
    e.preventDefault()
    expand = !expand
  }

  const dateRegex = /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(\d+\/\d+)/
  const scoreRegex = /(W|L|T|D)\s(\d+-\d+)/

  const [topRank, bottomRank] = rankingRange
  const rankingColor = (row: RowItem, display: string) => {
    if (row?.display.includes('Rank') && display.match(/(\d+).*/)) {
      const [, num] = Array.from(display.match(/(\d+).*/) || [])
      if (Number(num) <= topRank) return 'text-[#009444]'
      if (Number(num) >= bottomRank) return 'text-[#BF1D2D]'
    }
    return ''
  }

  const shouldApplyRowHighlight = (row: RowItem, highlight?: string) => {
    if (highlight) {
      return highlight === row.value
    }
    return false
  }

  $: {
    if (limitRows) {
      if (
        $session?.type === 'user' &&
        $session.properties.subscriptionStatus === 'active'
      ) {
        grids = grids.map((grid) => ({
          ...grid,
          rows: expand ? grid.allRows : grid.allRows.slice(0, 25),
        }))
      }
    } else {
      grids = grids.map((grid) => ({
        ...grid,
        rows: grid.allRows,
      }))
    }
  }

  $: {
    if (sortKey) {
      grids = grids.map((grid) => ({
        ...grid,
        rows: orderBy(grid.rows, `${sortKey}.value`, sortOrder),
      }))
    }
  }
</script>

<Panel
  {title}
  {href}
  {entity}
  class={`${classes} pb-0 ${!fullWidth ? 'md:w-fit' : ''}`}
>
  <div class="relative overflow-x-auto no-scrollbar -mx-3">
    <table class="text-[15px] whitespace-nowrap" class:w-full={fullWidth}>
      {#each grids as grid}
        {@const { columns, rows, aggregations } = grid}
        {#if head}
          <thead>
            <tr class="text-sm uppercase tracking-[0.07rem]">
              {#each columns as col, index (col.rowItemKey)}
                <th
                  class={`cursor-pointer font-normal p-1.5 text-gray-5 ${applyStyles(
                    col,
                  )}`}
                  class:pl-8={col.hasImage}
                  class:pl-3={index === 0}
                  class:pr-3={index === columns.length - 1}
                  class:sticky={col.sticky}
                  class:left-0={col.sticky}
                  class:bg-gray-8={col.sticky}
                  class:dark:bg-gray-3={col.sticky}
                  on:click={onClickSort(col.rowItemKey)}
                >
                  {col.title}
                </th>
              {/each}
            </tr>
          </thead>
        {/if}
        <tbody
          class="divide-y leading-[22px]"
          class:divide-team-primary={color}
          class:divide-gray-6={!color}
        >
          {#each rows as row (row)}
            {@const rowHighlight = shouldApplyRowHighlight(
              row[columns[0].rowItemKey],
              highlight,
            )}
            <tr>
              {#each columns as col, index (row[col.rowItemKey])}
                {#if row[col.rowItemKey]}
                  {@const { display, imageUrl, entity } = row[col.rowItemKey]}
                  <td
                    class={`${applyStyles(col)} ${padding} ${
                      imageUrl ? 'w-2' : ''
                    } ${rankingColor(row[columns[0].rowItemKey], display)}`}
                    class:py-1={!imageUrl}
                    class:pl-3={index === 0}
                    class:pr-3={index === columns.length - 1}
                    class:sticky={col.sticky}
                    class:left-0={col.sticky}
                    class:bg-gray-8={col.sticky &&
                      !(sortKey === col.rowItemKey) &&
                      !color &&
                      !rowHighlight}
                    class:dark:bg-gray-3={col.sticky &&
                      !(sortKey === col.rowItemKey) &&
                      !color &&
                      !rowHighlight}
                    class:bg-team-secondary={color}
                    class:bg-[#e9f9ff]={rowHighlight}
                    class:bg-[#fffbec]={sortKey === col.rowItemKey}
                  >
                    <EntityLink
                      {entity}
                      class={color ? 'text-team-primary' : ''}
                    >
                      {#if col.rowItemKey === 'IMAGE'}
                        {#if imageUrl}
                          <Image
                            src={imageUrl}
                            width={40}
                            height={40}
                            alt={display}
                            class={imgClass(row[col.rowItemKey])}
                            loading="lazy"
                          />
                        {/if}
                      {:else if col.hasImage}
                        <div class="flex items-center">
                          {#if imageUrl}
                            <Image
                              src={imageUrl}
                              width={16}
                              height={16}
                              alt={display}
                              class={`${imgClass(row[col.rowItemKey])} mr-2.5`}
                              loading="lazy"
                            />
                          {:else}
                            <div class="w-4 h-4 mr-2.5" />
                          {/if}
                          {display}
                        </div>
                      {:else if dateRegex.test(display)}
                        {@const [, day, date] = Array.from(
                          display.match(dateRegex) || [],
                        )}
                        <div class="flex">
                          <div class="w-8">{day}</div>
                          <div>{date}</div>
                        </div>
                      {:else if scoreRegex.test(display)}
                        {@const [, result, score] = Array.from(
                          display.match(scoreRegex) || [],
                        )}
                        <div class="flex">
                          <div class="w-5">{result}</div>
                          <div>{score}</div>
                        </div>
                      {:else}
                        {display}
                      {/if}
                    </EntityLink>
                  </td>
                {:else}
                  <td></td>
                {/if}
              {/each}
            </tr>
          {/each}
          {#if !limitRows || (limitRows && $session?.type === 'user' && $session.properties.subscriptionStatus === 'active')}
            {#if aggregations}
              {#each aggregations as row (row)}
                <tr class="text-sm font-bold">
                  {#each columns as col, index (row[col.rowItemKey])}
                    {#if row[col.rowItemKey]}
                      {@const { display } = row[col.rowItemKey]}
                      <td
                        class={`${applyStyles(col)} ${padding} py-1`}
                        class:sticky={col.sticky}
                        class:left-0={col.sticky}
                        class:pl-3={index === 0}
                        class:pr-3={index === columns.length - 1}
                        class:bg-gray-8={col.sticky}
                        class:dark:bg-gray-3={col.sticky}
                      >
                        {display}
                      </td>
                    {:else}
                      <td></td>
                    {/if}
                  {/each}
                </tr>
              {/each}
            {/if}
          {/if}
        </tbody>
        {#if limitRows && grids[0].allRows.length > freeRowLimit && ($session?.type === 'visitor' || $session?.properties.subscriptionStatus !== 'active')}
          <tbody>
            {#each Array(3) as _row}
              <tr class="border-t border-[#c7c8ca]/30">
                {#each columns as col, index}
                  <td
                    class={`${textAlign(col)} ${padding} py-1`}
                    class:sticky={col.sticky}
                    class:pl-3={index === 0}
                    class:pr-3={index === columns.length - 1}
                    class:left-0={col.sticky}
                    class:bg-gray-8={col.sticky}
                    class:dark:bg-gray-3={col.sticky}
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
      {/each}
    </table>
  </div>
  {#if limitRows && grids[0].allRows.length > freeRowLimit && ($session?.type === 'visitor' || $session?.properties.subscriptionStatus !== 'active')}
    <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
      <a
        href="/auth/signup"
        class="flex gap-2 items-center w-fit py-3 px-4 bg-primary text-white text-xl rounded-2xl hover:no-underline"
      >
        <span class="shrink-0 mt-[1px]">Unlock 2x data</span>
        <svg
          enable-background="new 0 0 126.2 70.9"
          viewBox="0 0 126.2 70.9"
          xmlns="http://www.w3.org/2000/svg"
          class="w-10"
        >
          <path d="m51.3 1.7h15.1v67.4h-15.1z" fill="#fff"></path>
          <path
            d="m95.6 49.2c3.1-1 6-2.7 8-5.3-3.1.8-5.9 1.4-8.7 1.5-1.8.1-3.5.1-5.3-.1v-11-8.8c0-9.9-8-17.9-17.9-17.9v35.4c3.1 0 5.7 2.5 5.7 5.7v8.2c0 6.8 5.5 12.3 12.3 12.3h8.9v-8.9h-3.4c-3 0-5.5-2.5-5.5-5.5v-4.6c2-.1 4-.4 5.9-1zm-16.8-20c-1.4-1.4-1.4-3.8 0-5.2 0 1 .6 2.4 1.8 3.5 1.1 1.1 2.5 1.7 3.5 1.8-1.5 1.4-3.9 1.4-5.3-.1z"
            fill="#fff"
          ></path>
          <path d="m30.9 17.2h15.1v51.9h-15.1z" fill="#fff"></path>
          <path
            d="m10.5 28.3v20.2c0 1.8-1.1 4-3 5.9s-4.1 3-5.9 3c2.5 2.4 6.4 2.4 8.9 0v11.8h15.1v-56c-8.3 0-15.1 6.7-15.1 15.1z"
            fill="#fff"
          ></path>
          <path
            d="m113 36.2h-7.6v-28.5c4.2 0 7.6 3.4 7.6 7.6z"
            fill="#fff"
          ></path>
          <path
            d="m105.4 7.7h7.6v28.6h-7.6z"
            transform="matrix(0 -1 1 0 87.2674 131.158)"
            fill="#fff"
          ></path>
        </svg>
      </a>
    </div>
  {/if}
  {#if limitRows && grids[0].allRows.length > freeRowLimit && $session?.type === 'user' && $session.properties.subscriptionStatus === 'active'}
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
</Panel>
