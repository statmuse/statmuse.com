import { db } from '../db'
export * from './ask.sql'

export const ASK_LIMIT = 15
const leagues = ['nba', 'nfl', 'nhl', 'mlb', 'pga']

export const getListContextIds = async (names: string[]) => {
  const records = await db
    .selectFrom('contexts')
    .where('contexts.name', 'in', names)
    .selectAll()
    .execute()
  return records.map((r) => r.id)
}

export const getAsksIndex = async (
  names = leagues,
  params: { n?: Date; p?: Date; page?: string },
  isFantasy = false
) => {
  let query = db
    .selectFrom('asks')
    .selectAll('asks')
    .innerJoin('contexts', 'contexts.id', 'asks.context_id')
    .where('is_in_index', '=', true)
    .where('last_web_search_at', 'is not', null)
    .where('context_id', 'in', await getListContextIds(names))

  if (isFantasy) {
    query = query.where('is_fantasy_query', '=', true)
  }

  if (params.n) {
    query = query
      .where('last_web_search_at', '<', params.n)
      .orderBy('last_web_search_at', 'desc')
  } else if (params.p) {
    query = query
      .where('last_web_search_at', '>', params.p)
      .orderBy('last_web_search_at', 'asc')
      .offset(1)
  } else if (params.page && params.page === 'last') {
    query = query.orderBy('last_web_search_at', 'asc')
  } else {
    query = query.orderBy('last_web_search_at', 'desc')
  }

  const records = await query
    .selectAll('asks')
    .select('contexts.name as league_name')
    .limit(ASK_LIMIT + 1)
    .execute()

  if (params.p || params.page) {
    records.reverse()
  }
  return records
}

export type AskForIndex = Awaited<ReturnType<typeof getAsksIndex>>[number]

export const getFinanceAsksIndex = async (params: {
  n?: Date
  p?: Date
  page?: string
}) => {
  let query = db
    .selectFrom('finance_asks')
    .selectAll('finance_asks')
    .where('is_in_index', '=', true)
    .where('last_web_search_at', 'is not', null)

  if (params.n) {
    query = query
      .where('last_web_search_at', '<', params.n)
      .orderBy('last_web_search_at', 'desc')
  } else if (params.p) {
    query = query
      .where('last_web_search_at', '>', params.p)
      .orderBy('last_web_search_at', 'asc')
      .offset(1)
  } else if (params.page && params.page === 'last') {
    query = query.orderBy('last_web_search_at', 'asc')
  } else {
    query = query.orderBy('last_web_search_at', 'desc')
  }

  const records = await query
    .selectAll('finance_asks')
    .limit(ASK_LIMIT + 1)
    .execute()

  if (params.p || params.page) {
    records.reverse()
  }
  return records
}

export type FinanceAskForIndex = Awaited<
  ReturnType<typeof getFinanceAsksIndex>
>[number]
