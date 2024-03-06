import type { GameraDomain } from '@statmuse/core/gamera'

export type LeagueParam = 'nba' | 'nfl' | 'mlb' | 'nhl' | 'pga' | 'fc' | 'money'

export const leagueToDomain = (param: LeagueParam): GameraDomain => {
  if (param === 'fc') return 'EPL'
  return param.toUpperCase() as GameraDomain
}
