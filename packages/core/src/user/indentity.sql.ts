import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface IdentityTable {
  id: string

  user_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Identity = Selectable<IdentityTable>
export type NewIdentity = Insertable<IdentityTable>
export type IdentityUpdate = Updateable<IdentityTable>
