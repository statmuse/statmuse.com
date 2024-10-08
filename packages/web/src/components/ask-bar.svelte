<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-role-has-required-aria-props -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { throttle, uniqBy } from 'lodash-es'
  import { session, isNativeMobile } from '@lib/stores'
  import type { AskDocument } from '@statmuse/core/elastic'
  import { isMobileTest } from '@lib/useragent'
  import Icon from '@components/icon.svelte'

  export let query: string = ''
  export let conversationToken: string = ''
  export let preferredDomain: string = ''
  export let money: boolean
  export let autoFocus = false

  let timestamp: string = new Date().toISOString()
  let sections: {
    type: 'ask' | 'example' | 'history'
    suggestions: AskDocument[]
  }[] = []
  let sectionIdx: number | undefined
  let suggestionIdx: number | undefined
  let input: HTMLInputElement
  let shadowInput: HTMLTextAreaElement
  let spacer: HTMLElement
  let form: HTMLFormElement
  let clickedItem = false
  let inFocus = false
  let expand: boolean = false
  let isMobile = false // initialize

  if (preferredDomain === 'fc') preferredDomain = 'epl'

  const action = money ? '/money/ask' : '/ask'
  const placeholder = money
    ? 'Search stocks, FX or bitcoin'
    : preferredDomain === 'epl'
    ? 'Search players, clubs or stats'
    : 'Search players, stats or odds'
  const apiUrl = `${import.meta.env.PUBLIC_API_URL}${
    money ? '/money/search/suggest' : '/search/suggest'
  }`

  const storeQuery = (query: string) => {
    const context = money ? 'money' : 'sports'
    const storageItem = localStorage.getItem(`query.${context}`)
    const queryHistory = storageItem ? JSON.parse(storageItem) : []

    localStorage.setItem(
      `query.${context}`,
      JSON.stringify(
        uniqBy(
          [
            {
              type: 'history',
              display: query,
            },
            ...queryHistory,
          ],
          'display',
        ).slice(0, 3),
      ),
    )
  }

  const getQueryHistory = () => {
    const context = money ? 'money' : 'sports'
    const storageItem = localStorage.getItem(`query.${context}`)
    return storageItem ? JSON.parse(storageItem) : []
  }

  const trackSuggestion = (query: string) => {
    if (
      sectionIdx !== undefined &&
      suggestionIdx !== undefined &&
      sections[sectionIdx].suggestions[suggestionIdx].display === query
    ) {
      const section = sections[sectionIdx]
      window.segment.track('Autosuggest Search', {
        query,
        section: section.type,
      })
    }
  }

  const submitForm = () => {
    if (!input.value) return
    trackSuggestion(input.value)
    storeQuery(input.value)
    form.submit()
  }

  const loadSuggestions = throttle(async (query: string) => {
    try {
      const response = await fetch(
        `${apiUrl}?${new URLSearchParams({
          query,
          ...(preferredDomain && !money ? { league: preferredDomain } : {}),
          ...(userId ? { userId } : {}),
          ...(visitorId ? { visitorId } : {}),
        })}`,
      )
      const results: {
        timestamp: string
        sections: typeof sections
      } = await response.json()
      if (results.timestamp > timestamp) {
        if (!results.sections.find((s) => s.type === 'history')) {
          results.sections.push({
            type: 'history',
            suggestions: getQueryHistory(),
          })
        }
        sections = results.sections
        timestamp = results.timestamp
      }
    } catch (e) {}
  }, 600)

  const nextIndex = () => {
    if (sections.length > 0) {
      // None Selected
      if (sectionIdx === undefined || suggestionIdx === undefined) {
        sectionIdx = 0
        suggestionIdx = 0
        return
      }
      // Last Item Selected
      if (
        sectionIdx === sections.length - 1 &&
        suggestionIdx === sections[sectionIdx].suggestions.length - 1
      ) {
        sectionIdx = undefined
        suggestionIdx = undefined
        return
      }
      // Last Item in Section
      if (suggestionIdx === sections[sectionIdx].suggestions.length - 1) {
        sectionIdx += 1
        suggestionIdx = 0
        return
      }
      suggestionIdx += 1
    }
  }

  const prevIndex = () => {
    if (sections.length > 0) {
      // None Selected
      if (sectionIdx === undefined || suggestionIdx === undefined) {
        sectionIdx = sections.length - 1
        suggestionIdx = sections[sectionIdx].suggestions.length - 1
        return
      }
      // First Item Selected
      if (sectionIdx === 0 && suggestionIdx === 0) {
        sectionIdx = undefined
        suggestionIdx = undefined
        return
      }
      // First Item in Section
      if (suggestionIdx === 0) {
        sectionIdx -= 1
        suggestionIdx = sections[sectionIdx].suggestions.length - 1
        return
      }
      suggestionIdx -= 1
    }
  }

  const inputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      return submitForm()
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      e.key === 'ArrowUp' ? prevIndex() : nextIndex()
      input.value =
        sectionIdx !== undefined && suggestionIdx !== undefined
          ? sections[sectionIdx].suggestions[suggestionIdx].display
          : query
      return
    }
    if (e.key === 'Escape') {
      return input.blur()
    }
  }

  const disableScroll = () => {
    // Save the current scroll position:
    if (isMobileTest(navigator.userAgent)) {
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }
  }

  const enableScroll = () => {
    if (isMobileTest(navigator.userAgent)) {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }

  onMount(() => {
    isMobile = isMobileTest(navigator.userAgent)
    shadowInput.value = query
    if (autoFocus && !isMobileTest(navigator.userAgent)) {
      expand = true
    }
  })

  $: {
    if (userId && !isMobileTest(navigator.userAgent)) {
      expand = true
    }
  }
  $: {
    if (expand && input) {
      input.focus()
    }
  }
  $: open = sections.findIndex((s) => s.suggestions.length > 0) > -1
  $: userId = $session?.type === 'user' ? $session.properties.id : undefined
  $: visitorId =
    $session?.type === 'user'
      ? $session.properties.visitorId
      : $session?.type === 'visitor'
      ? $session.properties.id
      : undefined
  $: {
    if (shadowInput && input) {
      shadowInput.value = query
      shadowInput.style.width = getComputedStyle(input).width
      input.style.height = shadowInput.scrollHeight + 2 + 'px'
    }
    if (spacer) {
      spacer.style.height = shadowInput.scrollHeight + 4 + 'px'
    }
  }
</script>

<form
  bind:this={form}
  class={`${$$props.class} max-w-2xl ${isMobile ? 'md:relative' : 'relative'}`}
  {action}
  method="post"
>
  {#if !expand}
    <div
      class="relative group flex bg-gray-8 dark:bg-gray-3 items-center px-2 border border-gray-6 dark:border-transparent rounded-2xl overflow-hidden"
    >
      <input
        class="dark:bg-gray-3 grow appearance-none outline-none resize-none block border-y border-transparent px-2 py-1 peer truncate"
        autocomplete="off"
        aria-autocomplete="list"
        name="question[query]"
        {placeholder}
        required
        enterkeyhint="search"
        bind:value={query}
        on:focus={(e) => {
          if ($isNativeMobile) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'ask-bar-focus',
                query: e.currentTarget?.value,
              }),
            )
            e.currentTarget?.blur()
          } else {
            expand = true
            loadSuggestions(e.currentTarget?.value)
            disableScroll()
          }
        }}
      />
      {#if query.length > 0}
        <button
          on:click={() => {
            if ($isNativeMobile) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'ask-bar-clear' }),
              )
            } else {
              expand = true
              query = ''
              disableScroll()
            }
          }}
        >
          <Icon name="x" class="w-4 h-4 mr-1" />
        </button>
      {:else}
        <Icon name="search" class="w-5 h-5 text-teal mr-1" />
      {/if}
    </div>
  {/if}
  {#if expand}
    <div bind:this={spacer} style="height: 36px !important;" />
    <div
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="ask-bar-suggestions"
      aria-expanded={open}
      class={`absolute top-0 left-0 bg-white dark:bg-gray-3  overflow-hidden ${
        isMobile
          ? 'w-screen h-screen md:w-full md:h-auto md:border md:rounded-2xl'
          : 'w-full h-auto border rounded-2xl'
      }`}
      class:border-primary={inFocus}
      class:border-gray-6={!inFocus}
      class:dark:border-transparent={!inFocus}
      class:ring-1={inFocus}
      class:ring-primary={inFocus}
    >
      <div
        class="relative group flex bg-gray-8 dark:bg-gray-3 items-center px-2"
      >
        {#if isMobile}
          <button
            class="md:hidden"
            on:click={() => {
              enableScroll()
              expand = false
            }}
          >
            <Icon name="back" class="w-4 h-4 mr-1" />
          </button>
        {/if}
        <textarea
          class={`dark:bg-gray-3 grow appearance-none outline-none resize-none block border-y border-transparent px-2 ${
            isMobile ? 'py-2.5 md:py:1' : 'py-1'
          } peer`}
          autocomplete="off"
          aria-autocomplete="list"
          name="question[query]"
          required
          enterkeyhint="search"
          {placeholder}
          bind:this={input}
          bind:value={query}
          on:click={() => {
            sectionIdx = suggestionIdx = undefined
            loadSuggestions(input.value)
          }}
          on:input={() => {
            sectionIdx = suggestionIdx = undefined
            loadSuggestions(input.value)
          }}
          on:keydown={inputKeydown}
          on:blur={() => {
            if (clickedItem) {
              input.focus()
              clickedItem = false
              return
            }

            if (!isMobileTest(navigator.userAgent)) {
              sectionIdx = suggestionIdx = undefined
              sections = []
              inFocus = false
            }
          }}
          on:focus={() => (inFocus = true)}
        />
        {#if query.length > 0}
          <button
            on:click={() => {
              query = ''
              input.focus()
            }}
          >
            <Icon name="x" class="w-4 h-4 mr-1" />
          </button>
        {:else}
          <Icon name="search" class="w-5 h-5 text-teal mr-1" />
        {/if}
      </div>
      <div
        id="ask-bar-suggestions"
        role="listbox"
        class:hidden={!open}
        class="w-full bg-gray-8 dark:bg-gray-3"
      >
        {#each sections as section, i (section.type)}
          {#if section.suggestions.length > 0}
            <ul
              role="listbox"
              class="py-0.5 border-t border-t-gray-6 dark:border-t-gray-4"
            >
              {#each section.suggestions as suggestion, j (suggestion)}
                <li
                  class="py-1.5 px-2 cursor-pointer flex items-center"
                  class:bg-gray-7={i === sectionIdx && j === suggestionIdx}
                  class:dark:bg-gray-2={i === sectionIdx && j === suggestionIdx}
                  role="option"
                  aria-selected={i === sectionIdx && j === suggestionIdx}
                  on:click={() => {
                    input.value = suggestion.display
                    submitForm()
                  }}
                  on:mousedown={() => (clickedItem = true)}
                  on:mouseenter={() => {
                    sectionIdx = i
                    suggestionIdx = j
                  }}
                  on:mouseleave={() => {
                    sectionIdx = suggestionIdx = undefined
                  }}
                >
                  {#if section.type === 'history'}
                    <Icon
                      name="history"
                      class="w-6 h-6 mr-2.5 shrink-0 text-[#a7a9ac] dark:text-white"
                    />
                    <span>{suggestion.display}</span>
                  {:else if section.type === 'example' && suggestion.league}
                    <Icon
                      name={suggestion.league.toLowerCase() === 'epl'
                        ? 'fc'
                        : suggestion.league.toLowerCase()}
                      class="w-6 h-6 mr-2.5 shrink-0 text-[#a7a9ac] dark:text-white block object-cover"
                    />
                    <span>{suggestion.display}</span>
                  {:else if suggestion.type === 'player'}
                    <span
                      class="w-7 h-7 mr-2.5 shrink-0 rounded"
                      style={`background: #c5c9cc url(/_image?href=${suggestion.image_url}&w=100&h=100&f=webp) no-repeat center top/145%;`}
                    />
                    <span>{suggestion.display}</span>
                  {:else if suggestion.type === 'team'}
                    <span
                      class="w-7 h-7 mr-2.5 shrink-0 rounded"
                      style={`background: #c5c9cc url(/_image?href=${suggestion.image_url}&w=100&h=100&f=webp) no-repeat center / contain;`}
                    />
                    <span>{suggestion.display}</span>
                  {:else}
                    <Icon
                      name="search"
                      class="w-6 h-6 mr-2.5 shrink-0 text-[#a7a9ac] dark:text-white block object-cover"
                    />
                    <span>{suggestion.display}</span>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
  <input
    name="question[preferred_domain]"
    type="hidden"
    value={preferredDomain}
  />
  <input
    name="question[conversation_token]"
    type="hidden"
    value={conversationToken}
  />
  <textarea
    bind:this={shadowInput}
    class={`appearance-none outline-none resize-none block border-y px-2 ${
      isMobile ? 'py-2.5 md:py-1' : 'py-1'
    }`}
    style:height="0px"
    style:min-height="0px"
    style:max-height="none"
    style:visibility="hidden"
    style:overflow="hidden"
    style:position="absolute"
    style:left="0"
    style:z-index="-1000"
    tabindex="-1"
    aria-hidden="true"
  ></textarea>
</form>
