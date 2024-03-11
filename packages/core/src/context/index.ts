import { dbReader } from '../db'
import type { Context } from './context.sql'
export * from './context.sql'

export const list = async (): Promise<Context[] | undefined> =>
  dbReader.selectFrom('contexts').selectAll().execute()

export const getByName = async (name: string): Promise<Context | undefined> => {
  const result = await dbReader
    .selectFrom('contexts')
    .where('name', '=', name)
    .selectAll()
    .executeTakeFirst()

  return result
}

export const getUnknown = async () => {
  return getByName('unknown')
}
