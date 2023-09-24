import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface ContextTable {
  id: string
  name: string
  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Context = Selectable<ContextTable>
export type NewContext = Insertable<ContextTable>
export type ContextUpdate = Updateable<ContextTable>
