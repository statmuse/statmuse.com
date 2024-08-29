import {
  filterScoringPlays,
  getCurrentHalfInning,
  getCurrentInningNumber,
  getCurrentOuts,
  type MlbGameDataResponse,
  type MlbPlayByPlayResponse,
  type GameraPlayerReference,
  type MlbStatModel,
  getCurrentAtBat,
  getCurrentAtBatCount,
  getCurrentRunners,
  type InningPlayByPlay,
  type PlayerGameModel,
  type MlbStatKey,
  type InningAtBatEvent,
  getValue,
} from '@statmuse/core/gamera'
import { atom, map, computed } from 'nanostores'
import { last } from 'lodash-es'

interface GameState extends Record<string, unknown> {
  gameData?: MlbGameDataResponse<MlbStatKey>
  playByPlay?: MlbPlayByPlayResponse
}

export const gameState = map<GameState>({})

export const innings = atom<InningPlayByPlay[]>([])

export const scoringInnings = computed(innings, (i) => filterScoringPlays(i))

export const outs = computed(innings, (i) => getCurrentOuts(i))

export const gameScore = map({ home: 0, away: 0 })

export const halfInning = computed(innings, (i) => getCurrentHalfInning(i))

export const inningNumber = computed(innings, (i) => getCurrentInningNumber(i))

export const players = map<Record<number, GameraPlayerReference | undefined>>(
  {},
)

export const atBat = computed(innings, (i) => getCurrentAtBat(i))

export const atBatCount = computed(innings, (i) => getCurrentAtBatCount(i))

export const runners = computed(innings, (i) => getCurrentRunners(i))

export const lineup = map<{
  home?: PlayerGameModel[]
  away?: PlayerGameModel[]
}>({})

export const stats = map<{
  away?: {
    stats?: MlbStatModel<MlbStatKey>
    splits?: {
      splitType?: string
      playerId: number
      stats?: MlbStatModel<MlbStatKey>
    }[]
  }
  home?: {
    stats?: MlbStatModel<MlbStatKey>
    splits?: {
      splitType?: string
      playerId: number
      stats?: MlbStatModel<MlbStatKey>
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

export const battingSummary = computed([stats, players], ($stats, $players) => {
  const awaySplits = $stats.away?.splits
  const homeSplits = $stats.home?.splits

  const awayDoubles = awaySplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-Doubles') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-Doubles'),
      }
    })
  const homeDoubles = homeSplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-Doubles') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-Doubles'),
      }
    })

  const awayTriples = awaySplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-Triples') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-Triples'),
      }
    })
  const homeTriples = homeSplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-Triples') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-Triples'),
      }
    })

  const awayHomeRuns = awaySplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-HomeRuns') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-HomeRuns'),
      }
    })
  const homeHomeRuns = homeSplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-HomeRuns') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-HomeRuns'),
      }
    })

  const awayRbis = awaySplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-RunsBattedIn') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-RunsBattedIn'),
      }
    })
  const homeRbis = homeSplits
    ?.filter((s) => getValue(s.stats ?? {}, 'Batting-RunsBattedIn') > 0)
    .map((s) => {
      const player = $players[s.playerId]
      return {
        name: player?.entity.shortDisplay ?? player?.entity.display,
        total: getValue(s.stats ?? {}, 'Batting-RunsBattedIn'),
      }
    })

  return {
    away: {
      doubles: awayDoubles?.length > 0 ? awayDoubles : undefined,
      triples: awayTriples?.length > 0 ? awayTriples : undefined,
      homeRuns: awayHomeRuns?.length > 0 ? awayHomeRuns : undefined,
      rbis: awayRbis?.length > 0 ? awayRbis : undefined,
    },
    home: {
      doubles: homeDoubles?.length > 0 ? homeDoubles : undefined,
      triples: homeTriples?.length > 0 ? homeTriples : undefined,
      homeRuns: homeHomeRuns?.length > 0 ? homeHomeRuns : undefined,
      rbis: homeRbis?.length > 0 ? homeRbis : undefined,
    },
  }
})
export const baseRunningSummary = computed(
  [stats, players],
  ($stats, $players) => {
    const awaySplits = $stats.away?.splits
    const homeSplits = $stats.home?.splits

    const awaySB = awaySplits
      ?.filter((s) => getValue(s.stats ?? {}, 'Batting-StolenBases') > 0)
      .map((s) => {
        const player = $players[s.playerId]
        return {
          name: player?.entity.shortDisplay ?? player?.entity.display,
          total: getValue(s.stats ?? {}, 'Batting-StolenBases'),
        }
      })
    const homeSB = homeSplits
      ?.filter((s) => getValue(s.stats ?? {}, 'Batting-StolenBases') > 0)
      .map((s) => {
        const player = $players[s.playerId]
        return {
          name: player?.entity.shortDisplay ?? player?.entity.display,
          total: getValue(s.stats ?? {}, 'Batting-StolenBases'),
        }
      })

    const awayCS = awaySplits
      ?.filter((s) => getValue(s.stats ?? {}, 'Batting-CaughtStealing') > 0)
      .map((s) => {
        const player = $players[s.playerId]
        return {
          name: player?.entity.shortDisplay ?? player?.entity.display,
          total: getValue(s.stats ?? {}, 'Batting-CaughtStealing'),
        }
      })
    const homeCS = homeSplits
      ?.filter((s) => getValue(s.stats ?? {}, 'Batting-CaughtStealing') > 0)
      .map((s) => {
        const player = $players[s.playerId]
        return {
          name: player?.entity.shortDisplay ?? player?.entity.display,
          total: getValue(s.stats ?? {}, 'Batting-CaughtStealing'),
        }
      })

    return {
      away: {
        stolenBases: awaySB?.length > 0 ? awaySB : undefined,
        caughtStealing: awayCS?.length > 0 ? awayCS : undefined,
      },
      home: {
        stolenBases: homeSB?.length > 0 ? homeSB : undefined,
        caughtStealing: homeCS?.length > 0 ? homeCS : undefined,
      },
    }
  },
)

export const selectedId = atom<
  { id: number; alignment: 'home' | 'away' } | undefined
>()

export const selectedPlayer = computed(
  [selectedId, players, stats, innings, gameState],
  ($selectedId, $players, $stats, $innings, $gameState) => {
    if (!$selectedId) return undefined

    const { alignment } = $selectedId
    const player = $players[$selectedId.id]

    const oppTeamId =
      alignment === 'home'
        ? $gameState.gameData?.awayTeam.teamId
        : $gameState.gameData?.homeTeam.teamId
    const oppTeam = $gameState.gameData?.teams?.find(
      (t) => t.teamId === oppTeamId,
    )

    const stats = $stats[alignment]?.splits?.find(
      (s) => s.playerId === player?.id,
    )?.stats

    const atBats = $innings.flatMap((inning) => {
      const number = inning.number
      const half = inning.halves[alignment === 'away' ? 0 : 1].half

      return inning.halves[alignment === 'away' ? 0 : 1].events
        .filter((e) => e.type === 'atBat')
        .filter((e) => e.batter.playerId === player?.id)
        .map((x) => ({
          ...x,
          number,
          half,
          pitcher: $players[x.pitcher.playerId],
        }))
    })

    return {
      player,
      stats,
      oppTeam,
      alignment,
      gameTimestamp: $gameState.gameData?.gameTimestamp,
      atBats,
    }
  },
)

export const selectedAtBat = atom<
  | {
      atBat: InningAtBatEvent
      number: number
      half: string
      pitcher?: GameraPlayerReference
    }
  | undefined
>()

export const init = (props: {
  gameData: MlbGameDataResponse<MlbStatKey>
  playByPlay?: MlbPlayByPlayResponse
}) => {
  const { gameData, playByPlay } = props

  gameState.set({ gameData, playByPlay })
  innings.set(playByPlay?.innings ?? [])
  gameScore.set({
    away: gameData.awayTeam.score,
    home: gameData.homeTeam.score,
  })
  lineScore.set({
    away: gameData.awayTeam.lineScore,
    home: gameData.homeTeam.lineScore,
  })
  stats.set({
    away: gameData.awayTeam.stats,
    home: gameData.homeTeam.stats,
  })
  lineup.set({
    away: gameData.awayTeam.players,
    home: gameData.homeTeam.players,
  })
  players.set(
    gameData.players?.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}) ?? {},
  )
}

export const update = (data: any) => {
  console.log(data)

  gameScore.set(data.gameScore)
  lineScore.set(data.lineScore)
  lineup.set(data.lineup)
  stats.set(data.stats)
  players.set(data.players.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}))
  innings.set([
    ...innings.get().filter((i) => i.number !== data.lastInning.number),
    data.lastInning,
  ])
}
