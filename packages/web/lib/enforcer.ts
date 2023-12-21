import * as Asks from '@statmuse/core/ask'

const freeAskLimit = 35
export const freeRowLimit = 25

export const canQuery = async (locals: App.Locals, domain?: string) => {
  if (locals.subscribed) return locals.subscribed
  if (domain === 'epl') return false

  const result = locals.user
    ? await Asks.countByUser(locals.user.id)
    : await Asks.countByVisitor(locals.visitor.id)
  const count = result ? Number(result.ask_count) : 0

  return count < freeAskLimit
}

export const canQueryFinance = async (locals: App.Locals) => {
  if (locals.subscribed) return locals.subscribed

  const result = locals.user
    ? await Asks.financeCountByUser(locals.user.id)
    : await Asks.financeCountByVisitor(locals.visitor.id)
  const count = result ? Number(result.ask_count) : 0

  return count < freeAskLimit
}
