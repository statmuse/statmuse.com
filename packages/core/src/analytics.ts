import type { Disposition, TokenizationScore } from './gamera'

export type AnalyticsPageviewProperties = {
  is_error?: boolean
  is_search?: boolean
  method?: 'GET' | 'POST'
  origin?: 'web'
  origin_scope?: 'browser'
  page_domain?: 'nba' | 'nfl' | 'nhl' | 'mlb' | 'pga' | 'finance' | 'unknown'
  page_type?:
    | 'ask'
    | 'asset'
    | 'game'
    | 'musing'
    | 'player'
    | 'question'
    | 'team'
    | 'unknown'
  query?: string
  user_id?: string
  visitor_id?: string
  disposition?: Disposition
  tokenizationScore?: TokenizationScore
}
