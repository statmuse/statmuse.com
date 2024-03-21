import { type AnalyticsSnippet } from '@segment/analytics-next'
import type {
  ContentReference as GameraContentReference,
  Disposition,
  Subject as GameraSubject,
  TokenizationScore,
} from '@statmuse/core/gamera'
import type {
  ContentReference as KanedamaContentReference,
  Subject as KanedamaSubject,
} from '@statmuse/core/kanedama'
import { isBotTest } from '@lib/useragent'

export type AnalyticsPageviewProperties = {
  is_error?: boolean
  is_search?: boolean
  method?: 'GET' | 'POST'
  origin?: 'web'
  origin_scope?: 'browser'
  page_domain?:
    | 'nba'
    | 'nfl'
    | 'nhl'
    | 'mlb'
    | 'pga'
    | 'finance'
    | 'epl'
    | 'sports'
    | 'unknown'
  page_type?:
    | 'ask'
    | 'asset'
    | 'game'
    | 'home'
    | 'musing'
    | 'player'
    | 'question'
    | 'trending'
    | 'team'
    | 'unknown'
  query?: string
  user_id?: string
  visitor_id?: string
  disposition?: Disposition
  tokenizationScore?: TokenizationScore
  contentReference?: GameraContentReference | KanedamaContentReference
  subject?: GameraSubject | KanedamaSubject
}

declare global {
  interface Window {
    analytics: AnalyticsSnippet
    tude: {
      cmd: any[]
      destroyAds: (...args: any[]) => void
      refreshAdsViaDivMappings: (...args: any[]) => void
      setPageTargeting: (...args: any[]) => void
    }
  }
}

export const getOrigin = (userAgent: string) => {
  const isBot = isBotTest(userAgent)
  if (isBot && userAgent.includes('Google')) return 'web.googlebot'
  if (isBot) return 'web.bot'
  return 'web'
}
