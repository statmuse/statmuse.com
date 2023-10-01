import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface SessionTable {
  id: string

  user_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Session = Selectable<SessionTable>
export type NewSession = Insertable<SessionTable>
export type SessionUpdate = Updateable<SessionTable>
