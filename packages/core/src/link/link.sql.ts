import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface LinkTable {
  id: string

  short_code: string
  linkable_type: 'ask' | 'finance_ask' | 'question' | 'musing' | 'url'
  ask_id: string | null
  finance_ask_id: string | null
  question_id: string | null
  musing_id: string | null
  url: string | null

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Link = Selectable<LinkTable>
export type NewLink = Insertable<LinkTable>
export type LinkUpdate = Updateable<LinkTable>
