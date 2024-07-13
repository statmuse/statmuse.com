import type { GameraTeamReference } from './base'

export interface ScheduleGame {
  gameId: number
  homeTeamId: number
  awayTeamId: number
  gameTimestamp: string
  networkName: string
  odds?: {
    sportsbooks: {
      id: string
      homeTeam: {
        spread: {
          value: number
          display: string
        }
        moneline: {
          value: number
          display: string
        }
      }
      awayTeam: {
        spread: {
          value: number
          display: string
        }
        moneline: {
          value: number
          display: string
        }
      }
      overUnder: {
        value: number
        display: string
      }
    }[]
  }
}

export interface ScheduleResponse {
  teams: GameraTeamReference[]
  games: ScheduleGame[]
}
