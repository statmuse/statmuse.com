import type { GameraPlayerReference, GameraTeamReference } from './base'

export interface PlayerInfo extends GameraPlayerReference {
  stat?: string
  statDisplayValue: string
}

export interface PlayerCard {
  stat: string
  type: string
  players: PlayerInfo[]
}

export interface PlayerCardResponse {
  seasonYearDisplay: string
  seasonType: string
  cards: PlayerCard[]
  team?: GameraTeamReference
}

export interface TeamInfo extends GameraTeamReference {
  statDisplayValue: string
}

export interface TeamCard {
  stat: string
  type: string
  teams: TeamInfo[]
}

export interface TeamCardResponse {
  seasonYearDisplay: string
  seasonType: string
  cards: TeamCard[]
}
