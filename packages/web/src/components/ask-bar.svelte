<script lang="ts">
  import { throttle, uniqBy } from 'lodash-es'
  import { session } from '@lib/session-store'
  import type { AskDocument } from '@statmuse/core/elastic'

  export let query: string = ''
  export let conversationToken: string = ''
  export let preferredDomain: string
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
  let form: HTMLFormElement
  let clickedItem = false

  const action = money ? '/money/ask' : fantasy ? '/fantasy/ask' : '/ask'
  const placeholder = money
    ? 'Search stocks, FX or bitcoin'
    : fantasy
    ? 'Search fantasy projections or points'
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
    trackSuggestion(input.value)
    storeQuery(input.value)
    form.submit()
  }

  const loadSuggestions = throttle(async (query: string) => {
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

  $: open = sections.findIndex((s) => s.suggestions.length > 0) > -1
  $: userId = $session?.type === 'user' ? $session.properties.id : undefined
</script>

<form bind:this={form} class="ask-form" {action} method="post">
  <div class="relative rounded-lg text-[#191919]">
    <div class="relative group">
      <textarea
        class="ask-textarea input appearance-none outline-none resize-none block w-full border border-black rounded-lg p-2.5 focus:shadow-md peer group-hover:shadow-md"
        class:border-b-transparent={open}
        class:rounded-bl-none={open}
        class:rounded-br-none={open}
        autofocus
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
        }}
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
        class="ask-bar-search-icon absolute bottom-3 right-2.5 block w-5 h-5 cursor-pointer"
        value=""
      />
    </div>
    <div
      role="listbox"
      class:hidden={!open}
      class="bg-white w-full px-2 absolute top-full border-x border-x-black border-b border-b-black rounded-b-lg shadow-md"
    >
      {#each sections as section, i (section.type)}
        {#if section.suggestions.length > 0}
          <ul role="listbox" class="py-0.5 border-t border-t-slate-400">
            {#each section.suggestions as suggestion, j (suggestion)}
              <li
                class="py-1.5 px-1 cursor-pointer flex items-center"
                class:bg-[#eee]={i === sectionIdx && j === suggestionIdx}
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
                    style={`background: #c5c9cc url(${suggestion.image_url}) no-repeat center top/145%;`}
                  />
                  <span>{suggestion.display}</span>
                {:else if suggestion.type === 'team'}
                  <span
                    class="w-7 h-7 mr-2.5 shrink-0"
                    style={`background: #c5c9cc url(${suggestion.image_url}) no-repeat center / contain;`}
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
</form>
