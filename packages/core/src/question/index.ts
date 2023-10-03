import type { InferResult } from 'kysely'
import { db } from '../db'
export * from './question.sql'

export const getQuestion = (id: string) =>
  db.selectFrom('questions').where('questions.id', '=', id).selectAll().limit(1)

export const isUUID = (s: string) =>
  new RegExp(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  ).test(s)

export const getQuestionByIdOrFriendlyId = (id: string) => {
  let query = db
    .selectFrom('questions')
    .innerJoin('contexts', 'contexts.id', 'questions.context_id')

  if (isUUID(id)) {
    query = query.where(({ cmpr, or }) =>
      or([
        cmpr('questions.id', '=', id),
        cmpr('questions.friendly_id', '=', id),
      ]),
    )
  } else {
    query = query.where('questions.friendly_id', '=', id)
  }

  return query
    .selectAll('questions')
    .select('contexts.name as domain')
    .executeTakeFirst()
}

export type Question = InferResult<ReturnType<typeof getQuestion>>[number]
export type Answer = Question['answer']
