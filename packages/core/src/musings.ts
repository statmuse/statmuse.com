import { db } from './db'
import { InferResult } from 'kysely'

export const getMusing = (musing?: string) =>
  db
    .selectFrom('musings')
    .innerJoin('questions', 'questions.id', 'musings.question_id')
    .innerJoin('leagues', 'leagues.id', 'musings.league_id')
    .innerJoin('links', 'links.musing_id', 'musings.id')
    .where('musings.friendly_id', '=', musing || null)
    .selectAll(['musings', 'questions'])
    .select('leagues.name as domain')
    .select('links.short_code')
    .limit(1)

export const getMusingByShortcode = (code: string) =>
  db
    .selectFrom('musings')
    .innerJoin('links', 'links.musing_id', 'musings.id')
    .innerJoin('questions', 'questions.id', 'musings.question_id')
    .where('links.short_code', '=', code)
    .selectAll('musings')
    .select('questions.text as question_text')
    .executeTakeFirst()

export type Musing = InferResult<ReturnType<typeof getMusing>>[number]

export const listLatestMusings = db
  .selectFrom('musings')
  .innerJoin('links', 'links.musing_id', 'musings.id')
  .where('musings.content_type', '=', 'latest-stats')
  .where((eb) =>
    eb.or([
      eb.cmpr('musings.publish_at', '=', null),
      eb.cmpr('musings.publish_at', '<=', new Date()),
    ])
  )
  .limit(20)
  .orderBy('musings.publish_at', 'desc')
  .selectAll('musings')
  .select('links.short_code')

export type LatestMusing = InferResult<typeof listLatestMusings>[number]
