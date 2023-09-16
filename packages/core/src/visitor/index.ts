import { db } from '../db'
import { NewVisitor } from './visitor.sql'
export * from './visitor.sql'

export const get = async (id: string) =>
  db
    .selectFrom('visitors')
    .where('visitors.id', '=', id)
    .selectAll()
    .executeTakeFirst()

export const getByOrigin = async (originId: string, originName: string) =>
  db
    .selectFrom('visitors')
    .where('visitors.origin_id', '=', originId)
    .where('visitors.origin_name', '=', originName)
    .selectAll()
    .executeTakeFirst()

export const insert = async (
  visitor: Omit<NewVisitor, 'inserted_at' | 'updated_at'>
) =>
  db
    .insertInto('visitors')
    .values({
      ...visitor,
      inserted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
