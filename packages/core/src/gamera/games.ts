import type {
  GameraPlayerReference,
  GameraTeamReference,
  GameraToken,
  Value,
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

export interface GameResultTeam {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: string
}

export interface GameResult {
  id: number
  season: {
    type: string
  }
  gameDate: string
  homeTeam: GameResultTeam
  awayTeam: GameResultTeam
}

export interface GameResultsResponse {
  seasonYearDisplay: string
  teams: GameraTeamReference[]
  games: GameResult[]
}

type GameStatus =
  | 'scheduled'
  | 'postponed'
  | 'delayed'
  | 'inProgress'
  | 'suspended'
  | 'completed'
  | 'canceled'

type SeasonPhase = {
  type: 'regularSeason' | 'postseason'
  year: number
  yearDisplay?: string
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
  position: Position | Position[],
  handedness?: 'left' | 'right',
) => {
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

export interface StatModel {
  'Pitching-EarnedRunAverage'?: Value<number>
  'Pitching-EarnedRuns'?: Value<number>
  'Pitching-GamesPitched'?: Value<number>
  'Pitching-HitBatsmen'?: Value<number>
  'Pitching-Hits'?: Value<number>
  'Pitching-HomeRuns'?: Value<number>
  'Pitching-InningsPitched'?: Value<number>
  'Pitching-Runs'?: Value<number>
  'Pitching-Strikeouts'?: Value<number>
  'Pitching-Walks'?: Value<number>
  'Batting-AtBats'?: Value<number>
  'Batting-BattingAverage'?: Value<number>
  'Batting-CaughtStealing'?: Value<number>
  'Batting-Doubles'?: Value<number>
  'Batting-HitByPitches'?: Value<number>
  'Batting-Hits'?: Value<number>
  'Batting-HomeRuns'?: Value<number>
  'Batting-OnBasePercentage'?: Value<number>
  'Batting-Runs'?: Value<number>
  'Batting-RunsBattedIn'?: Value<number>
  'Batting-SluggingPercentage'?: Value<number>
  'Batting-StolenBases'?: Value<number>
  'Batting-Strikeouts'?: Value<number>
  'Batting-Triples'?: Value<number>
  'Batting-Walks'?: Value<number>
}

export interface TeamGameModel {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: 'win' | 'loss' | 'noDecision' | 'suspended'
  stats?: {
    stats?: StatModel
    splits?: {
      splitType?: string
      playerId: number
      stats?: StatModel
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

type TeamLine = {
  spread: Value<number>
  spreadOdds: Value<number>
  moneyline: Value<number>
  moneylineOpen: Value<number>
}

interface SportsbookLine {
  id: 'consensus' | 'draftKings' | 'fanDuel' | 'mgm' | 'williamHill'
  homeTeam: TeamLine
  awayTeam: TeamLine
  overUnder: Value<number>
  overUnderOddsOver: Value<number>
  overUnderOddsUnder: Value<number>
  overUnderOpen: Value<number>
}

export interface BettingOdds {
  sportsbooks?: SportsbookLine[]
}

export interface MlbGameDataResponse {
  gameId: number
  gameStatus: GameStatus
  seasonYearDisplay?: string
  season: SeasonPhase
  gameDate: string
  gameTimestamp: string
  networkName: string
  homeTeam: TeamGameModel
  awayTeam: TeamGameModel
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
  outcomeType:
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
      return 'Strikout'
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
      return 'Ground Out'
    case 'lineOut':
      return 'Line Out'
    case 'flyOut':
      return 'Fly Out'
    case 'popOut':
      return 'Pop Out'
    case 'fieldersChoice':
      return 'Forceout'
    case 'hitByPitch':
      return 'Hit By Pitch'
    case 'reachedOnError':
      return 'Reached On Error'
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
      return 'Dirt Ball'
    case 'enforcedBall':
      return 'Enforced Ball'
    case 'enforcedStrike':
      return 'Enforced Strike'
    case 'fieldersChoice':
      return 'Fielders Choice'
    case 'flyOut':
      return 'Fly Out'
    case 'groundOut':
      return 'Ground Out'
    case 'hitByPitch':
      return 'Hit By Putch'
    case 'hitterInterference':
      return 'Hitter Interence'
    case 'homeRun':
      return 'Home Run'
    case 'intentionalBall':
      return 'Intentional Ball'
    case 'intentionalWalk':
      return 'Intentional Walk'
    case 'lineOut':
      return 'Line Out'
    case 'outOfBattersBox':
      return 'Out of Batters Box'
    case 'outOnAppeal':
      return 'Out On Appeal'
    case 'popOut':
      return 'Pop Out'
    case 'reachedOnError':
      return 'Reached On Error'
    case 'rulingPending':
      return 'Ruling Pending'
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

export interface InningAtBatEvent {
  pitcher: { playerId: number; handedness: 'right' | 'left' }
  batter: { playerId: number; handedness: 'right' | 'left' }
  events: AtBatEvent[]
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
              const stealEvents = event.events.filter((e) => e.type === 'steal')
              const scoringStealEvents = stealEvents.filter((e) =>
                some(e.runners, (r) => r.endingBase === 4),
              )

              const pitchEvents = event.events.filter((e) => e.type === 'pitch')
              const isScorintAtBat = some(pitchEvents, (e) =>
                some(e.runners, (r) => r.endingBase === 4),
              )

              if (isScorintAtBat) {
                return [...scoringStealEvents, event]
              }
              return [...scoringStealEvents]
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
