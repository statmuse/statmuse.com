import type { GameraTeamReference, ScheduledGame } from './base'

export interface GameraScheduleResponse {
  seasonYearDisply: string
  teams: GameraTeamReference[]
  games: ScheduledGame[]
}
