import { db } from "./db";

const leagues = ['nba', 'nfl', 'nhl', 'mlb', 'pga']

export const getListContextIds = async (names: string[]) => {
  const records = await db.selectFrom('contexts')
    .where('contexts.name', 'in', names)
    .selectAll()
    .execute()
  return records.map(r => r.id)
}

export const getAsksIndex = async (names = leagues) => 
  db.selectFrom('asks')
  .selectAll('asks')
  .innerJoin('contexts', 'contexts.id', 'asks.context_id')
  .where('is_in_index', '=', true)
  .where('last_web_search_at', 'is not', null)
  .where('context_id', 'in', await getListContextIds(names))
  .orderBy('last_web_search_at', 'desc')
  .selectAll('asks')
  .select('contexts.name as league_name')
  .limit(15)
  .execute()

export type Ask = Awaited<ReturnType<typeof getAsksIndex>>[number]