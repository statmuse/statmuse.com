<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-role-has-required-aria-props -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { throttle, uniqBy } from 'lodash-es'
  import { session } from '@lib/session-store'
  import type { AskDocument } from '@statmuse/core/elastic'
  import { isMobileTest } from '@lib/useragent'

  export let query: string = ''
  export let conversationToken: string = ''
  export let preferredDomain: string = ''
  export let money: boolean
  export let fantasy: boolean

  let timestamp: string = new Date().toISOString()
  let sections: {
    type: 'ask' | 'example' | 'history'
    suggestions: AskDocument[]
  }[] = []
  let sectionIdx: number | undefined
  let suggestionIdx: number | undefined
  let input: HTMLTextAreaElement
  let shadowInput: HTMLTextAreaElement
  let spacer: HTMLElement
  let form: HTMLFormElement
  let clickedItem = false
  let inFocus = false

  if (preferredDomain === 'fc') preferredDomain = 'epl'

  const action = money ? '/money/ask' : fantasy ? '/fantasy/ask' : '/ask'
  const placeholder = money
    ? 'Search stocks, FX or bitcoin'
    : fantasy
    ? 'Search fantasy projections or points'
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

  onMount(() => {
    if (!isMobileTest(navigator.userAgent)) {
      input.focus()
    }
    shadowInput.value = query
    spacer.style.height = shadowInput.scrollHeight + 2 + 'px'
    input.style.height = shadowInput.scrollHeight + 2 + 'px'
  })

  $: open = sections.findIndex((s) => s.suggestions.length > 0) > -1
  $: userId = $session?.type === 'user' ? $session.properties.id : undefined
  $: {
    if (shadowInput && input) {
      shadowInput.value = query
      input.style.height = shadowInput.scrollHeight + 2 + 'px'
      spacer.style.height = shadowInput.scrollHeight + 2 + 'px'
    }
  }
</script>

<form bind:this={form} class="relative" {action} method="post">
  <div bind:this={spacer} style="height: 46px !important;" />
  <div
    role="combobox"
    aria-haspopup="listbox"
    aria-owns="ask-bar-suggestions"
    aria-expanded={open}
    class="absolute top-0 w-full border border-black rounded-lg hover:shadow-md overflow-hidden"
    class:border-primary={inFocus}
    class:ring-1={inFocus}
    class:ring-primary={inFocus}
  >
    <div class="relative group">
      <textarea
        class="appearance-none outline-none resize-none block w-full border-y border-transparent p-2.5 peer"
        class:pr-[70px]={query}
        autocomplete="off"
        aria-autocomplete="list"
        name="question[query]"
        {placeholder}
        required
        enterkeyhint="search"
        style="height: 46px !important;"
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
          sectionIdx = suggestionIdx = undefined
          sections = []
          inFocus = false
        }}
        on:focus={() => (inFocus = true)}
      />
      <img
        class="w-5 h-5 absolute right-[46px] bottom-3 object-contain cursor-pointer"
        class:hidden={query.length === 0}
        src="/icons/icon-x.svg"
        alt="clear input"
        on:click={() => {
          query = ''
          input.focus()
        }}
      />
      <input
        type="submit"
        class="absolute bottom-3 right-2.5 block w-5 h-5 cursor-pointer bg-[url('/icons/icon-search.svg')] bg-contain bg-no-repeat bg-scroll bg-center group-hover:bg-[url('/icons/icon-search-blue.svg')] peer-focus:bg-[url('/icons/icon-search-blue.svg')]"
        value=""
        aria-label="Search"
      />
    </div>
    <div
      id="ask-bar-suggestions"
      role="listbox"
      class:hidden={!open}
      class="w-full px-2 bg-white"
    >
      {#each sections as section, i (section.type)}
        {#if section.suggestions.length > 0}
          <ul role="listbox" class="py-0.5 border-t border-t-slate-400">
            {#each section.suggestions as suggestion, j (suggestion)}
              <li
                class="py-1.5 px-1 cursor-pointer flex items-center"
                class:bg-[#eee]={i === sectionIdx && j === suggestionIdx}
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
                  <span
                    class="suggestion-history-icon w-6 h-6 mr-2.5 shrink-0"
                  />
                  <span>{suggestion.display}</span>
                {:else if section.type === 'example' && suggestion.league}
                  <span
                    class={`suggestion-${suggestion.league.toLowerCase()}-icon w-6 h-6 mr-2.5 shrink-0`}
                  />
                  <span>{suggestion.display}</span>
                {:else if suggestion.type === 'player'}
                  <span
                    class="w-7 h-7 mr-2.5 shrink-0"
                    style={`background: #c5c9cc url(/_image?href=${suggestion.image_url}&w=100&h=100&f=webp) no-repeat center top/145%;`}
                  />
                  <span>{suggestion.display}</span>
                {:else if suggestion.type === 'team'}
                  <span
                    class="w-7 h-7 mr-2.5 shrink-0"
                    style={`background: #c5c9cc url(/_image?href=${suggestion.image_url}&w=100&h=100&f=webp) no-repeat center / contain;`}
                  />
                  <span>{suggestion.display}</span>
                {:else}
                  <span
                    class="suggestion-example-icon w-6 h-6 mr-2.5 shrink-0"
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
    class="appearance-none outline-none resize-none block w-full border-y p-2.5"
    class:pr-[70px]={query}
    style:height="0px"
    style:min-height="0px"
    style:max-height="none"
    style:visibility="hidden"
    style:overflow="hidden"
    style:position="absolute"
    style:z-index="-1000"
    tabindex="-1"
    aria-hidden="true"
  ></textarea>
</form>
