import { randomUUID } from 'crypto'
import { db } from '../db'
import { sql } from 'kysely'
import {
  type GameraResponse,
  getDomain,
  isFantasyQuery,
  isVoiceQuery,
  isExcludedQuery,
  cdnBaseUrl,
  GameraDomain,
  tokensToHtml,
} from '../gamera'
import { tokensToText as tokensToTextFinance } from '../kanedama'
import {
  AnswerType,
  FinanceAnswerType,
  NewAsk,
  NewAskEvent,
  NewAskUser,
  NewFinanceAsk,
  NewFinanceAskEvent,
  NewFinanceAskUser,
} from './ask.sql'
import { tokensToText } from '../gamera'
import * as Context from '../context'
import { createAskPath } from '../path'
import { NewLink } from '../link/link.sql'
import { randomAlphanumericString } from '../random'
import { KanedamaResponse } from '../kanedama'
export * from './ask.sql'

export const ASK_LIMIT = 15
const leagues = ['nba', 'nfl', 'nhl', 'mlb', 'pga']

export const upsert = async (params: {
  query: string
  response: GameraResponse
  userId?: string
  visitorId?: string
}) => {
  const response = params.response
  const domain = getDomain(response)
  const context =
    (await Context.getByName(domain as string)) ?? (await Context.getUnknown())

  const error =
    response.type === 'error'
      ? tokensToText(response.nlg.text.answer)
      : undefined

  const answerType = getAnswerType(response)

  const now = new Date().toISOString()
  const newAsk: NewAsk = {
    id: randomUUID(),
    query: params.query,
    answer: response,
    answer_text: getAnswerText(response),
    answer_html: getAnswerHtml(response),
    answer_type: answerType,
    is_legacy_answer: false,
    prompt: getPrompt(response),
    error,
    context_id: context?.id as string,
    last_visitor_id: params.visitorId,
    last_user_id: params.userId,
    inserted_at: now,
    updated_at: now,
    last_web_search_at: now,
    is_fantasy_query: isFantasyQuery(params.query),
    is_in_index: isInIndex(params.query, response, answerType),
    is_in_suggests: isInSuggests(params.query, response, answerType),
    hex_background: getBackgroundHex(response),
    hex_foreground: getForegroundHex(response),
    image_url: getImageUrl(response, domain),
    resource_path: getResourcePath(response, params.query, domain),
    resource_query: getResourceQuery(response, params.query),
  }

  console.log('newAsk', newAsk)

  const ask = await db.transaction().execute(async (trx) => {
    const ask = await trx
      .insertInto('asks')
      .values(newAsk)
      .returningAll()
      .onConflict((oc) =>
        oc.columns(['context_id', 'query']).doUpdateSet({
          answer: response,
          answer_type: answerType,
          last_visitor_id: params.visitorId,
          last_user_id: params.userId,
          last_web_search_at: now,
          updated_at: now,
          is_in_index: newAsk.is_in_index,
          is_in_suggests: newAsk.is_in_suggests,
        })
      )
      .executeTakeFirst()

    if (!ask) throw new Error('Failed to create new ask')

    console.log('ask', ask)

    const newAskEvent: NewAskEvent = {
      id: randomUUID(),
      query_raw: params.query,
      conversation_token: response.conversation.token,
      ask_id: ask.id,
      visitor_id: params.visitorId,
      user_id: params.userId,
      inserted_at: now,
      updated_at: now,
    }

    const askEvent = await trx
      .insertInto('ask_events')
      .values(newAskEvent)
      .returningAll()
      .executeTakeFirst()

    console.log('askEvent', askEvent)

    if (params.userId) {
      const newAskUser: NewAskUser = {
        id: randomUUID(),
        ask_id: ask.id,
        user_id: params.userId,
        inserted_at: now,
        updated_at: now,
        last_asked_at: now,
      }

      const askUser = await trx
        .insertInto('asks_users')
        .values(newAskUser)
        .onConflict((oc) =>
          oc.columns(['ask_id', 'user_id']).doUpdateSet({
            ...newAskUser,
            id: undefined,
            inserted_at: undefined,
            ask_id: undefined,
            user_id: undefined,
          })
        )
        .returningAll()
        .executeTakeFirst()

      console.log('askUser', askUser)
    }

    const newLink: NewLink = {
      id: randomUUID(),
      short_code: randomAlphanumericString(9),
      linkable_type: 'ask',
      inserted_at: now,
      updated_at: now,
      ask_id: ask.id,
    }

    // only add link if this is a new ask
    if (ask.inserted_at === ask.updated_at) {
      const link = await trx
        .insertInto('links')
        .values(newLink)
        .returningAll()
        .executeTakeFirst()

      console.log('link', link)
    }

    return ask
  })

  return ask
}

export const upsertFinance = async (params: {
  query: string
  response: KanedamaResponse
  userId?: string
  visitorId?: string
}) => {
  const response = params.response
  const answerType = getAnswerTypeFinance(response)

  const now = new Date().toISOString()
  const newAsk: NewFinanceAsk = {
    id: randomUUID(),
    query: params.query,
    answer: response,
    answer_text: getAnswerTextFinance(response),
    answer_type: answerType,
    last_visitor_id: params.visitorId,
    last_user_id: params.userId,
    inserted_at: now,
    updated_at: now,
    last_web_search_at: now,
    is_in_index: isInIndexFinance(params.query, response, answerType),
    is_in_suggests: isInSuggestsFinance(params.query, response, answerType),
  }

  console.log('newAsk', newAsk)

  const ask = await db.transaction().execute(async (trx) => {
    const ask = await trx
      .insertInto('finance_asks')
      .values(newAsk)
      .returningAll()
      .onConflict((oc) =>
        oc.column('query').doUpdateSet({
          answer: response,
          answer_type: answerType,
          last_visitor_id: params.visitorId,
          last_user_id: params.userId,
          last_web_search_at: now,
          updated_at: now,
          is_in_index: newAsk.is_in_index,
          is_in_suggests: newAsk.is_in_suggests,
        })
      )
      .executeTakeFirst()

    if (!ask) throw new Error('Failed to create new ask')

    console.log('ask', ask)

    const newAskEvent: NewFinanceAskEvent = {
      id: randomUUID(),
      query_raw: params.query,
      finance_ask_id: ask.id,
      visitor_id: params.visitorId,
      user_id: params.userId,
      inserted_at: now,
      updated_at: now,
    }

    const askEvent = await trx
      .insertInto('finance_ask_events')
      .values(newAskEvent)
      .returningAll()
      .executeTakeFirst()

    console.log('askEvent', askEvent)

    if (params.userId) {
      const newAskUser: NewFinanceAskUser = {
        id: randomUUID(),
        finance_ask_id: ask.id,
        user_id: params.userId,
        inserted_at: now,
        updated_at: now,
        last_asked_at: now,
      }

      const askUser = await trx
        .insertInto('finance_asks_users')
        .values(newAskUser)
        .onConflict((oc) =>
          oc.columns(['finance_ask_id', 'user_id']).doUpdateSet({
            ...newAskUser,
            id: undefined,
            inserted_at: undefined,
            finance_ask_id: undefined,
            user_id: undefined,
          })
        )
        .returningAll()
        .executeTakeFirst()

      console.log('askUser', askUser)
    }

    const newLink: NewLink = {
      id: randomUUID(),
      short_code: randomAlphanumericString(9),
      linkable_type: 'finance_ask',
      inserted_at: now,
      updated_at: now,
      finance_ask_id: ask.id,
    }

    // only add link if this is a new ask
    if (ask.inserted_at === ask.updated_at) {
      const link = await trx
        .insertInto('links')
        .values(newLink)
        .returningAll()
        .executeTakeFirst()

      console.log('link', link)
    }

    return ask
  })

  return ask
}

const PUBLIC_ANSWER_TYPES: AnswerType[] = [
  'answer',
  'player_bio',
  'team_franchise_bio',
  'team_season_bio',
]

const PUBLIC_FINANCE_ANSWER_TYPES: FinanceAnswerType[] = ['answer', 'asset']

const getResourcePath = (
  response: GameraResponse,
  query: string,
  gameraDomain?: GameraDomain
) => {
  if (
    response.type === 'fullNlgAnswerVisualsOptional' ||
    response.type === 'nlgAnswerNotPossibleVisualsRequired'
  ) {
    for (const detail of response.visual.detail || []) {
      if (detail.type === 'playerProfile' || detail.type === 'teamProfile') {
        const path = detail.entity.baseResourcePath
        if (path) return path.toLowerCase()
      }
    }
  }

  const domain = gameraDomain ? gameraDomain.toLowerCase() : undefined
  if (domain) return createAskPath({ domain, query }).substring(1)

  return undefined
}

const getResourceQuery = (_response: GameraResponse, query: string) => {
  // For now, ignoring bios in stored asks
  return query
}

const getImageUrl = (response: GameraResponse, domain?: string) => {
  if (
    response.type === 'fullNlgAnswerVisualsOptional' ||
    response.type === 'nlgAnswerNotPossibleVisualsRequired'
  ) {
    return response.visual.summary.subject.imageUrl
  }

  if (domain) return `${cdnBaseUrl}/img/${domain.toLowerCase()}/default.png`

  return undefined
}

const getColors = (response: GameraResponse) => {
  if (
    response.type === 'fullNlgAnswerVisualsOptional' ||
    response.type === 'nlgAnswerNotPossibleVisualsRequired'
  ) {
    return response.visual.summary.subject.colors
  }

  return undefined
}

const getBackgroundHex = (response: GameraResponse) => {
  return getColors(response)?.background
}

const getForegroundHex = (response: GameraResponse) => {
  return getColors(response)?.foreground
}

const isMeh = (response: GameraResponse | KanedamaResponse) => {
  if (
    (response.type === 'fullNlgAnswerVisualsOptional' ||
      response.type === 'nlgAnswerNotPossibleVisualsRequired') &&
    response.nlg.text.promptConversational === 'What can I answer for you?'
  )
    return true

  return false
}

const isInIndex = (
  query: string,
  response: GameraResponse,
  answerType: AnswerType
) => {
  if (!PUBLIC_ANSWER_TYPES.includes(answerType)) return false
  if (isMeh(response)) return false
  if (answerType === 'error') return false
  if (isFantasyQuery(query)) return false
  if (isVoiceQuery(query)) return false
  if (isExcludedQuery(query)) return false

  return true
}

const isInIndexFinance = (
  query: string,
  response: KanedamaResponse,
  answerType: FinanceAnswerType
) => {
  if (!PUBLIC_FINANCE_ANSWER_TYPES.includes(answerType)) return false
  if (isMeh(response)) return false
  if (answerType === 'error') return false
  if (isVoiceQuery(query)) return false
  if (isExcludedQuery(query)) return false

  return true
}

const isInSuggests = (
  query: string,
  response: GameraResponse,
  answerType: AnswerType
) => {
  if (!PUBLIC_ANSWER_TYPES.includes(answerType)) return false
  if (isMeh(response)) return false
  if (answerType === 'error') return false
  if (isVoiceQuery(query)) return false
  if (isExcludedQuery(query)) return false

  return true
}

const isInSuggestsFinance = (
  query: string,
  response: KanedamaResponse,
  answerType: FinanceAnswerType
) => {
  if (!PUBLIC_FINANCE_ANSWER_TYPES.includes(answerType)) return false
  if (isMeh(response)) return false
  if (answerType === 'error') return false
  if (isVoiceQuery(query)) return false
  if (isExcludedQuery(query)) return false

  return true
}

const getAnswerText = (response: GameraResponse) => {
  if (
    response.type === 'nlgAnswerNotPossibleVisualsRequired' ||
    response.type === 'fullNlgAnswerVisualsOptional'
  ) {
    return tokensToText(response.nlg.text.answer)
  }

  return undefined
}

const getAnswerTextFinance = (response: KanedamaResponse) => {
  if (
    response.type === 'nlgAnswerNotPossibleVisualsRequired' ||
    response.type === 'fullNlgAnswerVisualsOptional'
  ) {
    return tokensToTextFinance(response.nlg.text.answer)
  }

  return undefined
}

const getAnswerHtml = (response: GameraResponse) => {
  if (
    response.type === 'nlgAnswerNotPossibleVisualsRequired' ||
    response.type === 'fullNlgAnswerVisualsOptional'
  ) {
    return `<p>${tokensToHtml(response.nlg.text.answer)}</p>`
  }

  return undefined
}

const getAnswerType = (response: GameraResponse): AnswerType => {
  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional')
    return 'prompt'

  if (response.type === 'error') return 'error'

  return 'answer'
}

const getAnswerTypeFinance = (
  response: KanedamaResponse
): FinanceAnswerType => {
  if (response.type === 'error') return 'error'

  if (
    response.type === 'fullNlgAnswerVisualsOptional' ||
    response.type === 'nlgAnswerNotPossibleVisualsRequired'
  ) {
    for (const detail of response.visual.detail || []) {
      if (detail.type === 'assetEntityData') return 'asset'
    }

    if (response.visual.summaryTokens) return 'answer'
  }

  return 'unknown'
}

const getPrompt = (response: GameraResponse) => {
  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional') {
    const text = tokensToText(response.visual.summary.answer)
    return {
      text,
      choices: response.visual.choices,
    }
  }

  return undefined
}

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

export const getUserAskSuggestions = (userId: string) =>
  db
    .selectFrom('asks_users')
    .innerJoin('asks', 'asks.id', 'asks_users.ask_id')
    .where('asks.is_in_index', '=', true)
    .where('asks_users.user_id', '=', userId)
    .orderBy('asks_users.last_asked_at', 'desc')
    .limit(3)
    .select(['asks.query as display', sql<string>`'history'`.as('type')])
    .execute()

export const getUserFinanceAskSuggestions = (userId: string) =>
  db
    .selectFrom('finance_asks_users')
    .innerJoin(
      'finance_asks',
      'finance_asks.id',
      'finance_asks_users.finance_ask_id'
    )
    .where('finance_asks.is_in_index', '=', true)
    .where('finance_asks_users.user_id', '=', userId)
    .orderBy('finance_asks_users.last_asked_at', 'desc')
    .limit(3)
    .select([
      'finance_asks.query as display',
      sql<string>`'history'`.as('type'),
    ])
    .execute()

export const countByUser = (userId: string) =>
  db
    .selectFrom('ask_events')
    .where('user_id', '=', userId)
    .where(sql`DATE(inserted_at) = current_date`)
    .select((eb) => eb.fn.countAll().as('ask_count'))
    .executeTakeFirst()

export const countByVisitor = (visitorId: string) =>
  db
    .selectFrom('ask_events')
    .where('visitor_id', '=', visitorId)
    .where(sql`DATE(inserted_at) = current_date`)
    .select((eb) => eb.fn.countAll().as('ask_count'))
    .executeTakeFirst()

export const financeCountByUser = (userId: string) =>
  db
    .selectFrom('finance_ask_events')
    .where('user_id', '=', userId)
    .where(sql`DATE(inserted_at) = current_date`)
    .select((eb) => eb.fn.countAll().as('ask_count'))
    .executeTakeFirst()

export const financeCountByVisitor = (visitorId: string) =>
  db
    .selectFrom('finance_ask_events')
    .where('visitor_id', '=', visitorId)
    .where(sql`DATE(inserted_at) = current_date`)
    .select((eb) => eb.fn.countAll().as('ask_count'))
    .executeTakeFirst()
