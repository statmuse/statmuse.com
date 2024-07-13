import type { GameraTeamReference } from './base'
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
