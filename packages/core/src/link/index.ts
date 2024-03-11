import { dbReader } from '../db'
export * from './link.sql'

export const askShortCode = async (query: string, domain: string) =>
  dbReader
    .selectFrom('asks')
    .innerJoin('links', 'links.ask_id', 'asks.id')
    .where('asks.query', '=', query)
    .where(
      'asks.context_id',
      '=',
      dbReader.selectFrom('contexts').where('name', '=', domain).select('id'),
    )
    .select('links.short_code')
    .executeTakeFirst()

export const financeAskShortCode = async (query: string) =>
  dbReader
    .selectFrom('finance_asks')
    .innerJoin('links', 'links.finance_ask_id', 'finance_asks.id')
    .where('finance_asks.query', '=', query)
    .select('links.short_code')
    .executeTakeFirst()
