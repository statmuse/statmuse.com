import { AnalyticsBrowser } from '@segment/analytics-next'
import type { Disposition, TokenizationScore } from '@statmuse/core/gamera'
import { isBotTest } from '@lib/useragent'

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

declare global {
  interface Window {
    segment: AnalyticsBrowser
    freestar: {
      queue: any[]
      config: {
        enabled_slots: any[]
      }
      initCallback: () => void
      newAdSlots: () => void
      newStickyFooter: () => void
    }
  }
}

const writeKey = document.querySelector<HTMLMetaElement>(
  'meta[name="analytics"]',
)?.content

export const segment = (window.segment =
  import.meta.env.PROD && writeKey
    ? AnalyticsBrowser.load(
        {
          writeKey,
          cdnURL: import.meta.env.PUBLIC_ANALYTICS_CDN_PROXY_URL,
        },
        {
          integrations: {
            'Segment.io': {
              apiHost:
                new URL(import.meta.env.PUBLIC_ANALYTICS_API_PROXY_URL).host +
                '/v1',
            },
          },
        },
      )
    : (['identify', 'page', 'track'].reduce(
        (stub, key) => ({
          ...stub,
          [key]: (...args: [string]) =>
            console.debug(`analytics.${key}`, ...args),
        }),
        {},
      ) as AnalyticsBrowser))

export const getOrigin = (userAgent: string) => {
  const isBot = isBotTest(userAgent)
  if (isBot && userAgent.includes('Google')) return 'web.googlebot'
  if (isBot) return 'web.bot'
  return 'web'
}
