import { db } from '../db'
export * from './ask.sql'

export const ASK_LIMIT = 15
const leagues = ['nba', 'nfl', 'nhl', 'mlb', 'pga']

export const getListContextIds = (names: string[]) =>
  db.selectFrom('contexts').where('contexts.name', 'in', names).select('id')

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
    .where('context_id', 'in', getListContextIds(names))

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
    .select('asks.last_web_search_at as last_asked_at')
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
    .select('finance_asks.last_web_search_at as last_asked_at')
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

export const getUserAsks = async (
  userId: string,
  params: { n?: Date; p?: Date; page?: string }
) => {
  let query = db
    .selectFrom('asks_users')
    .innerJoin('asks', 'asks.id', 'asks_users.ask_id')
    .innerJoin('contexts', 'contexts.id', 'asks.context_id')
    .where('asks.is_in_index', '=', true)
    .where('asks_users.user_id', '=', userId)

  if (params.n) {
    query = query
      .where('asks_users.last_asked_at', '<', params.n)
      .orderBy('asks_users.last_asked_at', 'desc')
  } else if (params.p) {
    query = query
      .where('asks_users.last_asked_at', '>', params.p)
      .orderBy('asks_users.last_asked_at', 'asc')
      .offset(1)
  } else if (params.page && params.page === 'last') {
    query = query.orderBy('asks_users.last_asked_at', 'asc')
  } else {
    query = query.orderBy('asks_users.last_asked_at', 'desc')
  }

  const records = await query
    .selectAll('asks')
    .select('asks_users.last_asked_at as last_asked_at')
    .select('contexts.name as league_name')
    .limit(ASK_LIMIT + 1)
    .execute()

  if (params.p || params.page) {
    records.reverse()
  }

  return records
}

export const getFinanceUserAsks = async (
  userId: string,
  params: { n?: Date; p?: Date; page?: string }
) => {
  let query = db
    .selectFrom('finance_asks_users')
    .innerJoin(
      'finance_asks',
      'finance_asks.id',
      'finance_asks_users.finance_ask_id'
    )
    .where('finance_asks.is_in_index', '=', true)
    .where('finance_asks_users.user_id', '=', userId)

  if (params.n) {
    query = query
      .where('finance_asks_users.last_asked_at', '<', params.n)
      .orderBy('finance_asks_users.last_asked_at', 'desc')
  } else if (params.p) {
    query = query
      .where('finance_asks_users.last_asked_at', '>', params.p)
      .orderBy('finance_asks_users.last_asked_at', 'asc')
      .offset(1)
  } else if (params.page && params.page === 'last') {
    query = query.orderBy('finance_asks_users.last_asked_at', 'asc')
  } else {
    query = query.orderBy('finance_asks_users.last_asked_at', 'desc')
  }

  const records = await query
    .selectAll('finance_asks')
    .select('finance_asks_users.last_asked_at as last_asked_at')
    .limit(ASK_LIMIT + 1)
    .execute()

  if (params.p || params.page) {
    records.reverse()
  }

  return records
}
