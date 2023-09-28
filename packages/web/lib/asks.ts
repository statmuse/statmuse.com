import { type FinanceAskForIndex, type AskForIndex } from '@statmuse/core/ask'
import { createAskPath } from '@statmuse/core/path'
import { utc } from '@statmuse/core/time'

const dateFromString = (x: string) => {
  const date = utc(x)
  if (date.toString() !== 'Invalid Date') {
    return date
  }
  return
}

export const parseSearchParams = (params: URLSearchParams) => {
  const next = (params.get('n') || '').replaceAll('_', ':')
  const previous = (params.get('p') || '').replaceAll('_', ':')
  const page = params.get('page') || undefined
  return {
    n: dateFromString(next),
    p: dateFromString(previous),
    page,
  }
}

export type SearchParams = ReturnType<typeof parseSearchParams>

type PaginationOptions = {
  current_page?: 'first-last' | 'first' | 'last'
  n?: string
  p?: string
}

export const paginate = (
  asks: AskForIndex[] | FinanceAskForIndex[],
  { n, p, page }: SearchParams,
  overflow: boolean,
): PaginationOptions => {
  if (asks.length === 0) return {}

  if (!n && !p && !page) {
    return {
      current_page: overflow ? 'first' : 'first-last',
      n: overflow
        ? asks[asks.length - 1].last_asked_at
            ?.toISOString()
            .replaceAll(':', '_')
        : undefined,
    }
  }

  if (page && page === 'last') {
    return {
      current_page: overflow ? 'last' : 'first-last',
      p: overflow
        ? asks[0].last_asked_at?.toISOString().replaceAll(':', '_')
        : undefined,
    }
  }

  if (n && !overflow) {
    return {
      current_page: 'last',
      p: asks[0].last_asked_at?.toISOString().replaceAll(':', '_'),
    }
  }

  if (p && !overflow) {
    return {
      current_page: 'first',
      n: asks[asks.length - 1].last_asked_at
        ?.toISOString()
        .replaceAll(':', '_'),
    }
  }

  return {
    n: asks[asks.length - 1].last_asked_at?.toISOString().replaceAll(':', '_'),
    p: asks[0].last_asked_at?.toISOString().replaceAll(':', '_'),
  }
}

const isAsk = (ask: AskForIndex | FinanceAskForIndex): ask is AskForIndex =>
  'answer_html' in ask
const isFinanceAsk = (
  ask: AskForIndex | FinanceAskForIndex,
): ask is FinanceAskForIndex => !isAsk(ask)

export const getNlg = (ask: AskForIndex | FinanceAskForIndex) =>
  isAsk(ask) ? ask.answer_html : ask.answer_text
export const getImage = (ask: AskForIndex | FinanceAskForIndex) =>
  isAsk(ask) ? ask.image_url : ask.answer.visual.summary.subject?.imageUrl
export const getBgColor = (ask: AskForIndex | FinanceAskForIndex) =>
  isAsk(ask)
    ? ask.hex_background
    : ask.answer.visual.summary.subject?.colors.background

export const askPath = (ask: AskForIndex | FinanceAskForIndex) => {
  if (isFinanceAsk(ask)) {
    return createAskPath({ domain: 'money', query: ask.query })
  }
  if (isAsk(ask) && ask.is_fantasy_query) {
    return createAskPath({ domain: 'fantasy', query: ask.query })
  }
  if (isAsk(ask)) {
    return createAskPath({ domain: ask.league_name, query: ask.query })
  }
  return ''
}
