import type { GameraDomain } from '@statmuse/core/gamera'

export type LeagueParam =
  | 'nba'
  | 'nfl'
  | 'mlb'
  | 'nhl'
  | 'pga'
  | 'fc'
  | 'fantasy'
  | 'money'

export const leagueToDomain = (param: LeagueParam): GameraDomain => {
  if (param === 'fc') return 'EPL'
  return param.toUpperCase() as GameraDomain
}
