import {
  filterScoringPlays,
  getCurrentHalfInning,
  getCurrentInningNumber,
  getCurrentOuts,
  type MlbGameDataResponse,
  type MlbPlayByPlayResponse,
  type GameraPlayerReference,
  getCurrentAtBat,
  getCurrentAtBatCount,
  getCurrentRunners,
} from '@statmuse/core/gamera'
import { deepMap, computed } from 'nanostores'
import { last } from 'lodash-es'

interface GameState extends Record<string, unknown> {
  gameData?: MlbGameDataResponse
  playByPlay?: MlbPlayByPlayResponse
}

export const gameState = deepMap<GameState>({})

export const innings = computed(gameState, (gs) => gs.playByPlay?.innings ?? [])

export const scoringInnings = computed(innings, (i) => filterScoringPlays(i))

export const outs = computed(innings, (i) => getCurrentOuts(i))

export const gameScore = computed(gameState, (gs) => ({
  away: gs.gameData?.awayTeam.score ?? 0,
  home: gs.gameData?.homeTeam.score ?? 0,
}))

export const halfInning = computed(innings, (i) => getCurrentHalfInning(i))

export const inningNumber = computed(innings, (i) => getCurrentInningNumber(i))

export const players = computed(
  gameState,
  (gs) =>
    gs.gameData?.players?.reduce(
      (acc, p) => ({ ...acc, [p.id]: p }),
      {} as Record<number, GameraPlayerReference>,
    ),
)

export const atBat = computed(innings, (i) => getCurrentAtBat(i))

export const atBatCount = computed(innings, (i) => getCurrentAtBatCount(i))

export const runners = computed(innings, (i) => getCurrentRunners(i))

export const matchup = computed(
  [gameState, atBat, halfInning, players],
  (gs, ab, hi, p) => {
    const awayAbMatchup = hi?.half == 'top' ? ab?.batter : ab?.pitcher
    const homeAbMatchup = hi?.half === 'bottom' ? ab?.batter : ab?.pitcher

    return {
      away: {
        type: hi?.half == 'top' ? 'batter' : 'pitcher',
        player: p?.[awayAbMatchup?.playerId ?? 0],
        handedness: awayAbMatchup?.handedness,
        position: last(
          gs.gameData?.awayTeam.players?.find(
            (x) => x.playerId === awayAbMatchup?.playerId,
          )?.lineup.positions,
        ),
        stats: gs.gameData?.awayTeam.stats?.splits?.find(
          (s) => s.playerId === awayAbMatchup?.playerId,
        )?.stats,
      },
      home: {
        type: hi?.half == 'bottom' ? 'batter' : 'pitcher',
        player: p?.[homeAbMatchup?.playerId ?? 0],
        handedness: homeAbMatchup?.handedness,
        position: last(
          gs.gameData?.homeTeam.players?.find(
            (x) => x.playerId === homeAbMatchup?.playerId,
          )?.lineup.positions,
        ),
        stats: gs.gameData?.homeTeam.stats?.splits?.find(
          (s) => s.playerId === homeAbMatchup?.playerId,
        )?.stats,
      },
    }
  },
)
