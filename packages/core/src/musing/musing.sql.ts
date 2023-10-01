import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely'

export interface MusingTable {
  id: Generated<string>
  friendly_id: string
  league_id: string
  content_type: 'latest-stats' | 'user-generated' | 'templated'
  publish_at: ColumnType<Date, string | undefined, string | undefined>

  layout_type: 'bottom'
  text_markdown: string | null
  text_plain: string | null
  image_url: string | null
  video_url: string | null
  audio_answer_url: string | null
  video_should_replay: boolean
  foreground_rgba: { a: number; b: number; g: number; r: number }
  background_rgba: { a: number; b: number; g: number; r: number }
  author_id: string | null
  question_id: string
  is_editorial: boolean
  visitor_id: string | null
  expires_at: ColumnType<Date, string | undefined, string | undefined>
  template_id: string
  expired_early_at: ColumnType<Date, string | undefined, string | undefined>
  relevance_score_boost: number

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type Musing = Selectable<MusingTable>
export type NewMusing = Insertable<MusingTable>
export type MusingUpdate = Updateable<MusingTable>
