import {
  getCurrentHalfInning,
  getCurrentInningNumber,
  getCurrentOuts,
  getCurrentRunners,
  type GameraDomain,
  type MlbGameDataResponse,
  type MlbPlayByPlayResponse,
  type MlbStatKey,
  type Runner,
} from '@statmuse/core/gamera'
import { atom } from 'nanostores'

type MlbGame = {
  score: {
    away: number
    home: number
  }
  inningNumber: number
  inningHalf: 'top' | 'bottom'
  outs: number
  runners: Runner[]
}

export const scores = atom<Record<string, MlbGame | undefined>>({})

export const addGame = (
  domain: GameraDomain,
  game: {
    data?: MlbGameDataResponse<MlbStatKey>
    playByPlay?: MlbPlayByPlayResponse
  },
) => {
  const allGames = scores.get()
  scores.set({
    ...allGames,
    [`${domain}-${game.data?.gameId ?? 0}`]: {
      score: {
        away: game.data?.awayTeam.score ?? 0,
        home: game.data?.homeTeam.score ?? 0,
      },
      inningHalf:
        getCurrentHalfInning(game.playByPlay?.innings ?? [])?.half ?? 'top',
      inningNumber: getCurrentInningNumber(game.playByPlay?.innings ?? []),
      outs: getCurrentOuts(game.playByPlay?.innings ?? []),
      runners: getCurrentRunners(game.playByPlay?.innings ?? []),
    },
  })
}
