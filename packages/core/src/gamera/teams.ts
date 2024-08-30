import type {
  AdditionalQuestion,
  GameraGalleryImage,
  GameraDomain,
  GameraEntity,
  GameraGrid,
  GameraParameter,
  GameraToken,
  Colors,
} from './base'

export interface GameraTeamLeader {
  galleryImage: GameraGalleryImage
  stat: {
    label: string
    value: string
  }
  name: string
}

export interface GameraTeamSeasonBio {
  additionalQuestions?: AdditionalQuestion[]
  domain: GameraDomain
  teamId: number
  yearId: number
  name: string
  nameDetail: {
    abbreviation: string
    market: string
    nickname: string
  }
  season: {
    name: string
    all: {
      name: string
      entity: GameraEntity
    }[]
  }
  logoImageUrl: string
  colors?: Colors
  teamRepresentatives: GameraGalleryImage[]
  statsSummary?: {
    statsScope: string
    stats: {
      label: string
      value: string
      rank: string
    }[]
  }
  standing: {
    record: string
    points?: string
    leagueRank: string
    conferenceRank: string
    divisionRank: string
    championship: string
  }
  franchise: GameraEntity
  hasStats: boolean
  hasRoster: boolean
  summaryNlg?: GameraToken[]
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
}

export interface GameraTeamSeasonOverview {
  domain: GameraDomain
  teamId: number
  yearId: number
  bio: GameraTeamSeasonBio
  scoresAndSchedule: GameraGrid
  teamLeaders: GameraTeamLeader[]
  standings?: GameraGrid
  stats: GameraGrid | GameraGrid[]
  playerGallery: GameraGalleryImage[]
}

export interface GameraTeamSeasonStats {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
  gridGroups: GameraGrid[]
}

export interface GameraTeamSeasonPlayerStats {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
  gridGroups: GameraGrid[]
}

export interface GameraTeamSeasonGameResults {
  grids: GameraGrid[]
}

export interface GameraTeamSeasonSchedule {
  grid: GameraGrid
}

export interface GameraTeamSeasonRoster {
  grid: GameraGrid
}

export interface GameraTeamSeasonSplits {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraTeamFranchiseOverview {
  domain: GameraDomain
  teamId: number
  bio: {
    additionalQuestions?: AdditionalQuestion[]
    domain: GameraDomain
    teamId: number
    name: string
    nameDetail: {
      abbreviation: string
      market: string
      nickname: string
    }
    logoImageUrl: string
    colors?: Colors
    division: string
    conference: string
    league: string
    franchiseRepresentatives: GameraGalleryImage[]
    recordSummaries?: {
      recordScope: string
      winPercentage: string
      record: string
    }[]
    premierLeagueRecord?: string
    premierLeagueTitles?: string
  }
  seasons: {
    name: string
    entity: GameraEntity
  }[]
  teamHistory: GameraGrid
  franchiseInfo: GameraGrid
  franchiseLeaders: GameraTeamLeader[]
  playerGallery: GameraGalleryImage[]
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
}
