export const categories = [
  'searches',
  'players',
  'teams',
  'player',
  'team',
  'money',
] as const

export type Category = (typeof categories)[number]
