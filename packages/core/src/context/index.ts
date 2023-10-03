import { db } from '../db'
import type { Context } from './context.sql'
export * from './context.sql'

export const getByName = async (name: string): Promise<Context | undefined> => {
  const result = await db
    .selectFrom('contexts')
    .where('name', '=', name)
    .selectAll()
    .executeTakeFirst()

  return result
}

export const getUnknown = async () => {
  return getByName('unknown')
}
