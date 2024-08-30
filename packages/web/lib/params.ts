import type { GameraDomain } from '@statmuse/core/gamera'

export type LeagueParam = Lowercase<Exclude<GameraDomain, 'EPL'>> | 'fc'

export const leagueToDomain = (param: LeagueParam): GameraDomain => {
  if (param === 'fc') return 'EPL'
  return param.toUpperCase() as GameraDomain
}
