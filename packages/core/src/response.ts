import type { GameraResponse } from './gamera'
import type { KanedamaResponse } from './kanedama'

export type Response = { source: 'gamera' | 'kanedama' } & (
  | ({
      source: 'gamera'
    } & GameraResponse)
  | ({
      source: 'kanedama'
    } & KanedamaResponse)
)
