import type {
  GameraPlayerReference,
  GameraTeamReference,
  GameraToken,
  Value,
  Season,
  GameStatus,
  Game,
  BettingOdds,
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

export type MlbStatKey =
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
  | 'Fielding-Errors'

export type MlbStatKeySet = {
  pitchingStandard: Extract<
    MlbStatKey,
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
  >
  battingStandard: Extract<
    MlbStatKey,
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
  >
}

export type MlbStatModel<StatKey extends MlbStatKey> = {
  [K in StatKey]+?: Value<number>
}

export const getDisplay = <K extends MlbStatKey>(
  statModel: MlbStatModel<K>,
  key: K,
) => {
  if (!statModel[key]) return ''
  return statModel[key].display
}

export const getValue = <K extends MlbStatKey>(
  statModel: MlbStatModel<K>,
  key: K,
) => {
  if (!statModel[key]) return 0
  return statModel[key].value
}

export interface TeamGameModel<Keys extends MlbStatKey> {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: 'win' | 'loss' | 'noDecision' | 'suspended'
  stats?: {
    stats?: MlbStatModel<Keys>
    splits?: {
      splitType?: string
      playerId: number
      stats?: MlbStatModel<Keys>
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

interface Official {
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

export interface MlbGameDataResponse<Keys extends MlbStatKey> {
  gameId: number
  gameStatus: GameStatus
  seasonYearDisplay?: string
  season: Season
  gameDate: string
  gameTimestamp: string
  networkName: string
  homeTeam: TeamGameModel<Keys>
  awayTeam: TeamGameModel<Keys>
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
  officials?: Official[]
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
  gameStatus: GameStatus
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
    away: TeamGameModel<MlbStatKey>['stats']
    home: TeamGameModel<MlbStatKey>['stats']
  }
  lineScore: {
    away: TeamGameModel<MlbStatKey>['lineScore']
    home: TeamGameModel<MlbStatKey>['lineScore']
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
