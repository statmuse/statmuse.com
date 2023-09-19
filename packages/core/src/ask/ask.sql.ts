import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'
import { GameraResponse } from '../gamera'

export interface AskTable {
  id: string

  answer: GameraResponse
  answer_html: string | null
  answer_text: string | null
  answer_type:
    | 'answer'
    | 'error'
    | 'prompt'
    | 'player_bio'
    | 'team_franchise_bio'
    | 'team_season_bio'
    | 'unknown'
  context_id: string
  count_total: number
  count_web_search: number
  count_web_view: number
  hex_background: string | null
  hex_foreground: string | null
  image_url: string | null
  is_fantasy_query: boolean
  is_game_odds_query: boolean | null
  is_in_index: boolean
  is_in_index_pin: boolean | null
  is_in_suggests: boolean
  is_in_suggests_pin: boolean | null
  is_legacy_answer: boolean
  last_user_id: string | null
  last_visitor_id: string | null
  last_web_search_at: ColumnType<
    Date,
    string | undefined,
    string | undefined
  > | null
  query: string
  resource_path: string
  resource_query: string
  sid: Generated<number>

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Ask = Selectable<AskTable>
export type NewAsk = Insertable<AskTable>
export type AskUpdate = Updateable<AskTable>

export interface AskUserTable {
  id: string

  ask_id: string
  user_id: string

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

export interface FinanceAskTable {
  id: string

  answer: GameraResponse
  answer_text: string | null
  answer_type: 'answer' | 'asset' | 'error' | 'unknown'
  count_total: number
  count_web_search: number
  count_web_view: number
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
