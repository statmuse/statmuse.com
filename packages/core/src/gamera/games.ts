import type {
  GameraPlayerReference,
  GameraTeamReference,
  GameraToken,
  Value,
  Season,
  Game,
  BettingOdds,
  StatModel,
} from './base'
import type {
  GameraDefaultResponse,
  NbaHistoricalBoxScore,
  NflHistoricalBoxScore,
  NhlHistoricalBoxScore,
  MlbHistoricalBoxScore,
  EplHistoricalBoxScore,
  GameraGenericGridsDetail,
  Visual,
} from './answer'
import { findLast, some, last } from 'lodash-es'

export interface NbaBoxScoreVisual extends Visual {
  domain: 'NBA'
  detail: [NbaHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NflBoxScoreVisual extends Visual {
  domain: 'NFL'
  detail: [NflHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface MlbBoxScoreVisual extends Visual {
  domain: 'MLB'
  detail: [MlbHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NhlBoxScoreVisual extends Visual {
  domain: 'NHL'
  detail: [NhlHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface EplBoxScoreVisual extends Visual {
  domain: 'EPL'
  detail: [EplHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface GameraAnswerNbaBoxScore extends GameraDefaultResponse {
  domain: 'NBA'
  visual: NbaBoxScoreVisual
}
export interface GameraAnswerNflBoxScore extends GameraDefaultResponse {
  domain: 'NFL'
  visual: NflBoxScoreVisual
}
export interface GameraAnswerMlbBoxScore extends GameraDefaultResponse {
  domain: 'MLB'
  visual: MlbBoxScoreVisual
}
export interface GameraAnswerNhlBoxScore extends GameraDefaultResponse {
  domain: 'NHL'
  visual: NhlBoxScoreVisual
}
export interface GameraAnswerEplBoxScore extends GameraDefaultResponse {
  domain: 'EPL'
  visual: EplBoxScoreVisual
}

export type GameraAnswerBoxScore =
  | GameraAnswerNbaBoxScore
  | GameraAnswerNflBoxScore
  | GameraAnswerMlbBoxScore
  | GameraAnswerNhlBoxScore
  | GameraAnswerEplBoxScore

export interface GameraGamesResponse<G extends Game> {
  seasonYearDisplay: string
  teams: GameraTeamReference[]
  games: G[]
}

export type MlbGameStatus =
  | 'scheduled'
  | 'postponed'
  | 'delayed'
  | 'inProgress'
  | 'suspended'
  | 'completed'
  | 'canceled'

export type Position =
  | 'pitcher'
  | 'catcher'
  | 'firstBase'
  | 'secondBase'
  | 'thirdBase'
  | 'shortStop'
  | 'leftField'
  | 'centerField'
  | 'rightField'
  | 'designatedHitter'
  | 'pinchHitter'
  | 'pinchRunner'

export const formatMlbPosition = (
  position?: Position | Position[],
  handedness?: 'left' | 'right',
) => {
  if (!position) return ''
  const lastPosition = Array.isArray(position)
    ? position[position.length - 1]
    : position

  switch (lastPosition) {
    case 'catcher':
      return 'C'
    case 'firstBase':
      return '1B'
    case 'secondBase':
      return '2B'
    case 'thirdBase':
      return '3B'
    case 'shortStop':
      return 'SS'
    case 'leftField':
      return 'LF'
    case 'centerField':
      return 'CF'
    case 'rightField':
      return 'RF'
    case 'designatedHitter':
      return 'DH'
    case 'pinchHitter':
      return 'PH'
    case 'pinchRunner':
      return 'PR'
    case 'pitcher':
      return handedness ? `${handedness === 'right' ? 'RH' : 'LH'}P` : 'P'
  }
}

export interface PlayerGameModel {
  playerId: number
  lineup: {
    positions?: Position[]
    battingOrder: number
    battingOrderSequence: number
    pitchingSequence: number
  }
}

export type MlbPitchingStatKey =
  | 'Pitching-CompleteGames'
  | 'Pitching-EarnedRunAverage'
  | 'Pitching-EarnedRuns'
  | 'Pitching-GamesPitched'
  | 'Pitching-GamesStarted'
  | 'Pitching-HitBatsmen'
  | 'Pitching-Hits'
  | 'Pitching-HomeRuns'
  | 'Pitching-InningsPitched'
  | 'Pitching-Losses'
  | 'Pitching-Runs'
  | 'Pitching-Saves'
  | 'Pitching-Shutouts'
  | 'Pitching-Strikeouts'
  | 'Pitching-Walks'
  | 'Pitching-Wins'

export type MlbBattingStatKey =
  | 'Batting-AtBats'
  | 'Batting-BattingAverage'
  | 'Batting-CaughtStealing'
  | 'Batting-Doubles'
  | 'Batting-HitByPitches'
  | 'Batting-Hits'
  | 'Batting-HomeRuns'
  | 'Batting-GamesPlayed'
  | 'Batting-OnBasePercentage'
  | 'Batting-Runs'
  | 'Batting-RunsBattedIn'
  | 'Batting-SluggingPercentage'
  | 'Batting-StolenBases'
  | 'Batting-Strikeouts'
  | 'Batting-Triples'
  | 'Batting-Walks'

export type MlbStatKey =
  | MlbPitchingStatKey
  | MlbBattingStatKey
  | 'Fielding-Errors'

export type MlbStatKeySet = {
  pitchingStandard: MlbPitchingStatKey
  battingStandard: MlbBattingStatKey
}

export interface MlbTeamGameModel<K extends MlbStatKey> {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: 'win' | 'loss' | 'noDecision' | 'suspended'
  stats?: {
    stats?: StatModel<K>
    splits?: {
      splitType?: string
      playerId: number
      stats?: StatModel<K>
    }[]
  }
  probablePitcher?: {
    playerId: number
  }
  lineScore?: {
    inning: number
    runs: number
  }[]
  players?: PlayerGameModel[]
}

interface MlbOfficial {
  assignment:
    | 'homePlate'
    | 'firstBase'
    | 'secondBase'
    | 'thirdBase'
    | 'leftField'
    | 'rightField'
  firstName?: string
  lastName?: string
  fullName?: string
}

export interface MlbGameDataResponse<K extends MlbStatKey> {
  gameId: number
  gameStatus: MlbGameStatus
  seasonYearDisplay?: string
  season: Season
  gameDate: string
  gameTimestamp: string
  networkName: string
  homeTeam: MlbTeamGameModel<K>
  awayTeam: MlbTeamGameModel<K>
  weather?: {
    temperatureFahrenheit: number
    cloudCoveragePercentage: number
    wind: {
      speedMph: number
      direction?: string
    }
  }
  venue: {
    name?: string
    location?: string
  }
  timeOfDay: 'day' | 'night'
  officials?: MlbOfficial[]
  teams?: GameraTeamReference[]
  players?: GameraPlayerReference[]
  odds?: BettingOdds
  summary?: GameraToken[]
}

export type Coordinates = {
  x: number
  y: number
}

interface HitData {
  hardness?: 'soft' | 'medium' | 'hard'
  trajectory?:
    | 'buntGrounder'
    | 'buntPopup'
    | 'buntLineDrive'
    | 'flyBall'
    | 'groundBall'
    | 'lineDrive'
    | 'popup'
  coordinates?: Coordinates
}

interface PitchData {
  pitchType?:
    | 'fastball'
    | 'sinker'
    | 'cutter'
    | 'curveball'
    | 'slider'
    | 'changeup'
    | 'knuckleball'
    | 'splitter'
    | 'screwball'
    | 'forkball'
    | 'eephus'
    | 'intentionalBall'
    | 'pitchOut'
  zone?: number
  speed?: number
  coordinates?: Coordinates
}

interface PitchCount {
  balls: number
  strikes: number
  outs: number
}

export interface Runner {
  outcomeType?:
    | 'steal'
    | 'caughtStealing'
    | 'pickoff'
    | 'otherAdvance'
    | 'otherOut'
  playerId: number
  startingBase: number
  endingBase: number
  description?: GameraToken[]
  isOut: boolean
}

interface PitchFlags {
  isAtBatOver: boolean
  isHit: boolean
  isBunt: boolean
  isWildPitch: boolean
  isPassedBall: boolean
  isDoublePlay: boolean
  isTriplePlay: boolean
}

export interface PitchAtBatEvent {
  type: 'pitch'
  pitchData?: PitchData
  hitData?: HitData
  count: PitchCount
  runners?: Runner[]
  outcomeType:
    | 'catcherInterference'
    | 'hitterInterference'
    | 'fieldersChoice'
    | 'outOfBattersBox'
    | 'outOnAppeal'
    | 'rulingPending'
    | 'single'
    | 'double'
    | 'triple'
    | 'homeRun'
    | 'hitByPitch'
    | 'balk'
    | 'intentionalWalk'
    | 'foul'
    | 'reachedOnError'
    | 'enforcedBall'
    | 'enforcedStrike'
    | 'ball'
    | 'dirtBall'
    | 'intentionalBall'
    | 'pitchout'
    | 'strikeSwinging'
    | 'strikeLooking'
    | 'sacrificeBunt'
    | 'sacrificeFly'
    | 'flyOut'
    | 'groundOut'
    | 'lineOut'
    | 'popOut'
  flags: PitchFlags
}

interface StealAtBatEvent {
  type: 'steal'
  count: PitchCount
  runners?: Runner[]
}

interface LineupChangeAtBatEvent {
  type: 'lineup'
  playerId: number
  teamId: number
  order?: number
  position: Position
  description?: GameraToken[]
}

type AtBatEvent = PitchAtBatEvent | StealAtBatEvent | LineupChangeAtBatEvent

export const isPitch = (event: AtBatEvent): event is PitchAtBatEvent =>
  event.type === 'pitch'
export const isSteal = (event: AtBatEvent): event is StealAtBatEvent =>
  event.type === 'steal'
export const isLineupChange = (
  event: AtBatEvent,
): event is LineupChangeAtBatEvent => event.type === 'lineup'

export interface InningAtBatEvent {
  pitcher: { playerId: number; handedness: 'right' | 'left' }
  batter: { playerId: number; handedness: 'right' | 'left' }
  events: AtBatEvent[]
  pitches?: PitchAtBatEvent[] // for scoring plays
  description?: GameraToken[]
  type: 'atBat'
}

interface InningLineupChangeEvent {
  playerId: number
  teamId: number
  order?: number
  position: Position
  description?: GameraToken[]
  type: 'lineup'
}

interface InningDesignatedRunnerEvent {
  playerId: number
  description?: GameraToken[]
  type: 'designatedRunner'
}

type InningEvent =
  | InningAtBatEvent
  | InningLineupChangeEvent
  | InningDesignatedRunnerEvent

export interface InningHalf {
  half: 'top' | 'bottom'
  events: InningEvent[]
}

export interface InningPlayByPlay {
  number: number
  halves: InningHalf[]
}

export interface MlbPlayByPlayResponse {
  gameId: number
  gameTimestamp: string
  gameStatus: MlbGameStatus
  homeTeam: Pick<GameraTeamReference, 'teamId'>
  awayTeam: Pick<GameraTeamReference, 'teamId'>
  innings: InningPlayByPlay[]
}

export const filterScoringPlays = (innings: InningPlayByPlay[]) => {
  return innings.map((inning) => {
    return {
      ...inning,
      halves: inning.halves.map((halfInning) => {
        return {
          ...halfInning,
          events: halfInning.events
            .filter((event) => event.type === 'atBat')
            .flatMap((event) => {
              const stealOrPitchEvents = event.events.filter(
                (e) =>
                  (e.type === 'steal' || e.type === 'pitch') &&
                  some(e.runners, (r) => r.endingBase === 4),
              )

              const lastPitch = last(stealOrPitchEvents)

              if (stealOrPitchEvents.length > 0) {
                return [
                  {
                    ...event,
                    events: stealOrPitchEvents,
                    pitches: event.events.filter((e) => e.type === 'pitch'),
                    description:
                      lastPitch?.type === 'pitch' && lastPitch.flags.isAtBatOver
                        ? event.description
                        : undefined,
                  },
                ]
              } else {
                return []
              }
            }),
        }
      }),
    }
  })
}

export const getCurrentInningNumber = (innings: InningPlayByPlay[]) => {
  return innings.length
}

export const getCurrentHalfInning = (innings: InningPlayByPlay[]) =>
  findLast(
    innings.flatMap((x) => x.halves),
    (x) => x.events.length > 0,
  )

export const getCurrentOuts = (innings: InningPlayByPlay[]) => {
  const inning = getCurrentHalfInning(innings)
  if (!inning) return 0
  const lastAtBat = findLast(
    inning.events,
    (e) => e.type === 'atBat' && e.events.length > 0,
  ) as InningAtBatEvent | undefined
  const lastPitch = last(
    lastAtBat?.events.filter((e) => e.type === 'pitch' || e.type === 'steal'),
  )
  return lastPitch?.count.outs ?? 0
}

export const getCurrentRunners = (innings: InningPlayByPlay[]) => {
  const inning = getCurrentHalfInning(innings)
  if (!inning) return []
  const lastAtBat = findLast(
    inning.events,
    (e) => e.type === 'atBat' && e.events.length > 0,
  ) as InningAtBatEvent | undefined
  const lastPitch = last(
    lastAtBat?.events.filter((e) => e.type === 'pitch' || e.type === 'steal'),
  )
  return lastPitch?.runners ?? []
}

export const getCurrentAtBat = (innings: InningPlayByPlay[]) => {
  const inning = getCurrentHalfInning(innings)
  if (!inning) return undefined
  return findLast(inning.events, (e) => e.type === 'atBat')
}

export const getCurrentAtBatCount = (innings: InningPlayByPlay[]) => {
  const atBat = getCurrentAtBat(innings)
  if (!atBat) return { balls: 0, strikes: 0 }
  const lastPitch = last(
    atBat.events.filter((e) => e.type === 'pitch' || e.type === 'steal'),
  )
  return lastPitch?.count ?? { balls: 0, strikes: 0 }
}

export const formatPlayOutcome = (pitch: PitchAtBatEvent) => {
  switch (pitch.outcomeType) {
    case 'ball':
    case 'dirtBall':
    case 'enforcedBall':
    case 'intentionalBall':
    case 'intentionalWalk':
      return 'Walk'
    case 'foul':
    case 'enforcedStrike':
    case 'strikeLooking':
    case 'strikeSwinging':
      return pitch.flags.isDoublePlay ? 'Strikeout Double Play' : 'Strikeout'
    case 'single':
      return 'Single'
    case 'double':
      return 'Double'
    case 'triple':
      return 'Triple'
    case 'homeRun':
      return 'Home Run'
    case 'sacrificeBunt':
      return 'Sacrifice Bunt'
    case 'sacrificeFly':
      return 'Sacrifice Fly'
    case 'groundOut':
      return pitch.flags.isDoublePlay
        ? 'Grounded Into DP'
        : pitch.flags.isTriplePlay
        ? 'Grounded Into TP'
        : 'Groundout'
    case 'lineOut':
    case 'flyOut':
      return pitch.flags.isDoublePlay
        ? 'Double Play'
        : pitch.flags.isTriplePlay
        ? 'Triple Play'
        : pitch.outcomeType.slice(0, 1).toUpperCase() +
          pitch.outcomeType.slice(1).toLowerCase()
    case 'popOut':
      return pitch.flags.isDoublePlay
        ? 'Double Play'
        : pitch.flags.isTriplePlay
        ? 'Triple Play'
        : 'Pop Out'
    case 'fieldersChoice':
      return 'Forceout'
    case 'hitByPitch':
      return 'Hit By Pitch'
    case 'reachedOnError':
      return 'Field Error'
    default:
      return pitch.outcomeType
  }
}

export const colorPlayOutcome = (pitch: PitchAtBatEvent) => {
  switch (pitch.outcomeType) {
    case 'ball':
    case 'dirtBall':
    case 'enforcedBall':
    case 'intentionalBall':
    case 'intentionalWalk':
    case 'pitchout':
      return 'fill-green bg-green'
    case 'foul':
    case 'enforcedStrike':
    case 'strikeLooking':
    case 'strikeSwinging':
      return 'fill-red bg-red'
    default:
      return 'fill-blue bg-blue'
  }
}

export const formatPitchType = (pitch: PitchAtBatEvent) => {
  switch (pitch.pitchData?.pitchType) {
    case 'intentionalBall':
      return 'Intentional Ball'
    default:
      return pitch.pitchData?.pitchType ?? ''
  }
}

export const formatPitchOutcome = (pitch: PitchAtBatEvent) => {
  switch (pitch.outcomeType) {
    case 'catcherInterference':
      return 'Catcher Interference'
    case 'dirtBall':
      return 'Ball'
    case 'enforcedBall':
      return 'Enforced Ball'
    case 'enforcedStrike':
      return 'Enforced Strike'
    case 'pitchout':
      return 'Pitch Out'
    case 'fieldersChoice':
      return 'Forceout'
    case 'foul':
      return pitch.count.strikes === 3 ? 'Foul Tip' : 'Foul'
    case 'flyOut':
      return 'Flyout'
    case 'popOut':
      return 'Pop Out'
    case 'lineOut':
      return 'Lineout'
    case 'groundOut':
      return 'Groundout'
    case 'hitByPitch':
      return 'Hit By Pitch'
    case 'hitterInterference':
      return 'Hitter Interence'
    case 'homeRun':
      return 'Home Run'
    case 'intentionalBall':
      return 'Intentional Ball'
    case 'intentionalWalk':
      return 'Intentional Walk'
    case 'outOfBattersBox':
      return 'Out of Batters Box'
    case 'outOnAppeal':
      return 'Out On Appeal'
    case 'reachedOnError':
      return 'Reached On Error'
    case 'rulingPending':
      return 'In Play'
    case 'sacrificeBunt':
      return 'Sacrifice Bunt'
    case 'sacrificeFly':
      return 'Sacrifice Fly'
    case 'strikeLooking':
      return 'Strike Looking'
    case 'strikeSwinging':
      return 'Strike Swinging'
    default:
      return pitch.outcomeType ?? ''
  }
}

export interface MlbBoxGameState {
  lastInning?: InningPlayByPlay
  players?: GameraPlayerReference[]
  gameScore: {
    away: number
    home: number
  }
  lineup: {
    away?: PlayerGameModel[]
    home?: PlayerGameModel[]
  }
  stats: {
    away: MlbTeamGameModel<MlbStatKey>['stats']
    home: MlbTeamGameModel<MlbStatKey>['stats']
  }
  lineScore: {
    away: MlbTeamGameModel<MlbStatKey>['lineScore']
    home: MlbTeamGameModel<MlbStatKey>['lineScore']
  }
}

export interface MlbGameScore {
  gameId: number
  domain: 'MLB'
  score: {
    away: number
    home: number
  }
  inningNumber: number
  inningHalf: 'top' | 'bottom'
  outs: number
  runners: Runner[]
}

export const mlbBoxGameState = (data: {
  gameData: MlbGameDataResponse<MlbStatKey>
  playByPlay: MlbPlayByPlayResponse
}): MlbBoxGameState => {
  const { gameData, playByPlay } = data
  return {
    lastInning: last(playByPlay.innings),
    players: gameData.players,
    gameScore: {
      away: gameData.awayTeam.score,
      home: gameData.homeTeam.score,
    },
    lineup: {
      away: gameData.awayTeam.players,
      home: gameData.homeTeam.players,
    },
    stats: {
      away: gameData.awayTeam.stats,
      home: gameData.homeTeam.stats,
    },
    lineScore: {
      away: gameData.awayTeam.lineScore,
      home: gameData.homeTeam.lineScore,
    },
  }
}

export const mlbGameScore = (data: {
  gameData?: MlbGameDataResponse<MlbStatKey>
  playByPlay?: MlbPlayByPlayResponse
}): MlbGameScore => {
  const { gameData, playByPlay } = data

  return {
    gameId: gameData?.gameId ?? 0,
    domain: 'MLB',
    score: {
      away: gameData?.awayTeam.score ?? 0,
      home: gameData?.homeTeam.score ?? 0,
    },
    inningHalf: getCurrentHalfInning(playByPlay?.innings ?? [])?.half ?? 'top',
    inningNumber: getCurrentInningNumber(playByPlay?.innings ?? []),
    outs: getCurrentOuts(playByPlay?.innings ?? []),
    runners: getCurrentRunners(playByPlay?.innings ?? []),
  }
}

export type NflGameStatus =
  | 'scheduled'
  | 'inProgress'
  | 'halftime'
  | 'completed'
  | 'postponed'
  | 'delayed'
  | 'canceled'

export type NflPassingStatKey =
  | 'Passing-Attempts'
  | 'Passing-Completions'
  | 'Passing-Yards'
  | 'Passing-YardsPerAttempt'
  | 'Passing-Touchdowns'
  | 'Passing-Interceptions'
  | 'Passing-Sacks'
  | 'Passing-SackYards'
  | 'Passing-Rating'

export type NflRushingStatKey =
  | 'Rushing-Attempts'
  | 'Rushing-Yards'
  | 'Rushing-YardsPerAttempt'
  | 'Rushing-Touchdowns'
  | 'Rushing-LongestRush'

export type NflReceivingStatKey =
  | 'Receiving-Targets'
  | 'Receiving-Receptions'
  | 'Receiving-Yards'
  | 'Receiving-YardsPerReception'
  | 'Receiving-Touchdowns'
  | 'Receiving-LongestReception'

export type NflFumblesStatKey = 'Fumbles' | 'FumblesLost' | 'FumbleRecoveries'

export type NflDefenseStatKey =
  | 'Defensive-Sacks'
  | 'Defensive-CombinedTackles'
  | 'Defensive-Tackles'
  | 'Defensive-TacklesForLoss'
  | 'Defensive-Interceptions'
  | 'Defensive-ForcedFumbles'
  | 'Defensive-Touchdowns'

export type NflKickingStatKey =
  | 'Kicking-FieldGoalsAttempted'
  | 'Kicking-FieldGoalsMade'
  | 'Kicking-FieldGoalPercentage'
  | 'Kicking-ExtraPointsAttempted'
  | 'Kicking-ExtraPointsMade'
  | 'Kicking-ExtraPointPercentage'
  | 'Kicking-KickingPoints'
  | 'Kicking-LongestFieldGoal'

export type NflPuntingStatKey =
  | 'Punting-Punts'
  | 'Punting-Yards'
  | 'Punting-YardsAverage'
  | 'Punting-LongestPunt'

export type NflKickoffStatKey =
  | 'Kickoff-Returns'
  | 'Kickoff-ReturnYards'
  | 'Kickoff-ReturnYardsAverage'
  | 'Kickoff-LongestReturns'
  | 'Kickoff-ReturnTouchdowns'

export type NflPuntReturnStatKey =
  | 'PuntReturn-PuntReturns'
  | 'PuntReturn-Yards'
  | 'PuntReturn-YardsPerPuntReturn'
  | 'PuntReturn-LongestReturn'
  | 'PuntReturn-Touchdowns'

export type NflStatKey =
  | NflPassingStatKey
  | NflRushingStatKey
  | NflReceivingStatKey
  | NflFumblesStatKey
  | NflDefenseStatKey
  | NflKickingStatKey
  | NflPuntingStatKey
  | NflKickoffStatKey
  | NflPuntReturnStatKey

export type NflStatKeySet = {
  passingTotals: NflPassingStatKey
  rushingTotals: NflRushingStatKey
  receivingTotals: NflReceivingStatKey
  defenseTotals: NflDefenseStatKey
  kickoffReturnTotals: NflKickoffStatKey
  puntReturnTotals: NflPuntReturnStatKey
  kickingTotals: NflKickingStatKey
  puntingTotals: NflPuntingStatKey
  fumbleTotals: NflFumblesStatKey
}

export type NflStatModel<Key extends NflStatKey> = {
  [K in Key]+?: Value<number>
}

interface NflSeason extends Season {
  week: number
}

interface NflOfficial {
  assignment:
    | 'referee'
    | 'lineJudge'
    | 'fieldJudge'
    | 'backJudge'
    | 'sideJudge'
    | 'umpire'
    | 'replayOfficial'
    | 'downJudge'
  fullName?: string
  number?: number
}

export interface NflTeamGameModel<K extends NflStatKey> {
  teamId: number
  score: number
  usedTimeouts: number
  record: {
    wins: number
    losses: number
    ties: number
  }
  gameResult: 'win' | 'loss' | 'tie'
  stats: {
    team: {
      statsLookupKey: string
      statsLookup: Record<string, StatModel<K>>
    }
    player: {
      splits: {
        groupIndex: number
        splitType: string
        statsLookupKey: string
      }[]
      statsLookupKey: string
      StatsLookup: Record<string, StatModel<K>>
    }
  }
  lineScore: {
    periods?: {
      period: number
      points: number
    }[]
  }
}

export interface NflGameDataResponse<K extends NflStatKey> {
  gameId: number
  gameStatus: NflGameStatus
  seasonYearDisplay?: string
  season: NflSeason
  gameDate: string
  gameTimestamp: string
  networkName: string
  homeTeam: NflTeamGameModel<K>
  awayTeam: NflTeamGameModel<K>
  weather?: {
    condition: string
    temperatureFahrenheit: number
    humidityPercentage: number
    wind: {
      speedMph: number
      direction?: string
    }
  }
  venue: {
    name?: string
    location?: string
    roofType: 'open' | 'close'
    surface: 'turf' | 'grass'
  }
  officials?: NflOfficial[]
  teams?: GameraTeamReference[]
  players?: GameraPlayerReference[]
  odds?: BettingOdds
  summary?: GameraToken[]
}

type NflDriveEndReason =
  | 'unknown'
  | 'touchdown'
  | 'safety'
  | 'fieldGoal'
  | 'missedFieldGoal'
  | 'muffedFieldGoal'
  | 'blockedFieldGoal'
  | 'blockedFieldGoalDowns'
  | 'blockedFieldGoalSafety'
  | 'punt'
  | 'blockedPunt'
  | 'blockedPuntDowns'
  | 'blockedPuntSafety'
  | 'downs'
  | 'interception'
  | 'fumble'
  | 'fumbleSafety'
  | 'endOfHalf'
  | 'endOfGame'

export interface NflDrive {
  driveSequnce: number
  duration: string
  flags: {
    isScoringDrive: boolean
  }
  gainYards: number
  endReason?: NflDriveEndReason
}

interface PlaySituation {
  clock: string
  down?: number
  yardsToFirst?: number
  possessionTeamId: number
  location: {
    teamId: number
    yardLine: number
  }
}

interface NflNonPlayEvent {
  type: 'nonPlay'
  nonPlayType:
    | 'timeout'
    | 'tvTimeout'
    | 'periodEnd'
    | 'twoMinuteWarning'
    | 'gameOver'
    | 'comment'
  eventSequence: number
  period: number
  driveSequence?: number
  clock: string
  description?: GameraToken[]
}

interface NflPlayEvent {
  type: 'play'
  playType:
    | 'conversion'
    | 'extraPoint'
    | 'fieldGoal'
    | 'kickoff'
    | 'pass'
    | 'penalty'
    | 'punt'
    | 'rush'
    | 'freeKick'
    | 'play'
    | 'fairCatchKick'
  eventSequence: number
  period: number
  driveSequence: number
  startSituation: PlaySituation
  endSituatiion: PlaySituation
  homePoints: number
  awayPoints: number
  flags: {
    isScoringPlay: boolean
  }
  description?: GameraToken[]
}

export type NflEvent = NflNonPlayEvent | NflPlayEvent

export interface NflPlayByPlayResponse {
  gameId: number
  gameDate: string
  gameTimestamp?: string
  gameStatus: NflGameStatus
  homeTeam: Pick<GameraTeamReference, 'teamId'>
  awayTeam: Pick<GameraTeamReference, 'teamId'>
  drives?: NflDrive[]
  events?: NflEvent[]
  scoringEvents?: never
}

export type StatKeySetByDomain = {
  NFL: NflStatKeySet
  MLB: MlbStatKeySet
}

export type StatKeyByDomain = {
  NFL: NflStatKey
  MLB: MlbStatKey
}

export type GameDataResponseByDomain<K extends NflStatKey | MlbStatKey> = {
  NFL: NflGameDataResponse<Extract<K, NflStatKey>>
  MLB: MlbGameDataResponse<Extract<K, MlbStatKey>>
}

export type PlayByPlayResponseByDomain = {
  NFL: NflPlayByPlayResponse
  MLB: MlbPlayByPlayResponse
}
