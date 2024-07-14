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
  id: string
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
  colors: Colors
  entity: GameraEntity
}
