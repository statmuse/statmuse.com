import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface VisitorTable {
  id: string

  origin_id: string
  origin_name: 'web' | 'web.bot' | 'web.googlebot' | 'web.statbot'
  timezone_name: string
  is_bot: boolean
  last_request_path: string
  last_request_id: ColumnType<string, string | undefined, string | undefined>
  last_request_ids: ColumnType<
    string[],
    string[] | undefined,
    string | undefined
  >
  request_count: number

  origin_version: string | null
  conversation_token: string | null
  user_agent: string | null
  bot_name: string | null
  last_referrer_id: string | null
  cookie_status: 'allow' | 'deny' | 'dismiss' | null
  last_request_ip: string | null
  last_request: {} | null

  inserted_at: ColumnType<Date, string, never>
  updated_at: ColumnType<Date, string, string>
}

export type Visitor = Selectable<VisitorTable>
export type NewVisitor = Insertable<VisitorTable>
export type VisitorUpdate = Updateable<VisitorTable>

export interface UsersVisitorTable {
  id: string

  user_id: string
  visitor_id: string

  inserted_at: ColumnType<Date, string, never>
  updated_at: ColumnType<Date, string, string>
}

export type UsersVisitor = Selectable<UsersVisitorTable>
export type NewUsersVisitor = Insertable<UsersVisitorTable>
export type UsersVisitorUpdate = Updateable<UsersVisitorTable>
