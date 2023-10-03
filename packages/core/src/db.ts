import pg from 'pg'
const { Pool, types } = pg

import {
  Kysely,
  PostgresDialect,
  type Generated,
  type ColumnType,
} from 'kysely'
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import type {
  StoryTable,
  SessionTable,
  IdentityTable,
  UserTable,
  FollowTable,
} from './user'
import type { UsersVisitorTable, VisitorTable } from './visitor'
import type {
  AskEventTable,
  AskTable,
  AskUserTable,
  FinanceAskEventTable,
  FinanceAskTable,
  FinanceAskUserTable,
} from './ask'
import type { ContextTable } from './context'
import type { LinkTable } from './link'
import type { MusingTable } from './musing'
import type { QuestionTable } from './question'

const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

const { SecretString: secret } = await secretsManager.send(
  new GetSecretValueCommand({
    SecretId: process.env.POSTGRES_SECRET_ARN,
  }),
)
if (!secret) throw new Error('No secret found')

const credentials = JSON.parse(secret) as {
  username: string
  password: string
  engine: string
  host: string
  port: 5432
  dbname: string
  dbInstanceIdentifier: string
}

interface ExampleTable {
  id: Generated<string>
  conversation_token: string
  is_published: boolean
  position: number
  text: string
  type: 'sitemap' | 'onboarding' | 'noteworthy'
  author_id: string
  league_id: string
  previous_question_id: string
  question_id: string
  template_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

interface LeagueTable {
  id: Generated<string>

  gamera_actor_id: string
  begin_year: number | null
  end_year: number | null
  name: string
  image_url: string
  example_musing_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

interface PlayerTable {
  id: Generated<string>

  background_color_hex: string | null
  bust_image_url: string | null
  first_name: string
  foreground_color_hex: string | null
  last_name: string
  resource_id: string
  resource_path: string
  used_name: string
  league_id: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
}

export interface Database {
  users: UserTable
  visitors: VisitorTable
  users_visitors: UsersVisitorTable
  asks: AskTable
  ask_events: AskEventTable
  asks_users: AskUserTable
  contexts: ContextTable
  finance_asks: FinanceAskTable
  finance_ask_events: FinanceAskEventTable
  finance_asks_users: FinanceAskUserTable
  links: LinkTable
  musings: MusingTable
  questions: QuestionTable
  examples: ExampleTable
  leagues: LeagueTable
  players: PlayerTable
  identities: IdentityTable
  sessions: SessionTable
  stories: StoryTable
  follows: FollowTable
}

types.setTypeParser(types.builtins.TIMESTAMP, (datetimeString) => {
  const temp = new Date(datetimeString)
  return new Date(
    Date.UTC(
      temp.getFullYear(),
      temp.getMonth(),
      temp.getDate(),
      temp.getHours(),
      temp.getMinutes(),
      temp.getSeconds(),
      temp.getMilliseconds(),
    ),
  )
})

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
      database: credentials.dbname || process.env.POSTGRES_DATABASE,
      user: credentials.username || process.env.POSTGRES_USER,
      password: credentials.password || process.env.POSTGRES_PASSWORD,
      ssl: true,
      connectionTimeoutMillis: 3000,
    }),
  }),
})
