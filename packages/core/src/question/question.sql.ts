import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'
import type { GameraResponse } from '../gamera'

export interface QuestionTable {
  id: Generated<string>
  friendly_id: string
  caption: string
  config: {}
  text: string
  answer: GameraResponse
  is_successful: boolean
  data_last_updated_at: ColumnType<Date, string | undefined, string | undefined>
  duration: number
  error: string
  handler: string
  preprocessed: string
  tokenized: string
  context_id: string
  user_id: string | null
  error_message: string
  text_clarification_for: string
  visitor_id: string
  sid: number
  ask_url: string
  input_conversation_token: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Question = Selectable<QuestionTable>
export type NewQuestion = Insertable<QuestionTable>
export type QuestionUpdate = Updateable<QuestionTable>
