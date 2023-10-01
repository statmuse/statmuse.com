import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface UserTable {
  id: string

  username: string
  email: string
  email_confirm_token: string
  has_completed_signup: boolean
  referrer_id: string | null

  stripe_customer_id: string | null
  stripe_subscription_status: string | null

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
