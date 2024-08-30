import type { GameraTeamReference, GameraPlayerReference } from './base'
import type { Position } from './games'

interface Injury {
  description: string
  injuryStatus:
    | 'day7InjuredList'
    | 'day10InjuredList'
    | 'day15InjuredList'
    | 'day60InjuredList'
    | 'dayToDay'
}

interface PlayerInjury {
  player: GameraPlayerReference
  injuries: Injury[]
  position: Position
}

interface TeamInjury {
  team: GameraTeamReference
  players: PlayerInjury[]
}

export interface TeamInjuryResponse {
  teams: TeamInjury[]
}
