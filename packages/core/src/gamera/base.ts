export interface Colors {
  backgroundColor: string
  foregroundColor: string
}

export type GameraDomain = 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'PGA' | 'EPL'

export type GameraToken = {
  text: string
  omitLeadingSpace: boolean
} & (
  | {
      type: 'general'
    }
  | {
      type: 'inferred'
    }
  | {
      type: 'entity'
      entity: GameraEntity
    }
)

export type GameraEntity = {
  display: string
  shortDisplay?: string
  domain: GameraDomain
  type: 'player' | 'teamFranchise' | 'teamSeason' | 'game' | 'player-ask'
  id?: string
  parameters?: Record<string, string>
  baseResourcePath?: string
}

export interface Value<T> {
  display: string
  value: T
}

export interface GameraGridColumn {
  rowItemKey: string
  title: string
  type: string
  tags?: {
    isReferencedInQuestion?: boolean
  }
}

export interface GameraGridCellValue<T> extends Value<T> {
  imageUrl?: string
  entity?: GameraEntity
  meta?: {
    id?: number
    shortDisplay?: string
    position?: string
    injured?: boolean
    padding?: boolean
  }
}

export interface GameraGrid {
  name?: string
  columns: GameraGridColumn[]
  rows: Record<string, GameraGridCellValue<unknown>>[]
  aggregations?: Record<string, GameraGridCellValue<unknown>>[]
}

export interface GameraParameter {
  values: {
    id: string
    display: string
  }[]
  selectedValueId: string
  order: number
}

export interface AdditionalQuestion {
  domain: string
  text: string
}

export interface GameraGalleryImage {
  url: string
  colors: Colors
  entity?: GameraEntity
}

export interface GameraPlayerReference {
  id: number
  usedName?: string
  firstName?: string
  lastName?: string
  entity: GameraEntity
  imageUrl: string
  colors: Colors
}

export interface GameraTeamReference {
  teamId: number
  seasonYear: number
  name: string
  nickname: string
  abbreviation: string
  logoImageUrl: string
  colors?: Colors
  entity: GameraEntity
}

type TeamLine = {
  spread: Value<number>
  spreadOdds: Value<number>
  moneyline: Value<number>
  moneylineOpen: Value<number>
}

interface SportsbookLine {
  id: 'consensus' | 'draftKings' | 'fanDuel' | 'mgm' | 'williamHill'
  homeTeam: TeamLine
  awayTeam: TeamLine
  overUnder: Value<number>
  overUnderOddsOver: Value<number>
  overUnderOddsUnder: Value<number>
  overUnderOpen: Value<number>
}

export interface BettingOdds {
  sportsbooks?: SportsbookLine[]
}

export interface GameTeam {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: string
}

export interface ScheduledGame {
  id: number
  gameId: number
  type: 'scheduled'
  season: Season
  gameTimestamp: string
  gameDate: string
  homeTeamId: number
  awayTeamId: number
  odds?: BettingOdds
}

export interface InProgressGame
  extends Omit<CompletedGame, 'type' | 'homeTeam' | 'awayTeam'> {
  type: 'inProgress'
  summary?: GameraToken[]
  homeTeam: Omit<GameTeam, 'record' | 'gameResult'>
  awayTeam: Omit<GameTeam, 'record' | 'gameResult'>
}

export interface CompletedGame {
  id: number
  gameId: number
  type: 'completed'
  season: Season
  gameDate: string
  homeTeam: GameTeam
  awayTeam: GameTeam
}

export type Game = ScheduledGame | InProgressGame | CompletedGame

export const isScheduledGame = (game: Game): game is ScheduledGame =>
  game.type === 'scheduled'

export const isInProgressGame = (game: Game): game is InProgressGame =>
  game.type === 'inProgress'

export const isCompletedGame = (game: Game): game is CompletedGame =>
  game.type === 'completed'

export type GameStatus =
  | 'scheduled'
  | 'postponed'
  | 'delayed'
  | 'inProgress'
  | 'suspended'
  | 'completed'
  | 'canceled'

export type SeasonType = 'regularSeason' | 'postseason'

export type Season = {
  type: SeasonType
  year: number
  yearDisplay?: string
}
