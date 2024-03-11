import { db, dbReader } from '../db'
import type { NewVisitor, Visitor, VisitorUpdate } from './visitor.sql'
export * from './visitor.sql'

export const get = async (id: string) =>
  dbReader
    .selectFrom('visitors')
    .where('visitors.id', '=', id)
    .selectAll()
    .executeTakeFirst()

export const getByOrigin = async (
  originId: string,
  originName: Visitor['origin_name'],
) =>
  dbReader
    .selectFrom('visitors')
    .where('visitors.origin_id', '=', originId)
    .where('visitors.origin_name', '=', originName)
    .selectAll()
    .executeTakeFirst()

export const insert = async (
  visitor: Omit<NewVisitor, 'inserted_at' | 'updated_at'>,
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

export const update = async (visitorId: string, visitor: VisitorUpdate) =>
  db
    .updateTable('visitors')
    .set({
      ...visitor,
      updated_at: new Date().toISOString(),
    })
    .where('id', '=', visitorId)
    .returning('id')
    .executeTakeFirst()
