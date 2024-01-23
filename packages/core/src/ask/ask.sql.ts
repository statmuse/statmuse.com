import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'
import type { GameraResponse } from '../gamera'
import type { KanedamaResponse } from '../kanedama'

export type AnswerType =
  | 'answer'
  | 'error'
  | 'prompt'
  | 'player_bio'
  | 'team_franchise_bio'
  | 'team_season_bio'
  | 'unknown'

export interface AskTable {
  id: string

  sid: Generated<number>
  query: string
  answer: GameraResponse | null
  answer_type: AnswerType | null
  is_legacy_answer: boolean
  count_total: ColumnType<number, number | undefined, number | undefined>
  prompt: {} | null
  error: {} | null
  player_bio: {} | null
  team_franchise_bio: {} | null
  team_season_bio: {} | null
  context_id: string
  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
  is_fantasy_query: boolean
  is_game_odds_query: boolean | null
  last_visitor_id: string | null
  is_in_index: boolean
  last_user_id: string | null
  answer_html: string | null
  count_web_search: ColumnType<number, number | undefined, number | undefined>
  count_web_view: ColumnType<number, number | undefined, number | undefined>
  hex_background: string | null
  hex_foreground: string | null
  image_url: string | null
  is_in_index_pin: boolean | null
  is_in_suggests: boolean
  is_in_suggests_pin: boolean | null
  last_web_search_at: ColumnType<
    Date,
    string | undefined,
    string | undefined
  > | null
  resource_path: string | null
  resource_query: string | null
  answer_text: string | null
}

export type Ask = Selectable<AskTable>
export type NewAsk = Insertable<AskTable>
export type AskUpdate = Updateable<AskTable>

export interface AskUserTable {
  id: string

  ask_id: string
  user_id: string

  last_asked_at: ColumnType<Date, string | undefined, string | undefined>
  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type AskUser = Selectable<AskUserTable>
export type NewAskUser = Insertable<AskUserTable>
export type AskUserUpdate = Updateable<AskUserTable>

export interface AskEventTable {
  id: string

  conversation_token: string
  query_raw: string
  ask_id: string
  question_id: string | null
  user_id: string | null
  visitor_id: string | null

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type AskEvent = Selectable<AskEventTable>
export type NewAskEvent = Insertable<AskEventTable>
export type AskEventUpdate = Updateable<AskEventTable>

export interface AskSuggestTable {
  id: string
  domain: string
  query: string
  count: number
  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type AskSuggest = Selectable<AskSuggestTable>
export type NewAskSuggest = Insertable<AskSuggestTable>
export type AskSuggestUpdate = Updateable<AskSuggestTable>

export type FinanceAnswerType = 'answer' | 'asset' | 'error' | 'unknown'

export interface FinanceAskTable {
  id: string

  answer: KanedamaResponse
  answer_text: string | null
  answer_type: FinanceAnswerType
  count_total: ColumnType<number, number | undefined, number | undefined>
  count_web_search: ColumnType<number, number | undefined, number | undefined>
  count_web_view: ColumnType<number, number | undefined, number | undefined>
  is_in_index: boolean | null
  is_in_index_pin: boolean | null
  is_in_suggests: boolean | null
  is_in_suggests_pin: boolean | null
  last_user_id: string | null
  last_visitor_id: string | null
  last_web_search_at: ColumnType<
    Date,
    string | undefined,
    string | undefined
  > | null
  query: string
  sid: Generated<number>

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type FinanceAsk = Selectable<FinanceAskTable>
export type NewFinanceAsk = Insertable<FinanceAskTable>
export type FinanceAskUpdate = Updateable<FinanceAskTable>

export interface FinanceAskEventTable {
  id: string

  query_raw: string
  finance_ask_id: string
  question_id: string | null
  user_id: string | null
  visitor_id: string | null

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type FinanceAskEvent = Selectable<FinanceAskEventTable>
export type NewFinanceAskEvent = Insertable<FinanceAskEventTable>
export type FinanceAskEventUpdate = Updateable<FinanceAskEventTable>

export interface FinanceAskUserTable {
  id: Generated<string>

  finance_ask_id: string
  user_id: string

  last_asked_at: ColumnType<Date, string | undefined, string | undefined>
  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type FinanceAskUser = Selectable<FinanceAskUserTable>
export type NewFinanceAskUser = Insertable<FinanceAskUserTable>
export type FianceAskUserUpdate = Updateable<FinanceAskUserTable>
