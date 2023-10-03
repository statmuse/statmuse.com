import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface StoryTable {
  id: string

  user_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Story = Selectable<StoryTable>
export type NewStory = Insertable<StoryTable>
export type StoryUpdate = Updateable<StoryTable>
