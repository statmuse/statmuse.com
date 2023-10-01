import { db } from './db'
import type { Ask, FinanceAsk } from './ask/ask.sql'
import type { Musing } from './musing'
import type { Question } from './question'

export const getLink = async (code: string): Promise<Linkable | undefined> => {
  const link = await db
    .selectFrom('links')
    .where('links.short_code', '=', code)
    .selectAll()
    .executeTakeFirst()

  if (link && link.ask_id) {
    const ask = await db
      .selectFrom('asks')
      .innerJoin('contexts', 'contexts.id', 'asks.context_id')
      .where('asks.id', '=', link.ask_id)
      .selectAll('asks')
      .select('contexts.name as domain')
      .executeTakeFirst()
    return {
      linkable_type: 'ask',
      ...ask,
    } as LinkableAsk
  }

  if (link && link.finance_ask_id) {
    const financeAsk = await db
      .selectFrom('finance_asks')
      .where('id', '=', link.finance_ask_id)
      .selectAll()
      .executeTakeFirst()
    return {
      linkable_type: 'finance_ask',
      ...financeAsk,
    } as LinkableFinanceAsk
  }

  if (link && link.musing_id) {
    const musing = await db
      .selectFrom('musings')
      .where('id', '=', link.musing_id)
      .selectAll()
      .executeTakeFirst()
    return {
      linkable_type: 'musing',
      ...musing,
    } as LinkableMusing
  }

  if (link && link.question_id) {
    const question = await db
      .selectFrom('questions')
      .where('id', '=', link.question_id)
      .selectAll()
      .executeTakeFirst()
    return {
      linkable_type: 'question',
      ...question,
    } as LinkableQuestion
  }

  return link as LinkableUrl
}

interface LinkableAsk extends Ask {
  linkable_type: 'ask'
}

interface LinkableFinanceAsk extends FinanceAsk {
  linkable_type: 'finance_ask'
}

interface LinkableMusing extends Musing {
  linkable_type: 'musing'
}

interface LinkableQuestion extends Question {
  linkable_type: 'question'
}

type LinkableUrl = {
  linkable_type: 'url'
  url: string
}

export type Linkable =
  | LinkableAsk
  | LinkableFinanceAsk
  | LinkableMusing
  | LinkableQuestion
  | LinkableUrl
