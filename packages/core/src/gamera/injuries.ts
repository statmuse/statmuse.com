import type { GameraTeamReference, GameraPlayerReference } from './base'

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
}

interface TeamInjury {
  team: GameraTeamReference
  players: PlayerInjury[]
}

export interface TeamInjuryResponse {
  teams: TeamInjury[]
}
