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

type Position =
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

interface PlayerGameModel {
  playerId: number
  lineup: {
    posistions?: Position[]
    battingOrder: number
    battingOrderSequence: number
    pitchingSequence: number
  }
}

interface StatModel {
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

interface TeamGameModel {
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
  moneyline: Value<number>
}

interface SportsbookLine {
  id: 'consensus' | 'draftKings' | 'fanDuel' | 'mgm' | 'williamHill'
  homeTeam: TeamLine
  awayTeam: TeamLine
  overUnder: Value<number>
}

interface BettingOdds {
  sportsbook?: SportsbookLine[]
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
