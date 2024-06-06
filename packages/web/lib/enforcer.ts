import * as Asks from '@statmuse/core/ask'

const freeAskLimit = 75
export const freeRowLimit = 25

export const canQuery = async (locals: App.Locals) => {
  if (import.meta.env.DEV) return true
  if (locals.subscribed) return locals.subscribed

  const result = locals.user
    ? await Asks.countByUser(locals.user.id)
    : await Asks.countByVisitor(locals.visitor.id)
  const count = result ? Number(result.ask_count) : 0

  return count < freeAskLimit
}

export const canQueryFinance = async (locals: App.Locals) => {
  if (import.meta.env.DEV) return true
  if (locals.subscribed) return locals.subscribed

  const result = locals.user
    ? await Asks.financeCountByUser(locals.user.id)
    : await Asks.financeCountByVisitor(locals.visitor.id)
  const count = result ? Number(result.ask_count) : 0

  return count < freeAskLimit
}
