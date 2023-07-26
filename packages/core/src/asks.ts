import { db } from "./db";
import type { InferResult } from "kysely";


export const getAsksIndex = db.selectFrom('asks')
  .selectAll('asks')
  .innerJoin('contexts', 'contexts.id', 'asks.context_id')
  .where('is_in_index', '=', true)
  .where('last_web_search_at', 'is not', null)
  .orderBy('last_web_search_at', 'desc')
  .selectAll('asks')
  .select('contexts.name as league_name')
  .limit(15)

export type Ask = InferResult<typeof getAsksIndex>[number]