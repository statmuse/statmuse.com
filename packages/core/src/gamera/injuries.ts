import type { GameraTeamReference, GameraPlayerReference } from './base'
import type { Position } from './games'

interface MlbInjury {
  description: string
  injuryStatus:
    | 'day7InjuredList'
    | 'day10InjuredList'
    | 'day15InjuredList'
    | 'day60InjuredList'
    | 'dayToDay'
}

export interface MlbPlayerInjury {
  player: GameraPlayerReference
  injuries: MlbInjury[]
  position: Position
}

interface MlbTeamInjury {
  team: GameraTeamReference
  players: MlbPlayerInjury[]
}

export interface MlbInjuryResponse {
  teams: MlbTeamInjury[]
}

interface NflInjury {
  playerId: number
  teamId: number
  week: number
  season: 'regularSeason' | 'postseason'
  gameStatus?: 'questionable' | 'doubtful' | 'out'
  practiceStatus: 'didNotPractice' | 'limited' | 'full'
  primaryIssue?: string
  secondaryIssue?: string
}

export interface NflInjuryResponse {
  injuries?: NflInjury[]
}

export type InjuriesResponseByDomain = {
  MLB: MlbInjuryResponse
  NFL: NflInjuryResponse
}
