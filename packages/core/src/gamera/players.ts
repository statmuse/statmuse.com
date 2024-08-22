import type {
  AdditionalQuestion,
  GameraDomain,
  GameraToken,
  GameraGrid,
  GameraParameter,
  GameraGalleryImage,
  GameraTeamReference,
  GameraPlayerReference,
  GameraGridColumn,
} from './base'
import type { MlbStatKey, MlbStatModel } from './games'

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
  throwsHandedness?: 'right' | 'left'
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

export type MlbSplitType = 'player'

interface SplitItem<S> {
  playerId: number
  splitType: S
  statsLookupKey: string
}

interface SplitGroup<S> {
  groupIndex: number
  splitType: 'group'
  statsLookupKey: string
  splits: SplitItem<S>[]
}

export interface MlbPlayerStatsResponse<
  K extends MlbStatKey,
  S extends MlbSplitType,
> {
  stats?: {
    splits: SplitGroup<S>[]
    statsLookupKey: string
    statsLookup: Record<string, MlbStatModel<K>>
  }
  players?: GameraPlayerReference[]
}

export const mapStatsResponseToGrid = <K extends MlbStatKey>(
  columns: (GameraGridColumn & { statKey: K })[],
  data: {
    player?: GameraPlayerReference
    stats?: MlbStatModel<K>
    position?: string
  }[],
): GameraGrid => {
  const [, ...restColumns] = columns

  const rows = data.map((d) => {
    return restColumns.reduce(
      (acc, col) => ({
        ...acc,
        [col.rowItemKey]: d.stats?.[col.statKey] ?? { display: '-', value: 0 },
      }),
      {
        PLAYER: {
          display: d.player?.usedName ?? '',
          value: `${d.player?.lastName}, ${d.player?.firstName}`,
          entity: d.player?.entity,
          imageUrl: d.player?.imageUrl,
          position: d.position,
        },
      },
    )
  })

  return {
    columns,
    rows,
  }
}
