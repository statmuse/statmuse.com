import { db } from './db'
import { InferResult } from 'kysely'
import { isUUID } from './questions'

export const getMusingByIdOrFriendlyId = (id: string) => {
  let query = db
    .selectFrom('musings')
    .innerJoin('questions', 'questions.id', 'musings.question_id')
    .innerJoin('leagues', 'leagues.id', 'musings.league_id')
    .innerJoin('links', 'links.musing_id', 'musings.id')

  if (isUUID(id)) {
    query = query.where(({ cmpr, or }) =>
      or([cmpr('musings.id', '=', id), cmpr('musings.friendly_id', '=', id)])
    )
  } else {
    query = query.where('musings.friendly_id', '=', id)
  }

  return query
    .selectAll(['musings', 'questions'])
    .select('leagues.name as domain')
    .select('links.short_code')
    .limit(1)
}

export const getMusingByShortcode = (code: string) =>
  db
    .selectFrom('musings')
    .innerJoin('links', 'links.musing_id', 'musings.id')
    .innerJoin('leagues', 'leagues.id', 'musings.league_id')
    .innerJoin('questions', 'questions.id', 'musings.question_id')
    .where('links.short_code', '=', code)
    .selectAll('musings')
    .select('questions.text as question_text')
    .select('leagues.name as domain')
    .executeTakeFirst()

export type Musing = InferResult<
  ReturnType<typeof getMusingByIdOrFriendlyId>
>[number]

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
