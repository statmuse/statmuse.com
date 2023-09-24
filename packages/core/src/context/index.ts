import { db } from '../db'
import { Context } from './context.sql'
export * from './context.sql'

export const getByName = async (name: string): Promise<Context> => {
  const result = await db
    .selectFrom('contexts')
    .where('name', '=', name)
    .selectAll()
    .executeTakeFirst()

  if (name === 'unknown' && !result) {
    throw new Error("Could not find 'unknown' context in db")
  }

  return result ?? (await getUnknown())
}

export const getUnknown = () => {
  return getByName('unknown')
}
