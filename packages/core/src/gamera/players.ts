import type {
  AdditionalQuestion,
  GameraDomain,
  GameraToken,
  GameraGrid,
  GameraParameter,
  GameraGalleryImage,
  GameraTeamReference,
} from './base'

export interface GameraPlayerBio {
  domain: GameraDomain
  playerId: number
  usedName: string
  bustImageUrl: string
  bustImageUrlGallery: GameraGalleryImage[]
  team?: GameraTeamReference
  position: string
  jerseyNumber: string
  heightFeetInches: string
  heightCentimeters?: string
  weightLbs: number
  weightKgs: string
  birthdate: string
  birthplace: string
  age: number
  nationality?: string
  college: string
  drafted: string
  experience: string
  preferredFoot?: string
  summaryNlg?: GameraToken[]
  awards: {
    name: string
    years: number[]
  }[]
  additionalQuestions: AdditionalQuestion[]
  statsSummary?: {
    statsScope: string
    stats: {
      label: string
      value: string
    }[]
  }
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
  isActive?: boolean
}

export interface GameraPlayerStats {
  playerId: number
  parameters?: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerGameLog {
  playerId: number
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerSplits {
  playerId: number
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerProfileResponse {
  bio: GameraPlayerBio
  nextGame: {
    date: string
    time: string
    network: string
    homeTeam: GameraTeamReference
    awayTeam: GameraTeamReference
    odds: {
      team: GameraTeamReference
      opponent: GameraTeamReference
      seasonYear: number
      moneyline: number
      opponentMoneyline: number
      spread: number
      spreadOdds: number
      opponentSpreadOdds: number
      overUnder: number
    }
    grid: GameraGrid
  }
  stats: {
    grid: GameraGrid
  }
  recentGames:
    | {
        grid: GameraGrid
      }
    | GameraGrid
  fantasy?: {
    grid: GameraGrid
  }
}
