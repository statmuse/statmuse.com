import pg from 'pg'
const { Pool, types } = pg

import { Kysely, PostgresDialect, Generated, ColumnType } from 'kysely'
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { GameraResponse } from './gamera'
import { UserTable } from './user'
import { UsersVisitorTable, VisitorTable } from './visitor'
import {
  AskEventTable,
  AskTable,
  AskUserTable,
  FinanceAskEventTable,
  FinanceAskTable,
  FinanceAskUserTable,
} from './ask'
import { ContextTable } from './context'
import { LinkTable } from './link'

const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

const { SecretString: secret } = await secretsManager.send(
  new GetSecretValueCommand({
    SecretId: process.env.POSTGRES_SECRET_ARN,
  })
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

console.log('POSTGRES_SECRET_ARN', process.env.POSTGRES_SECRET_ARN)
console.log('POSTGRES_HOST', process.env.POSTGRES_HOST)
console.log('credentials', credentials)

interface MusingTable {
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
  author_id: string
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

interface QuestionTable {
  id: Generated<string>
  friendly_id: string
  caption: string
  config: {}
  text: string
  answer: GameraResponse
  is_successful: boolean
  data_last_updated_at: ColumnType<Date, string | undefined, string | undefined>
  duration: number
  error: string
  handler: string
  preprocessed: string
  tokenized: string
  context_id: string
  user_id: string
  error_message: string
  text_clarification_for: string
  visitor_id: string
  sid: number
  ask_url: string
  input_conversation_token: string

  inserted_at: ColumnType<Date, string | undefined, string | undefined>
  updated_at: ColumnType<Date, string | undefined, string | undefined>
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
      temp.getMilliseconds()
    )
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
    }),
  }),
})
