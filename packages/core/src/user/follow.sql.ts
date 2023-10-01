import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface FollowTable {
  id: string

  follower_id: string
  followed_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Follow = Selectable<FollowTable>
export type NewFollow = Insertable<FollowTable>
export type FollowUpdate = Updateable<FollowTable>
