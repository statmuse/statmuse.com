import type { InferResult } from 'kysely'
import { dbReader } from '../db'
import { isUUID } from '../question'
import type { GameraDomain } from '../gamera'
export * from './musing.sql'

export const getMusingByIdOrFriendlyId = (id: string) => {
  let query = dbReader
    .selectFrom('musings')
    .innerJoin('questions', 'questions.id', 'musings.question_id')
    .innerJoin('leagues', 'leagues.id', 'musings.league_id')
    .innerJoin('links', 'links.musing_id', 'musings.id')

  if (isUUID(id)) {
    query = query.where(({ cmpr, or }) =>
      or([cmpr('musings.id', '=', id), cmpr('musings.friendly_id', '=', id)]),
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
  dbReader
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

export const listLatestMusings = (league?: GameraDomain) => {
  let query = dbReader
    .selectFrom('musings')
    .innerJoin('links', 'links.musing_id', 'musings.id')

  if (league) {
    query = query
      .innerJoin('leagues', 'leagues.id', 'musings.league_id')
      .where('leagues.name', '=', league)
  }

  return query
    .where('musings.content_type', '=', 'latest-stats')
    .where((eb) =>
      eb.or([
        eb.cmpr('musings.publish_at', '=', null),
        eb.cmpr('musings.publish_at', '<=', new Date()),
      ]),
    )
    .limit(20)
    .orderBy('musings.publish_at', 'desc')
    .selectAll('musings')
    .select('links.short_code')
    .execute()
}

export type LatestMusing = Awaited<ReturnType<typeof listLatestMusings>>[number]
