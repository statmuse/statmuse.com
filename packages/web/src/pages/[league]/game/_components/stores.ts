import {
  filterScoringPlays,
  getCurrentHalfInning,
  getCurrentInningNumber,
  getCurrentOuts,
  type MlbGameDataResponse,
  type MlbPlayByPlayResponse,
  type GameraPlayerReference,
  type StatModel,
  getCurrentAtBat,
  getCurrentAtBatCount,
  getCurrentRunners,
  type InningPlayByPlay,
  type PlayerGameModel,
} from '@statmuse/core/gamera'
import { atom, map, computed } from 'nanostores'
import { last } from 'lodash-es'

interface GameState extends Record<string, unknown> {
  gameData?: MlbGameDataResponse
  playByPlay?: MlbPlayByPlayResponse
}

export const gameState = map<GameState>({})

export const innings = atom<InningPlayByPlay[]>([])

export const scoringInnings = computed(innings, (i) => filterScoringPlays(i))

export const outs = computed(innings, (i) => getCurrentOuts(i))

export const gameScore = map({ home: 0, away: 0 })

export const halfInning = computed(innings, (i) => getCurrentHalfInning(i))

export const inningNumber = computed(innings, (i) => getCurrentInningNumber(i))

export const players = map<Record<number, GameraPlayerReference>>({})

export const atBat = computed(innings, (i) => getCurrentAtBat(i))

export const atBatCount = computed(innings, (i) => getCurrentAtBatCount(i))

export const runners = computed(innings, (i) => getCurrentRunners(i))

export const lineup = map<{
  home?: PlayerGameModel[]
  away?: PlayerGameModel[]
}>({})

export const stats = map<{
  away?: {
    stats?: StatModel
    splits?: {
      splitType?: string
      playerId: number
      stats?: StatModel
    }[]
  }
  home?: {
    stats?: StatModel
    splits?: {
      splitType?: string
      playerId: number
      stats?: StatModel
    }[]
  }
}>({})

export const lineScore = map<{
  away?: {
    inning: number
    runs: number
  }[]
  home?: {
    inning: number
    runs: number
  }[]
}>({})

export const matchup = computed(
  [lineup, stats, atBat, halfInning, players],
  (line, s, ab, hi, p) => {
    const awayAbMatchup = hi?.half == 'top' ? ab?.batter : ab?.pitcher
    const homeAbMatchup = hi?.half === 'bottom' ? ab?.batter : ab?.pitcher

    return {
      away: {
        type: hi?.half == 'top' ? 'batter' : 'pitcher',
        player: p?.[awayAbMatchup?.playerId ?? 0],
        handedness: awayAbMatchup?.handedness,
        position: last(
          line.away?.find((x) => x.playerId === awayAbMatchup?.playerId)?.lineup
            .positions,
        ),
        stats: s.away?.splits?.find(
          (s) => s.playerId === awayAbMatchup?.playerId,
        )?.stats,
      },
      home: {
        type: hi?.half == 'bottom' ? 'batter' : 'pitcher',
        player: p?.[homeAbMatchup?.playerId ?? 0],
        handedness: homeAbMatchup?.handedness,
        position: last(
          line.home?.find((x) => x.playerId === homeAbMatchup?.playerId)?.lineup
            .positions,
        ),
        stats: s.home?.splits?.find(
          (s) => s.playerId === homeAbMatchup?.playerId,
        )?.stats,
      },
    }
  },
)
